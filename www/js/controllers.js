angular.module('starter.controllers', ['services'])

.controller('AppCtrl', function($scope, $ionicModal, $state, Auth) {
})

.controller('SettingCtrl', function($scope, $ionicModal, $state) {
  // Form data for the setting modal
  $scope.setting = {};

  $ionicModal.fromTemplateUrl('templates/setting.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('LoginCtrl', function($scope, $state, Auth) {
  // Form data for the login modal
  $scope.loginData = {};

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    // $scope.modal.hide();
    $state.go('app.browse')
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    Auth.login($scope.loginData.name, $scope.loginData.password).then(function(data) {
      console.log('auth passed')
      if(data.success) {
        console.log('auth was successful.')
        $scope.closeLogin();
        $state.go('app.chat')
      } else {
        alert('Username / Password not valid. Try again')
      }
    })
  };
})

.controller('ChatCtrl', function($scope, $state, $ionicScrollDelegate, socket, Auth) {

  //Ensure they are authed first.
  // if(Auth.currentUser() == null) {
  //   $state.go('login');
  //   return;
  // }

  //input models
  $scope.draft = { message: '' };
  $scope.channel = { name: '' };

  //App info
  $scope.channels = [];
  $scope.listeningChannels = [];
  $scope.activeChannel = null;
  // $scope.userName = Auth.currentUser().name;
  $scope.userName = "some.name";
  $scope.messages = [];

  socket.on('message:received', function messageReceived(message) {
    $scope.messages.push(message);
    //Make the chat window scroll to the bottom
    $ionicScrollDelegate.scrollBottom(true);
  });
  $scope.sendMessage = function sendMessage(draft) {
    if(!draft.message || draft.message == null || typeof draft == 'undefined' || draft.length == 0) {
      return;
    }
    socket.emit('message:send', { message: draft.message, name: Auth.currentUser().name });
    $scope.draft.message = '';
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
