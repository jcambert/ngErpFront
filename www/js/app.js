// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('ngErp', ['ionic','toastr','sailsResource', 'formlyIonic','ionic-datepicker','angularMoment'])
.constant('Paths',{template:'templates/'})
.config(['$stateProvider','$urlRouterProvider','toastrConfig','ionicDatePickerProvider','erpStateProvider',function($stateProvider,$urlRouterProvider,toastrConfig,ionicDatePickerProvider,erpStateProvider){
    console.dir('config application');
    
    
    
    $stateProvider
        .state('home',{
            url:'',
            template:'<ion-nav-view></ion-nav-view>',
            abstract:true
        })
        .state('home.settings',{
            url:'/settings',
            templateUrl:'templates/submenus.html',
            controller:'SettingsController',
            data:{
                title:'Parametrages'
            }
        })
        .state('home.settings-menus',{
            url:'/menus',
            templateUrl:'templates/menus.list.html',
            controller:'MenuListController',
            data:{
                title:'Gestion des menus'
            }
        })
        .state('home.settings-menus-edit',{
            url:'/menus/:id',
            templateUrl:'templates/menus.edit.html',
            controller:'MenuEditController',
            data:{
                title:'Edition de menu'
            }
        })
        .state('home.commercial',{
            url:'/commercial',
            templateUrl:'templates/submenus.html',
            controller:'SubmenuController',
            resolve:{
                menu:function(){return 'commercial';}
            },
            data:{
                title:'Gestion Commerciale'
            }
            
        })
        .state('home.deviseur',{
            url:'/deviseur',
            templateUrl:'templates/submenus.html',
            controller:'SubmenuController',
            resolve:{
                menu:function(){
                    return 'deviseur';
                }
            },
            data:{
                title:'Gestion Quotation'
            }
            
        })
        
        /*.state('home.dp',{
            url:'/dp',
            templateUrl:'templates/dp/list.html',
            controller:'DpListController',
            data:{
                title:'Gestion des offres de prix'
            }
            
        })*/
        /*.state('home.dp-edit',{
            url:'/dpedit/:id',
            templateUrl:'templates/dp/edit.html',
            controller:'DpEditController',
            data:{
                title:'Edition d\'une offre de prix'
            }
        })*/
        ;
        
        //erpStateProvider.addState({name:'home.dp',url:'/dp',templateUrl:'dp/list.html',controller:'DpListController',title:'Gestion des dps',dataService:'DpService'});
        erpStateProvider.addStandardState('dp');
        //erpStateProvider.addState({name:'home.dp-edit',url:'/dpedit/:id',templateUrl:'dp/edit.html',controller:'DpEditController',title:'Edition d\'une offre de prix',dataService:'DpService'});
        $urlRouterProvider.otherwise('/');
    
     angular.extend(toastrConfig, {

        templates: {
            toast: 'templates/toast/toast.html',
            progressbar: 'templates/progressbar/progressbar.html'
        }
    });
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Choisissez une Date',
      setLabel: 'Set',
      todayLabel: 'Aujourd\'hui',
      closeLabel: 'Fermer',
      mondayFirst: false,
      weeksList: ["D", "L", "M", "M", "J", "V", "S"],
      monthsList: ["Jan", "Fev", "Mars", "Avril", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
    
}])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.directive('erpViewList',['Paths','$compile', function(paths,$compile){
    return {
        restrict:'E',
        replace:true,
        transclude:true,
        templateUrl:paths.template+'components/erpViewList.html',
        
        
        
    }
}])

.directive('erpViewListContent',['Paths',function(paths){
    return{
        restrict:'E',
        replace:true,
        transclude:'element',
        templateUrl:paths.template+'components/erpViewListContent.html',
        scope:{
            item:'='
        },
        link:function(scope,element,attrs,ctrl,transclude){
          // console.dir(element.html());
            transclude(scope, function (clone) {
                    // be sure elements are inserted
                // into html before linking
                console.dir(clone.html());
                element.replaceWith(clone);
            });
        }
    }
}])
.controller('LeftMenuController',['$scope','MenuService', function($scope,MenuService){
    MenuService.getLeftMenu().then(function(menus){$scope.menus=menus;console.dir(menus);});
}])
.controller('SettingsController',['$scope','$state','MenuService', function($scope,$state,MenuService){
    var defaultMenu={
        name:'settings',
        items:[
            {
                text:'Menus',
                state:'home.settings-menus',
                icon:'ion-navicon'
            }
        ]
    };
    $scope.state=$state;
    MenuService.byName('settings')
        .then(function(menu){
             console.dir(menu);
            if(!('name' in menu)){
                var tmpmenu=MenuService.create(defaultMenu);
                MenuService.upsert(tmpmenu).then(function(menu){$scope.menu=menu;});
            }else{
                $scope.menu=menu;
               
            }
        })
        .catch(function(err){
            
        })
}])

.controller('MenuListController',['$scope','$state','MenuService','$ionicModal','toastr',function($scope,$state,MenuService,$ionicModal,toastr){
    $scope.state=$state;
    $scope.menus = {}
    reload();
    function reload(){
        MenuService.list().then(function(menus){$scope.menus=menus;console.dir(menus);});
    }
    $scope.addItem = function(){
        $scope.currentItem=MenuService.create();
        console.dir($scope.currentItem);
        $scope.editItem();
    }
    $scope.deleteItem = function(index){
        var name=$scope.menus[index].name;
        MenuService.delete($scope.menus[index].id).then(function(){
            toastr.success('Menu '+name +' supprimé avec succès');
            reload();
        })
    }
    $scope.editItem = function(index){
        if( angular.isDefined(index)){
            $scope.currentItem=angular.copy($scope.menus[index]);
        }
        
        $scope.modal.show();
    }
    $scope.save = function(){
        MenuService.upsert($scope.currentItem).then(function(){
            reload();
            $scope.modal.hide();
        });
    }
     $ionicModal.fromTemplateUrl('templates/menus.menu.edit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
}])

.controller('MenuEditController',['$scope','$state','$stateParams','MenuService','$ionicModal','toastr',function($scope,$state,$stateParams,MenuService,$ionicModal,toastr){
    $scope.state=$state;
    $scope.menu={};
    MenuService.byId($stateParams.id).then(function(menu){$scope.menu=menu;console.dir(menu);})
    $ionicModal.fromTemplateUrl('templates/menus.items.edit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.addItem = function(){
        $scope.menu.items.push(MenuService.createItem($scope.menu));
        $scope.editItem($scope.menu.items.length-1);
        console.dir($scope.menu);
    };
    $scope.save = function(){
        alert('save');
        MenuService.upsert($scope.menu);
    };
    
    $scope.editItem = function(index){
        console.dir($scope.menu.items[index]);
        $scope.currentItem=angular.copy($scope.menu.items[index]);
        $scope.currentIndex=index;
        $scope.modal.show();
    }  
    
    $scope.saveItem = function(){
        
        MenuService.saveItem($scope.currentItem).then(function(item){
            $scope.menu.items[$scope.currentIndex]=item;
            $scope.modal.hide();
            toastr.success($scope.currentItem.text + ' sauver');    
        });
        
    }
}])
.controller('SubmenuController',['$scope','$state','MenuService','menu',function($scope,$state,MenuService,menu){
    $scope.state=$state;
    MenuService.byName(menu)
        .then(function(menu){
             console.dir(menu);
            $scope.menu=menu;
        });
}])

.controller('ListController',['Paths','$injector','$scope','$state','$stateParams','$ionicModal','toastr','modelName',function(paths,$injector,$scope,$state,$stateParams,$ionicModal,toastr,modelName){
    $scope.state=$state;
    
    var dataService=$injector.get( modelName+'Service');
     $ionicModal.fromTemplateUrl(paths.template+modelName+'/add.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $scope.addItem = function(){
        dataService.create().then(function(item){
            $scope.currentItem=item;        
            $scope.modal.show();
        })
    }
    
   
    $scope.saveItem = function(){
        dataService.save($scope.currentItem).then(function(){
            $scope.modal.hide();
        })
    }
    
    $scope.editItem = function(id){
        $state.go('home.'+modelName+'-edit',{id:id});
    }
    
    $scope.detailItem = function(id){
        $state.go('home.'+modelName+'-detail',{id:id});
    }
    
    function reload(){
        dataService.all().then(function(items){$scope.items=items;});
    }
    
    reload();
}])

.controller('EditController',['Paths','$injector','$scope','$state','$stateParams','$ionicModal','toastr','ionicDatePicker','modelName','moment',function(paths,$injector,$scope,$state,$stateParams,$ionicModal,toastr,ionicDatePicker,modelName,moment){
    $scope.state = $state;
    var dataService=$injector.get( modelName+'Service');
    dataService.getById($stateParams.id).then(function(item){
        $scope.item=item;
    });
    
    $scope.pickdate = function(field){
         var ipObj1 = {
            callback: function (val) { 
                //console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                $scope.item[field] = moment(new Date(val)).format('YYYY-MM-DD');
                console.dir($scope.item[field] );
            },
            
        };
        ionicDatePicker.openDatePicker(ipObj1);
    };
    
    $scope.saveItem = function(){
        dataService.save($scope.item).then(function(item){
            $scope.item=item;
            toastr.success('Enregistré avec succès');
        });
    }
}])

.controller('DetailController',['Paths','$injector','$scope','$state','$stateParams','$ionicModal','toastr','ionicDatePicker','modelName',function(paths,$injector,$scope,$state,$stateParams,$ionicModal,toastr,ionicDatePicker,modelName){
    $scope.state = $state;
    var dataService=$injector.get( modelName+'Service');
    
}])
;