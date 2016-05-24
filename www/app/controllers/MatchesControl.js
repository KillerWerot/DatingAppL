DatingAppControllers.controller("MatchesControl", function($scope, $http, $routeParams, Account, $location, $rootScope) {
  modal.show();
  
  Account.CheckLogin(function() {
    if (!Account.loggedIn) {
      $location.path("/login");
      return;
    }
  });
  var matchType = 1;
  if ($rootScope.params !== undefined){
  matchType = $rootScope.params.matchType;
  }
  else{
      $rootScope.params = {};
      $rootScope.params.matchType = 1;
  }
  var process = "FindMatches";
  switch (matchType){
      case 1: 
          process = "FindMatches";
      break;
      case 2:
          process = "GetFriends";
      break;
      case 3:
          process = "FindRequests";
      break;
      case 4:
          process = "RecentChats";
      break;
  }
  if (matchType == 4){
      console.log("RECENT CHATS");
      console.log(localStorage.getItem("recentmessages"));
      $scope.recentChats = true;
      var objectmatches = angular.fromJson(localStorage.getItem("recentmessages"));
        $scope.matches = [];
        var log = [];
        angular.forEach(objectmatches, function(value, key) {
          $scope.matches.push(value);
        }, log);
      $scope.matches.sort(function(a, b) {
          console.log("SORTING ");
          console.log(a);
          console.log(b);
            a = new Date(a.date);
            b = new Date(b.date);
            return a.date>b.date ? 1 : a.date<b.date ? -1 : 0;
        });
      modal.hide();
  }
  else if ($rootScope.lastMatches != process){
      $scope.matches = [];
    	 SendData($http, {
        process: process,
      }, function(response) {
          console.log(response);
    		 $scope.matches = response;
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

