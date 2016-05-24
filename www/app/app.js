var app = angular.module("DatingApp", ['onsen', 'ngTouch', 'gajus.swing', 'ngRoute', 'ngFileUpload', 'DatingAppControllers']);
var DatingAppControllers = angular.module('DatingAppControllers', []);
var phpurl = "http://ludoproductions.mx/datingapp/server/clientfunctions.php";

app.directive('googleplace', [ function() {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            details: '=?'
        },
        link: function(scope, element, attrs, model) {
            var options = {
                types: ['(cities)'],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                var geoComponents = scope.gPlace.getPlace();
                var latitude = geoComponents.geometry.location.lat();
                var longitude = geoComponents.geometry.location.lng();
                var addressComponents = geoComponents.address_components;

                addressComponents = addressComponents.filter(function(component){
                    switch (component.types[0]) {
                        case "locality": // city
                            return true;
                        case "administrative_area_level_1": // state
                            return true;
                        case "country": // country
                            return true;
                        default:
                            return false;
                    }
                }).map(function(obj) {
                    return obj.long_name;
                });

                addressComponents.push(latitude, longitude);

                scope.$apply(function() {
                    scope.details = addressComponents; // array containing each location component
                    model.$setViewValue(element.val());
                });
            });
        }
    };
}]);

app.directive('cardchoice', [ function() {
    return {
        require: '',
        scope: {
            like: '=?',
            dislike: '=?',
            match: '=?'
        },
        transclude: 'true',
        replace: 'false',
        template: "<div ng-swipe-right='likecall()' ng-swipe-left='dislikecall()'><ng-transclude></ng-transclude><div style='text-align:center;'><ons-button style='width:48%;' class='btn btn-default' ng-click='likecredit()'>Ficha</ons-button>"
    + "	<ons-button style='width:48%;' class='btn btn-primary' ng-click='likecall()'>Play</ons-button></div>",
        link: function(scope, element, attrs, model) {
            scope.likecall=function(){
                    console.log("SDF");
                   $(element).addClass('rotate-left').delay(500).fadeOut(1);
                   $(element).next().fadeIn(1000);
                   scope.like(scope.match, false);
            };
            scope.likecredit=function(){
                $(element).addClass('rotate-left').delay(500).fadeOut(1);
                   $(element).next().fadeIn(1000);
                   scope.like(scope.match, true);
            }
            scope.dislikecall=function(){
                 console.log("DISLIKE");
                   $(element).addClass('rotate-right').delay(500).fadeOut(1);
                   scope.dislike(scope.match);
            };
            
        }
    };
}]);

/*app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/register', {
      templateUrl: 'partials/register.html',
      controller: "RegisterControl"
    }).
    when('/login', {
      templateUrl: 'partials/login.html',
      controller: "LoginControl"
    }).
    when('/profile/:profileid', {
      templateUrl: 'partials/profile.html',
      controller: "ProfileControl"
    }).
		when('/profile', {
      templateUrl: 'partials/profile.html',
      controller: "ProfileControl"
    }).
		when('/editprofile', {
      templateUrl: 'partials/editprofile.html',
      controller: "EditProfileControl"
    }).
		when('/matches', {
      templateUrl: 'partials/matches.html',
      controller: "MatchesControl"
    }).
		when('/chat/:chatuser', {
      templateUrl: 'partials/chat.html',
      controller: "ChatControl"
    }).
    otherwise({
      redirectTo: '/profile'
    });
  }
]);*/

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

function SendDataPromise($http, data)
{
	return $http({
				method: "POST",
				url: phpurl,
				data: data,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
}

function SendData($http, data, success)
{
		SendDataPromise($http, data).
    success(function(response) {
        success(response);
    }).
    error(function(response) {
        
    });
}
