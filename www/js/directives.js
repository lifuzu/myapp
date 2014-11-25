
angular.module('com.weimed.chat.directives', [])

.directive('browseFile', ['$rootScope', 'USER', function($rootScope, USER) {
  return {
    scope: {},
    replace: true,
    restrict: 'AE',
    link: function(scope, elem, attrs) {
      scope.browseFile = function() {
        document.getElementId('browseBtn').click();
      }

      angular.element(document.getElementId('browseBtn')).on('change', function(e) {
        var file = e.target.files[0];
        angular.element(document.getElementId('browseBtn')).val('');
        var fileReader = new fileReader();
        fileReader.onload = function(event) {
          $rootScope.$broadcast('event:file:selected'. {image: event.target.result, sender: USER.name});
        }
        fileReader.readAsDataURL(file);
      });
    },
    templateUrl: 'view/browse-file.html'
  }
}])

.directive('chatList', ['$rootScope', 'SOCKET_URL', function($rootScope, SOCKET_URL) {
  return {
    scope: {},
    replace: true,
    restrict: 'AE',
    link: function(scope, elem, attrs) {
      var socket = io(SOCKET_URL);
      scope.message = [];
      $rootScope.$on('event:file:selected', function(event, data) {
        socket.emit('event:new:image', data);
        scope.$apply(function(){
          scope.message.unshift(data);
        });
      });
    },
    templateUrl: 'views/chat-list.html'
  }
}]);