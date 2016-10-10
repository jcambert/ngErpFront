

'use strict';
(function(angular){
    angular.module('ngErp')
    .filter('camelCase',function(){
        function applyReg( input,sreg){
            console.dir('applyReg:'+input);console.dir(sreg);
           return input.split(new RegExp(sreg.reg)).map(function(word){ return word.length>1?word.charAt(0).toUpperCase()+word.slice(1):word.toUpperCase();}).join(sreg.key)
        }
        
        return function(input,uppercaseFirst){
            if(!angular.isString(input) || input.length==0)
                return input;
            if(uppercaseFirst)
                return input.toLowerCase().charAt(0).toUpperCase()+input.slice(1);
            input=input.toLowerCase();
            var sreg=[{key:',',reg:"[,]+"},{key:'-',reg:"[\\-]+"},{key:';',reg:"[;]+"},{key:' ',reg:"[ ]+"}];
            //return sreg.map(applyReg).join();
            angular.forEach(sreg,function(reg){
                input=applyReg(input,reg);
            });
            return input;
            //var reg=new RegExp("[ \\-,;]+", "g");
            //console.dir(input.toLowerCase().split(reg));
            //return input.toLowerCase().split(reg).map(function(word){ return word.length>1?word.charAt(0).toUpperCase()+word.slice(1):word.toUpperCase();}).join(' '); 
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