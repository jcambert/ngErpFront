angular.module('ngErp')
/*
.directive('autoComplete',['$ionicPopover',function($ionicPopover){
   
        var popoverTemplate = 
         '<ion-popover-view style="margin-top:5px">' + 
             '<ion-content>' +
                 '<div class="list">' +
                    '<a href="#" class="item" ng-repeat="item in items | filter:inputSearch track by $index" ng-click="selectItem(item)">{{item.reference}}</a>' +
                 '</div>' +
             '</ion-content>' +
         '</ion-popover-view>';
    
         return {
            restrict: 'A',
            scope: {
                params: '=ionicAutocomplete',
                inputSearch: '=ngModel'
            },
            link: function ($scope, $element, $attrs) {
                console.dir('compile auto complete');
                $scope.items=[""];
                var popoverShown = false;
                var popover = null;
                
                $attrs.$observe('items', function(value){
                    $scope.items = value;//$scope.params.items;
                    console.dir($scope.items);
                });
               
                
                
                //Add autocorrect="off" so the 'change' event is detected when user tap the keyboard
                $element.attr('autocorrect', 'off');


                popover = $ionicPopover.fromTemplate(popoverTemplate, {
                    scope: $scope
                });
                $element.on('focus', function (e) {
                    if (!popoverShown) {
                        popover.show(e);
                    }
                });

                $scope.selectItem = function (item) {
                    $element.val(item.display);
                    popover.hide();
                    $scope.params.onSelect(item);
                };
            }
        };
}])*/


/*
USAGE
<div class="bar bar-header item-input-inset">
    <label class="item-input-wrapper">
        <i class="icon ion-search placeholder-icon"></i>
        <input type="text" placeholder="Reference Article " >
    </label>
    <button class="button ">Cancel</button> 
</div>

<ion-autocomplete 
    ng-model="model" 
    placeholder="Search" 
    icon="ion-search" 
    cancel-label="Annuler" 
    template-url="tpl"
    />
*/
.directive('ionAutocomplete',['$q','$templateRequest','$compile',function($q,$templateRequest,$compile){
    
    function defaultTemplate(){
        return [
            '<div class="bar bar-header item-input-inset">',
                '<label class="item-input-wrapper">',
                    '<i class="icon {{vm.icon}} placeholder-icon"></i>',
                    '<input  type="search" placeholder="{{vm.placeholder}}" ng-change="vm.filter()" ng-model="vm.ngModel">',
                '</label>',
                '<button class="button" ng-if="vm.cancelLabel">{{vm.cancelLabel}}</button>', 
                '<ion-pane class="has-header" ng-if="vm.selectedItems>0" >',
                '   <ion-item  ng-repeat="selectedItem in vm.selectedItems track by $index" class="item-icon-left item-icon-right item-text-wrap">',
                '       {{selectedItem.reference}} {{selectedItem.designation}}',
                '   </ion-item>',
                '</ion-pane>',
            '</div>'
        ].join('');
    }
    return {
        restrict:'E' ,
        require:['ngModel','ionAutocomplete'],
        replace:true,
        scope:{
            
        },
        bindToController:{
          ngModel:'=',
          items:'=',
          placeholder:'@',
          cancelLabel:'@',
          icon:'@',
          templateUrl:'@',
          minLength:'@',//Specifies the minimum length of text before autocomplete will make suggestions
          //searchQuery:'@',//The query to filter
          filterField:'@'
        },
        controllerAs:'vm',
        controller:['$scope','$attrs','filterFilter',function($scope,$attrs,filterFilter){
            /* var valueOrDefault = function (value, defaultValue) {
                return !value ? defaultValue : value;
            };*/
            //this.id = valueOrDefault($attrs.id, undefined);   
            
            var vm=this;
            
            var minLength =Number(vm.minLength);
            var filter ={};
            
            vm.filter = function(){
                if(minLength>vm.ngModel.length){
                    vm.selectedItems=[];
                    return;
                }
                filter[vm.filterField]=vm.ngModel;
                vm.selectedItems=filterFilter(vm.items,filter);
                console.dir(vm.selectedItems);
            }
        }],
        link:function($scope,$element,$attrs,controllers){
             var modelController = controllers[0];
             var autocompleteController = controllers[1];
             var self=this;
            
             // load the template synchronously or asynchronously
             $q.when()
            .then(function () {
                 // first check if a template url is set and use this as template
                    if (autocompleteController.templateUrl) {
                        return $templateRequest(autocompleteController.templateUrl);
                    } else {
                        return defaultTemplate();
                    }
             })
             .then(function(template){
                var elt=angular.element(template);
                
                if(angular.isDefined($attrs.id))elt.find('input').attr('id',$attrs.id);
                 
                 
               /* $scope.$watch('autocompleteController.ngModel',function(newv,oldv){
                    console.dir('Model changed');
                    if(oldv>minLength)
                        console.dir(newv);
                })*/
                 
                 
                 $element.replaceWith($compile(elt)($scope));
             });
        }
    };
}])
;