'use strict';
(function() {
    var example = angular.module('D3Example', [
        'd3'
    ]);

    example.directive('example', function() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div ng-transclude></div>',
            controller: ['$scope', exctrl]
        }
    });

    var exctrl = function($scope) {
        $scope.data = [];
        var type = function(d) {
            d.apples = +d.apples;
            d.oranges = +d.oranges;
            return d;
        }
        d3.csv('data.tsv', type, function(error, data) {
            $scope.$apply(function() {
                $scope.data = data;
                $scope.datakey = 'oranges';

                $scope.data2 = [
                    {
                        males: 20,
                        females: 40
                    },
                    {
                        males: 40,
                        females: 40
                    },
                    {
                        males: 60,
                        females: 20
                    },
                ];
                $scope.datakey2 = 'males';

                $scope.data3 = [
                    {
                        call1: 20,
                        call2: 30,
                        call3: 10
                    },
                    {
                        call1: 10,
                        call2: 60,
                        call3: 10
                    },
                    {
                        call1: 0,
                        call2: 0,
                        call3: 30
                    }
                ];
                $scope.datakey3 = 'call1';
            });
        });
    }
})();
