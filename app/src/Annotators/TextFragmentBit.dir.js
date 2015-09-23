angular.module('Pundit2.Annotators')

.directive('textFragmentBit', function(TextFragmentAnnotator, $injector, Config) {
    return {
        restrict: 'A',
        scope: {
            fragments: '@'
        },
        link: function(scope, element /*, attrs */ ) {
            var numberOfTextFragments = scope.fragments.split(",").length;

            if (Config.clientMode === 'lite') {
                var AnnotationExchange = $injector.get('AnnotationsExchange'),
                    FragmentPopover = $injector.get('FragmentPopover');

                element.on('click', function(evt) {
                    var fragments = element.attr('fragments'),
                        annotations = {};
                    if (typeof fragments !== 'undefined') {
                        fragments = fragments.split(',');
                        for (var fi in fragments) {
                            var uri = TextFragmentAnnotator.getFragmentUriById(fragments[fi]);
                            AnnotationExchange.getAnnotationsByItem(uri).forEach(function(ann) {
                                annotations[ann.id] = ann;
                            });
                        }
                    }
                    var link;
                    if (element.parent()[0].tagName.toUpperCase() === 'A') {
                        link = {
                            url: element.parent().attr('href'),
                            target: element.parent().attr('target'),
                            element: element.parent()
                        };
                    }

                    var data = {
                        annotations: annotations,
                        link: link
                    };
                    FragmentPopover.show(evt.pageX, evt.pageY, data);

                    evt.stopImmediatePropagation();
                    return false;
                });
            }

            TextFragmentAnnotator.addFragmentBit(scope);

            element.addClass('pnd-textfragment-numbers-' + numberOfTextFragments);

            scope.isHigh = false;
            scope.high = function() {
                element.addClass('pnd-textfragment-highlight');
            };
            scope.clear = function() {
                element.removeClass('pnd-textfragment-highlight');
            };

            scope.hide = function() {
                element.addClass('pnd-textfragment-hidden');
            };
            scope.show = function() {
                element.removeClass('pnd-textfragment-hidden');
            };

            scope.ghost = function() {
                element.addClass('pnd-textfragment-ghosted');
            };
            scope.expo = function() {
                element.removeClass('pnd-textfragment-ghosted');
            };

        } // link()
    };
});