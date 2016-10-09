
'use strict';
(function(angular){
    angular.module('ngErp')
    .filter('camelCase',function(){
        return function(input,uppercaseFirst){
            if(!angular.isString(input) || input.length==0)
                return input;
            if(uppercaseFirst)
                return input.toLowerCase().charAt(0).toUpperCase()+input.slice(1);
            var reg=new RegExp("[ \\-,;]+", "g");
            console.dir(input.toLowerCase().split(reg));
            return input.toLowerCase().split(reg).map(function(word){ return word.length>1?word.charAt(0).toUpperCase()+word.slice(1):word.toUpperCase();}).join(' '); 
        };
    })
    
    .directive('camelCase',['$filter', function($filter){
        return {
            restrict:'A',
            require:'ngModel',
            link:function(scope, element, attrs, modelCtrl){
                modelCtrl.$parsers.push(function (inputValue) {

                    var transformedInput = $filter('camelCase')(inputValue); 

                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }         

                    return transformedInput;         
                });
            }
        }
        
    }])
    ;
}(angular));