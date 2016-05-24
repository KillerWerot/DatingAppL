DatingAppControllers.controller("RegisterControl", function($scope, $http, $location) {
  $scope.errorMessage = "";
  $scope.termsagree = true;

  
  function CheckVariable(variable, errorMessage) {
    if (typeof variable === 'undefined') {
      variable = "";
    }
    if (variable.isEmpty()) {
      $scope.errorMessage = errorMessage;
      return true;
    } else {
      return false;
    }
  }
  

  $scope.SendRegister = function() {
     if ($scope.loading){
         return;
     }
     
     
    
    $scope.loading = true;
    
    if (CheckVariable($scope.firstname, "Please input first name")) {
      registerButton.stopSpin();
      return;
    }
    if (CheckVariable($scope.lastname, "Please input last name")) {
        registerButton.stopSpin();
      return;
    }
    if (CheckVariable($scope.displayname, "Please input display name")) {
        registerButton.stopSpin();
      return;
    }
    if (CheckVariable($scope.email, "Please input email")) {
        registerButton.stopSpin();
      return;
    }
    
    if ($scope.locationdetails === "undefined") {
        $scope.errorMessage = "Please select a location";
        registerButton.stopSpin();
        return;
    }
    
    if (!Date.parse($scope.birthday)) {
         $scope.errorMessage = "Please select a birthday";
      registerButton.stopSpin();
      return;
    }
    
    if (CheckVariable($scope.password, "Please input password")) {
        registerButton.stopSpin();
      return;
    }
    if (CheckVariable($scope.passwordcheck, "Please confirm your password")) {
        registerButton.stopSpin();
      return;
    }
    if ($scope.password != $scope.passwordcheck) {
        registerButton.stopSpin();
      $scope.errorMessage = "Please make sure passwords match";
      return;
    }
    if (!$scope.termsagree) {
        registerButton.stopSpin();
      $scope.errorMessage = "Please agree to terms before registering";
      return;
    }
     $scope.birthdaystring = $scope.birthday.getFullYear() + "-" + ($scope.birthday.getMonth() + 1) + "-" + $scope.birthday.getDate();

    $scope.errorMessage = "";
    console.log("SET");
    var data = {
      "process" : "RegisterUser",
      "firstname": $scope.firstname,
      "lastname": $scope.lastname,
      "displayname": $scope.displayname,
      "email": $scope.email,
      "birthday" : $scope.birthdaystring,
      "sex" : $scope.sex,
      "lookingformen" : $scope.lookingformen, 
      "lookingforwomen" : $scope.lookingforwomen,
      "location": $scope.locationdetails[0] + ", " + $scope.locationdetails[1] + ", " + $scope.locationdetails[2],
      "latitude": $scope.locationdetails[3],
      "longitude": $scope.locationdetails[4],
      "password": $scope.password
    };
    console.log("SENDING");
    SendData($http, data,
      function(response) {
        $scope.loading = false;
        registerButton.stopSpin();
        console.log(response);
        if (response == "1"){
            localStorage.setItem("email", $scope.email);
        localStorage.setItem("password", $scope.password);
          app.navi.replacePage("partials/login.html");
        }
      });
  };



  //Checkbox code
  $('.button-checkbox').each(function() {

    // Settings
    var $widget = $(this),
      $button = $widget.find('button'),
      $checkbox = $widget.find('input:checkbox'),
      color = $button.data('color'),
      settings = {
        on: {
          icon: 'glyphicon glyphicon-check'
        },
        off: {
          icon: 'glyphicon glyphicon-unchecked'
        }
      };

    // Event Handlers
    $button.on('click', function() {
      $checkbox.prop('checked', !$checkbox.is(':checked'));
      $checkbox.triggerHandler('change');
      updateDisplay();
    });
    $checkbox.on('change', function() {
      updateDisplay();
    });

    // Actions
    function updateDisplay() {
      var isChecked = $checkbox.is(':checked');

      // Set the button's state
      $button.data('state', (isChecked) ? "on" : "off");

      // Set the button's icon
      $button.find('.state-icon')
        .removeClass()
        .addClass('state-icon ' + settings[$button.data('state')].icon);

      // Update the button's color
      if (isChecked) {
        $button
          .removeClass('btn-default')
          .addClass('btn-' + color + ' active');
      } else {
        $button
          .removeClass('btn-' + color + ' active')
          .addClass('btn-default');
      }
    }

    // Initialization
    function init() {

      updateDisplay();

      // Inject the icon if applicable
      if ($button.find('.state-icon').length == 0) {
        $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i>');
      }
    }
    init();
  });
  //Checkbox code end
});