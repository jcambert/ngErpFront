
(function(angular) {
    "use strict";

    function $stateDecorator($delegate, $injector, $rootScope, $stateParams) {
        function decorated$State() {
            var $state = $delegate;
            $state.previous = undefined;
            $rootScope.$on("$stateChangeSuccess", function (ev, to, toParams, from, fromParams) {
                $state.previous = { route: from, routeParams: fromParams }
            });

            /*$rootScope.$on("$stateChangeStart", function (event, toState) {
                var authenticationFactory = $injector.get("authenticationFactory");
                if ((toState.name === appSettings.states.login || toState.name === appSettings.states.register) && authenticationFactory.isUserLoggedIn()) {
                    event.preventDefault();
                    $state.go(appSettings.states.index);
                }
            });*/
            $state.forceReload = function() {
                return $state.go($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };

            return $state;
        }

        return decorated$State();
    }

    $stateDecorator.$inject = ["$delegate", "$injector", "$rootScope"];

    angular
        .module("ngErp")
        .decorator("$state", $stateDecorator);
})(angular);