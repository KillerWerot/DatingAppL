DatingAppControllers.controller("MatchSwipeControl", function($scope, $http, $routeParams, Account, $location, $rootScope, $timeout) {
  modal.show();
  
  Account.CheckLogin(function() {
    if (!Account.loggedIn) {
      $location.path("/login");
      return;
    }
  });
  if ($rootScope.lastMatches != "FindMatches"){
      $scope.matches = [];
         SendData($http, {
        process: "FindMatches",
      }, function(response) {
    		 $scope.matches = response;
             var index=0;
             angular.forEach($scope.matches, function(match) {
                  match.index = index;
                  index++;
                });
             $rootScope.matches = response;
             $rootScope.sentMatchesRequest;
             $rootScope.lastMatches = "FindMatches";
             modal.hide();

      });
  }
  else{
      $scope.matches = $rootScope.matches;
      modal.hide();
  }
	
	$scope.GoToProfile = function(id){
		//$location.path("/profile/" + id);
        app.navi.pushPage("partials/profile.html", {profileid: id});
	};
	
    $scope.Like = function(match, credit){
        console.log("Liked " + match.index);
        
        $timeout(function () {
            $scope.matches.splice(0,1);
        }, 700);
        
        if (credit){
                SendData($http, {
                process: "SendRequestCredit",
                sendTo: match.id
              }, function(response) {
              });
        }
        else{
        SendData($http, {
            process: "SendRequest",
            sendTo: match.id
          }, function(response) {
          });
        }
        
    };
    
    $scope.Dislike = function(match){
         console.log("Disliked " + match.index);
        $timeout(function () {
            $scope.matches.splice(0,1);
        }, 700);
    };
    
});

