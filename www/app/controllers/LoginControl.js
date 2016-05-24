DatingAppControllers.controller("LoginControl", function($scope, $http, Account, $location) {
  $scope.rememberMe = true;
   
    $scope.email = "";
	$scope.password = "";
    $scope.loading = false;
    
    //$('#test').fadeOut(1000);
    
	$scope.LogIn = function(){
        loginButton.startSpin();
        localStorage.setItem("email", $scope.email);
        localStorage.setItem("password", $scope.password);
		$scope.loading = true;
		var data = {
      "process" : "LogIn",
      "email" : $scope.email,
			"password" : $scope.password
    };
    console.log("SENDING");
    SendData($http, data,
      function(response) {
          
          console.log(response);
          if (response == "1"){
              Account.CheckLogin(function(){loginButton.stopSpin(); $scope.loading = false; if (Account.loggedIn){app.navi.replacePage("partials/profile.html");}});
          }
          else{
              loginButton.stopSpin();
          }
					
      });
	};
    
    
    if (localStorage.getItem("email") !== null && localStorage.getItem("password") !== null) {
        $scope.email = localStorage.getItem("email");
        $scope.password = localStorage.getItem("password");
     //   ons.ready(function(){$scope.LogIn();});
    }
    
});