DatingAppControllers.controller("ProfileControl", function($scope, $http, $routeParams, Account, $location) {
  $scope.mine = false;
  
  
  ons.ready(function() {
    ons.createPopover('popover.html', {parentScope: $scope}).then(function(popover) {
      $scope.popover = popover;
    });
  });
  
  Account.CheckLogin(function() {
    if (!Account.loggedIn) {
      $location.path("/login");
      return;
    }
		
    $scope.mine = (app.navi.getCurrentPage().options.profileid == Account.user.id || profileid == "me");
		
  });
    var profileid = "";
	if (typeof app.navi.getCurrentPage().options.profileid === 'undefined') {
			profileid = "me";
			$scope.mine = true;
	}
    else{
        console.log("PID THERE " +app.navi.getCurrentPage().options.profileid );
        profileid = app.navi.getCurrentPage().options.profileid;
    }
  var gotUser = false;
  SendData($http, {
    process: "GetUserDataById",
    userid: profileid,
    updatelol: true
  }, function(response) {
    $scope.user = response;
    var dateStrings = response.birthday.split("-");
    $scope.user.birthday = new Date(dateStrings[0], dateStrings[1], dateStrings[2], 0, 0, 0, 0);
    $scope.user.age = calculateAge($scope.user.birthday);
		gotUser = true;
        
        var imageName = "";
        switch ($scope.user.loldata.league.tier){
            case "BRONZE":
                imageName = "marcoBronce1.png"
            break;
            case "SILVER":
                imageName = "marcoPlata1.png"
            break;
            case "GOLD":
                imageName = "marcoOro1.png"
            break;
            case "PLATINUM":
                imageName = "marcoPlatino1.png"
            break;
            case "DIAMOND":
                imageName = "diamond.png"
            break;
            case "MASTER":
                imageName = "master.png"
            break;
            case "CHALLENGER":
                imageName = "blueborder.gif"
            break;
        }
        $scope.imagename = imageName;

  });
  
  $scope.Chat = function(){
      console.log("GOING TO CHAT WITH " + profileid);
      app.navi.pushPage('partials/chat.html', {friend: profileid, name: $scope.user.displayname});
  };
	
	$scope.SendRequest = function(){
		SendData($http, {
    process: "SendRequest",
    sendTo: $scope.user.id
  }, function(response) {
    $scope.user.relationship = response;
  });
	};

	$scope.SendRequestCredit = function(){
		SendData($http, {
    process: "SendRequestCredit",
    sendTo: $scope.user.id
  }, function(response) {
    $scope.user.relationship = response;
  });
	};
	
	$scope.AcceptRequest = function(){
		SendData($http, {
    process: "AcceptRequest",
    acceptId: $scope.user.id
  }, function(response) {
      console.log("ACCEPTED, response " + response);
    $scope.user.relationship = response;
  });
	};

  $scope.$watch(function(scope) {
      return Account.loggedIn && gotUser
    },
    function(newValue, oldValue) {
      if (!oldValue && newValue) {
				//console.log(Account.user.meet);
				//console.log($scope.user.meet);
					$scope.user.meet = (Account.user.meet && Boolean($scope.user.meet));
					$scope.user.normal = (Boolean(Account.user.normal) && Boolean($scope.user.normal));
					$scope.user.ranked = (Boolean(Account.user.ranked) && Boolean($scope.user.ranked));
                    $scope.distance = Math.round(getDistanceFromLatLonInKm(Account.user.latitude, Account.user.longitude, $scope.user.latitude, $scope.user.longitude));
       
      }
		
    }
  );



});


function calculateAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}