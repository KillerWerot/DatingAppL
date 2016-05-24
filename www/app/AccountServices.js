app.factory('Account', ['$http', '$location',
	function($http, $location) {
		var service = {};
		service.loggedIn = false;
		service.CheckLogin = function(finished, updatelol) {
			updatelol = updatelol || true;
			var isSuccess = false;
			SendDataPromise($http, {
					process: 'GetUser',
					updatelol: updatelol
				})
				.success(function(data) {
					//Set isSuccess here
					//If isSuccess set user data in service.user
				if (data != "0" && data.id !== null){
						isSuccess = true;
					}
					service.loggedIn = isSuccess;
					if (isSuccess){

						var dateStrings = data.birthday.split("-");
						service.user = data;
						service.user.meet = Boolean(service.user.meet);
						service.user.normal = Boolean(service.user.normal);
						service.user.ranked = Boolean(service.user.ranked);
						service.user.birthday = new Date(dateStrings[0], dateStrings[1], dateStrings[2], 0, 0, 0, 0);
					}
					else{
						$location.path("/login");
					}

					if (typeof finished !== 'undefined') {
						finished();
					}

				});

		};

		return service;
	}
]);