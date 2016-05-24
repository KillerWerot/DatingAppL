DatingAppControllers.controller("EditProfileControl", function($scope, $http, $routeParams, Account, $location, Upload) {
  $scope.mine = false;
  console.log("PLIG");
  Account.CheckLogin(function() {
    if (!Account.loggedIn) {
      $location.path("/login");
      return;
    }
    $scope.user = Account.user;
  });

  $scope.payURL = phpurl + "?process=pay";
  $scope.purchasingcredits = 10;
  SendData($http, {
    process: "GetLoggedInSocialNetworks"
  }, function(response) {
    console.log(response);
    $scope.socialnetworks = response;
  });

  SendData($http, {
    process: "GetRatePerCredit"
  }, function(response) {
    $scope.rate = parseFloat(response);
    $scope.UpdatePayment();
  });

  SendData($http, {
    process: "GetBraintreeToken"
  }, function(data) {
    braintree.setup(data, "dropin", {
      container: "payment-form",
      onPaymentMethodReceived: function(obj) {
        console.log(obj.nonce);
        console.log("INIT POST");

        SendData($http, {
          process: 'pay',
          purchasingcredits: $scope.purchasingcredits,
          nonce: obj.nonce
        }, function(data) {
          console.log("DATA");
          console.log(data);
          if (data != "1") {
            //Error
          } else {
            console.log(data);
            $location.path("/profile");
          }
        });

      }

    });
  });


  $scope.UpdatePayment = function() {
    console.log($scope.rate);
    if ($scope.purchasingcredits === null) {
      $scope.toPay = "0.00";
    } else {
      $scope.toPay = (parseInt($scope.purchasingcredits) * $scope.rate).toFixed(2);
      if (isNaN($scope.toPay) || $scope.toPay < 0) {
        $scope.purchasingcredits = 0;
        $scope.toPay = 0.00;
      }

    }
  }

  $scope.GetAuthorization = function(networkid) {
    SendData($http, {
      process: "AuthorizeNetwork",
      id: networkid
    }, function(response) {
      window.location.href = response;
    });
  };

  $scope.UpdateSummonerName = function(summonername) {
    SendData($http, {
      process: "UpdateSummonerName",
      summoner: summonername
    }, function(response) {
      console.log(response);
      if (response == "1") {
        Account.CheckLogin(function() {
          $scope.user = Account.user;
        });
      }
    });
  }

  $scope.UpdateInterests = function() {
    SendData($http, {
      process: "UpdateInterests",
      ranked: $scope.user.ranked ? 1 : 0,
      meet: $scope.user.meet ? 1 : 0,
      normal: $scope.user.normal ? 1 : 0,
      lfm: $scope.user.lfm ? 1 : 0,
      lfw: $scope.user.lfw ? 1 : 0,
      sex: $scope.user.sex
    }, function(response) {
      console.log(response);
    });
  };

  $scope.UploadProfilePicture = function(file) {
    if (file) {
      Upload.upload({
        url: phpurl,
        data: {
          file: file,
          'process': "UploadProfilePicture"
        }
      }).then(function(resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        if (resp.data == "1") {
          $scope.file = null;
          $scope.uploadingpic = false;

          Account.CheckLogin(function() {
            if (!Account.loggedIn) {
              $location.path("/login");
              return;
            }
            $scope.user = Account.user;
          });
        } else {
          //TODO: Error message
        }

        $scope.uploadingAd = false;
      }, function(resp) {
        console.log('Error status: ' + resp.status);
      }, function(evt) {
        $scope.uploadingAd = true;
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $scope.uploadingProgress = progressPercentage;
        $scope.uploadingTotal = 100;

        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    }
  };

});