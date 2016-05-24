DatingAppControllers.controller("ChatControl", function($scope, $interval, $http, Account, $location, $anchorScroll) {
	$scope.messages = [];
	var friend = app.navi.getCurrentPage().options.friend;
    var friendname =  app.navi.getCurrentPage().options.name;
    Account.CheckLogin(function() {
    if (!Account.loggedIn) {
      $location.path("/login");
      return;
    }
    	
  });
	$scope.messagebox = "";
    $scope.messages = [];
    if (localStorage.getItem("recentmessages") === null) {
       localStorage.setItem("recentmessages", angular.toJson({}));
    }
    
    $scope.ScrollToBottom = function(){
     var objDiv = document.getElementById("chatdiv");
    objDiv.scrollTop = objDiv.scrollHeight;
    };
    
    if (localStorage.getItem("messages-" + friend) !== null) {
        $scope.messages = angular.fromJson(localStorage.getItem("messages-" + friend));
    }
    
	function GetMessages() {
		SendData($http, {
			process: "GetMessages",
			from: friend
		}, function(response) {
            angular.forEach(response, function(message) {
                $scope.messages.push({mine:false, message:message});
                
                var recentMessages = angular.fromJson(localStorage.getItem("recentmessages"));
                var recentChat = {};
               recentChat = {};
               recentChat.name = friendname;
               recentChat.id = friend;
               recentChat.message = message;
               recentChat.date = Date.now();
               recentMessages[friend] = recentChat;
            //localStorage.setItem("recentmessages", angular.toJson(recentMessages));
            });
            localStorage.setItem("messages-" + friend, angular.toJson($scope.messages));
            
		});
        $scope.ScrollToBottom();
	};
    
    
    
    $scope.ClearChat = function(){
      $scope.messages = [];  
      var recentMessages = angular.fromJson(localStorage.getItem("recentmessages"));
                delete recentMessages[friend];
            localStorage.setItem("recentmessages", angular.toJson(recentmessages));
    };

	$scope.SendMessage = function() {
        if ($scope.messagebox.isEmpty()){
            return; 
        }
		SendData($http, {
			process: "SendMessage",
			to: friend,
			message: $scope.messagebox
		}, function(response) {
            $scope.messages.push({mine:true, message:$scope.messagebox});
			
			console.log(response);
            localStorage.setItem("messages-" + friend, angular.toJson($scope.messages));
            console.log("Getting " + localStorage.getItem("recentmessages"));
            var recentMessages = angular.fromJson(localStorage.getItem("recentmessages"));
            console.log(recentMessages);
                var recentChat = {};
               recentChat = {};
               recentChat.name = friendname;
               recentChat.id = friend;
               recentChat.message = $scope.messagebox;
               recentChat.date = Date.now();
               recentMessages[friend] = recentChat;

            localStorage.setItem("recentmessages", angular.toJson(recentMessages));
            
            console.log("SENT TO RECFENT");
            $scope.messagebox = "";
		});
	};
    GetMessages();
    var checkMessages = $interval(GetMessages, 1000);
    
    $scope.$on('$destroy',function(){
    if(checkMessages)
        $interval.cancel(checkMessages);   
});


});