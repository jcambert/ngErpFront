
(function(angular) {
    "use strict";

    function $stateDecorator($delegate, $injector, $rootScope, $stateParams,$log) {
        function decorated$State() {
            var history=[];
            var $state = $delegate;
            var goback=false;
            $state.previous = undefined;
            function go(state){
                return $state.go( state.route,state.routeParams);
            }
            
            
            
            $rootScope.$on("$stateChangeSuccess", function (ev, to, toParams, from, fromParams) {
                $state.previous = { route: from, routeParams: fromParams };
                $log.log('------------------------------------------------------------');
                if($state.canGoBack())
                    $log.log('Last:'+$state.historyBackState().route.name);
                $log.log('from:'+from.name);
                $log.log('to:'+to.name);
                //if(history.length==0 || (  history.length>0 &&  history[history.length-1].route.name != from.name)){
                if(!goback){
                    history.push($state.previous);
                    $log.log('push history:'+from.name);
                    $log.log($state.historyBackState().route);
                }
                goback=false;
            });

            // Reactivate when authenticaton is on
            /*$rootScope.$on("$stateChangeStart", function (event, toState) {
                var authenticationFactory = $injector.get("authenticationFactory");
                if ((toState.name === appSettings.states.login || toState.name === appSettings.states.register) && authenticationFactory.isUserLoggedIn()) {
                    event.preventDefault();
                    $state.go(appSettings.states.index);
                }
            });*/
            $state.goBack = function(){
                return go($state.previous);
            }
            $state.historyBack = function(){
                var state= history[history.length-1];
                history.splice(-1,1);
                //$log.log(history);
                //$log.log(state);
                goback=true;
                return go(state);
            }
            
            $state.canGoBack = function(){
                return history.length>0 && !history[history.length-1].route.abstract;
            }
            
            $state.historyBackState = function(){
                return history[history.length-1];
            }
            
            $state.forceReload = function() {
                return $state.go($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };


            $state.has = function(name){
                return _.findIndex($state.get(),function(state){
                    return state.name == name;
                }) != -1;
            }
            
            $state.isAbstract = function(name){
                 return _.findIndex($state.get(),function(state){
                    return state.name == name && state.abstract;
                }) != -1;
            }
            return $state;
        }

        return decorated$State();
    }

    $stateDecorator.$inject = ["$delegate", "$injector", "$rootScope","$stateParams","$log"];

    angular
        .module("ngErp")
        .decorator("$state", $stateDecorator);
})(angular);