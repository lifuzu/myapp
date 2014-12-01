angular.module('starter.controllers', ['services'])

.controller('AppCtrl', function($scope, $ionicModal, $state, Auth) {
})

.controller('SettingCtrl', function($scope, $ionicModal, Setting) {
  // Form data for the setting modal
  $scope.setting = Setting.get();

  function closeModal() {
    if ($scope.modal) {
      $scope.modal.remove();
      delete $scope.modal;
    }
  }

  $scope.openModal = function() {
    $ionicModal.fromTemplateUrl('templates/setting.html', function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  };
  $scope.closeModal = function() {
    closeModal();
  };
  $scope.syncUp = function(setting) {
    console.log('Doing sync', setting);
    Setting.syncup(setting).then(function(data) {
      if(data.success) {
        console.log('Setting was syncing up.')
        closeModal();
      } else {
        alert('Setting was NOT syncing up, try again!')
      }
    })
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    closeModal();
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

.controller('ChatCtrl', function($scope, $rootScope, $state, $ionicScrollDelegate, socket, Setting, $localstorage, $cordovaSQLite) {

  //Ensure they are authed first.
  // if(Auth.currentUser() == null) {
  //   $state.go('login');
  //   return;
  // }

  // for opening a background db:
  // var db = $cordovaSQLite.openDB({ name: "my.db", bgType: 1 });
  var userid = uuid.v4();

  $scope.insert = function() {
    var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["hide", '100']).then(function(res) {
      console.log("insertId: " + res.insertId);
      console.log("userId: " + userid);
      swal({   title: "Sweet!", text: userid, imageUrl: "img/ionic.png" });
    }, function (err) {
      console.error(err);
    });
  };

  $scope.select = function(lastname) {
    var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
    $cordovaSQLite.execute(db, query, [lastname]).then(function(res) {
      if(res.rows.length > 0) {
        console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
      } else {
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
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
  //$scope.messages = $localstorage.getObject('messages');

  socket.on('event:incoming:image',function(data){
    $scope.$apply(function(){
      $scope.messages.unshift(data);
    });
  });
  $rootScope.$on('event:file:selected', function(event, data) {
    socket.emit('event:new:image', data);
    $scope.$apply(function(){
      $scope.messages.unshift(data);
    });
  });

  socket.on('message:received', function messageReceived(message) {
    $scope.messages.unshift(message);
    //$localstorage.setObject('messages', $scope.messages);
    //Make the chat window scroll to the bottom
    //$ionicScrollDelegate.scrollBottom(true);
  });
  $scope.sendMessage = function sendMessage(draft) {
    if(!draft.message || draft.message == null || typeof draft == 'undefined' || draft.length == 0) {
      return;
    }
    socket.emit('message:send', { message: draft.message, name: Setting.get().nickname || 'anonymous' });
    $scope.draft.message = '';
  };

  socket.emit('user:joined', { name: Setting.get().nickname || 'anonymous'} );
  socket.on('user:joined', function(user) {
    $scope.messages.unshift(user);
  })
})

.controller('HomeCtrl', function($scope, USER, $state) {
  $scope.user = {};
  $scope.next = function() {
    USER.name = $scope.user.name;
    $state.go('chat');
  }
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
