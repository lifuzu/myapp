var baseUrl = "http://lab.weimed.com:3001/"
//var baseUrl = "http://localhost:3000/"

angular.module('services', [])

.factory('socket', function socket($rootScope) {
  var socket = io.connect(baseUrl);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    setObjectArray: function(key, value) {
      var array = [];
      array = JSON.parse($window.localStorage.getItem(key)) || [];
      array.push(value);
      $window.localStorage.setItem(key, JSON.stringify(array));
    },
    getObjectArray: function(key) {
      var array = [];
      array = JSON.parse($window.localStorage.getItem(key)) || [];
      return array;
    }
  }
}])

.factory('Setting', function Setting($q, $http) {
  var setting = JSON.parse(window.localStorage.getItem('setting') || '{}');

  var syncup = function syncup(setting) {
    var deferred = $q.defer();

    var url = baseUrl + 'setting';
    var data = { setting: setting };

    $http.post(url, data).success(function(res) {
      if(res.success && (res.success == true || res.success == "true")) {
        setting = res.setting;
        window.localStorage.setItem('setting', JSON.stringify(setting));
        return deferred.resolve(res);
      } else {
        return deferred.resolve('Setting not be synced!');
      }
    }).error(function(error) {
      deferred.reject(error);
    })

    return deferred.promise;
  }

  var get = function get() {
    return setting;
  }

  return {
    get: get,
    syncup: syncup
  };
})

.factory('Auth', function Auth($q, $http) {
  var user = null;

  try {
    user = JSON.parse(window.localStorage.getItem('user'));
  } catch(ex) { /* Silently fail, no user */ }

  var login = function login(name, password) {
    var deferred = $q.defer();

    var url = baseUrl + 'login';
    var postData = { name: name, password: password };

    $http.post(url, postData).success(function(response) {
      if(response.success && (response.success == true || response.success == "true")) {
        user = { name: response.name, id: response.id };
        window.localStorage.setItem('user', JSON.stringify(user));
        return deferred.resolve(response);
      } else {
        return deferred.resolve('No user found');
      }
    }).error(function(error) {
      //Fail our promise.
      deferred.reject(error);
    })

    return deferred.promise;
  }

  var currentUser = function currentUser() {
    return user;
  }

  var logout = function logout() {
    user = null;
    window.localStorage.removeItem('user');
  }

  return {
    login: login,
    logout: logout,
    currentUser: currentUser
  };
})