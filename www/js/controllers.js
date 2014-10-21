angular.module('starter.controllers', ['services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, Auth) {
  // Form data for the login modal
  $scope.loginData = {};
 
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
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
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    // $timeout(function() {
    //   $scope.closeLogin();
    // }, 1000);
  };
})

.controller('ChatCtrl', function($scope, $state, socket, Auth) {
  //Assign the messages statically
  // $scope.messages = [
  //   { name: 'nameHelo', message: 'World!' },
  //   { name: 'nameHero', message: 'World2!' }
  // ];

  //Ensure they are authed first.
  if(Auth.currentUser() == null) {
    // $state.go('login');
    login()
    return;
  }

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
  });
  $scope.sendMessage = function sendMessage(draft) {
    if(!draft.message || draft.message == null || typeof draft == 'undefined' || draft.length == 0) {
      return;
    }
    socket.emit('message:send', { message: draft.message, name: "Auth.name" });
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
