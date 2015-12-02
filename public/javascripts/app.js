(function() {
    'use strict';

    angular
        .module('nodeTodo', [])
        .controller('mainController', function($scope, $http) {
            $scope.formData = {};
            $scope.todoDada = {};

            $http.get('/api/v1/todos')
                .success(function(data) {
                    $scope.todoData = data;
                })
                .error(function(data) {
                    console.log('Error: ' + error);
                });

            $scope.createTodo = function(todo) {
                $http
                    .post('/api/v1/todos', todo)
                    .success(function(data) {
                        $scope.formData = {};
                        $scope.todoData = data;
                        console.log(data);
                    })
                    .error(function(error) {
                        console.log('Error: ' + data);
                    });
            }

            $scope.deleteTodo = function(todoID) {
                $http
                    .delete('/api/v1/todos/' + todoID)
                    .success(function(data) {
                        $scope.todoData = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            }
        });
})();
