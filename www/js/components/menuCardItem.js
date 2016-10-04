angular.module('ngErp')
.directive('menuCardItem',function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'templates/components/menuCardItem.html',
        scope:{
            sref:'@',
            icon:'@',
            text:'@'
        },
        link:function(scope,elt,attrs){
            console.dir('linking menuCardItem');
        }
    }
})