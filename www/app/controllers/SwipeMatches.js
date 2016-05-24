DatingAppControllers.controller("SwipeMatchesControl", function($scope, $http, $routeParams, Account, $location, $rootScope) {
  modal.show();
  
  Account.CheckLogin(function() {
    if (!Account.loggedIn) {
      $location.path("/login");
      return;
    }
  });
  if ($rootScope.lastMatches != process){
      $scope.matches = [];
    	 SendData($http, {
        process: "FindMatches",
      }, function(response) {
          console.log(response);
    		 $scope.matches = response;
             var index=0;
             angular.forEach($scope.matches, function(match) {
                  match.index = index;
                  index++;
                });
             $rootScope.matches = response;
             $rootScope.sentMatchesRequest;
             $rootScope.lastMatches = process;
             modal.hide();
             console.log("Got response, modal");
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
	
});

