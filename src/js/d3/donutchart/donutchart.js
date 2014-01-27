'use strict';
(function() {
    var donutchart = angular.module('donutchart', [
        'donutchart'
    ]);

    var donutCtrl = function($scope) {
    };

    donutchart.directive('d3Donutchart', function() {
        var link = function(scope, elem, attrs) {
            var color = d3.scale.category20(),
                radius,
                pie,
                arc,
                svg,
                g,
                path;

            function buildSvg() {
                radius = Math.min(scope.width, scope.height);
                pie = d3.layout.pie()
                    .value(function(d) {
                        return d[scope.key];
                    })
                    .sort(null);

                arc = d3.svg.arc()
                    .innerRadius(radius * 0.25)
                    .outerRadius(radius * 0.5);

                if(svg) {
                    svg.empty();
                }
                else {
                    svg = d3.select(elem[0]);
                }
                svg.attr('width', scope.width).attr('height', scope.height);
                g = svg.append('g').attr('transform', 'translate(' + scope.width / 2 + ',' + scope.height / 2 + ')');
            }

            scope.$watch('width', function(newVal, oldVal) {
                if(oldVal != newVal) {
                    buildSvg();
                }
            });

            scope.$watch('height', function(newVal, oldVal) {
                if(oldVal != newVal) {
                    buildSvg();
                }
            });

            scope.$watch('data', function(newVal, oldVal) {
                if(oldVal != newVal) {
                    path = g.datum(scope.data)
                        .selectAll('path')
                        .data(pie)
                        .enter().append('path')
                        .attr('fill', function(d, i) {
                            return color(i);
                        })
                        .attr('d', arc)
                        .each(function(d) {
                            this._current = d;
                        });
                }
            });

            scope.$watch('key', function(newVal, oldVal) {
                if(newVal && oldVal && newVal != oldVal) {
                    pie.value(function(d) {
                        return d[newVal];
                    });
                    path = path.data(pie);
                    path.transition().duration(750).attrTween('d', function(a) {
                        var i = d3.interpolate(this._current, a);
                        this._current = i(0);
                        return function(t) {
                            return arc(i(t));
                        };
                    });
                }
            });

            buildSvg();
        };

        return {
            restrict: 'E',
            replace: true,
            scope: {
                width: '@',
                height: '@',
                key: '=',
                data: '='
            },
            template: '<svg></svg>',
            link: link,
            controller: ['$scope', donutCtrl]
        }
    });
})();
