// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('ngErp', ['ionic','toastr','sailsResource', 'formlyIonic','ionic-datepicker','angularMoment','matchMedia','LocalStorageModule'])
.constant('Paths',{template:'templates/'})
.constant('StandardStates',[
    /*{name:'dp',data:{cancopy:true,titles:{list:'Offres de Prix ( {{ items.length+1 }} )',add:'une Offre de prix',edit:'l\'offre de prix {{item.numero}} v{{item.version}} '},views:[{name:'main',states:[{name:'main',states:[{name:'main', url:'/main',templateUrl:'main',icon:'ion-home',title:'Entete'},{name:'report', url:'/report',templateUrl:'report',title:'Rapport',icon:'ion-ios-printer-outline'},{name:'articles', url:'/articles',templateUrl:'articles',title:'Article',icon:'ion-ios-list-outline'},{name:'Gestion', url:'/gestion',templateUrl:'gestion',title:'Gestion',icon:'ion-hammer'}]}]}]}},*/
    {"name":"dp","data":{"cancopy":true,"titles":{"list":"Offres de Prix ( {{ items.length+1 }} )","add":"une Offre de prix","edit":"l'offre de prix {{item.numero}} v{{item.version}} "},"views":[{"name":"main","states":[{"name":"main","url":"/main","templateUrl":"main","icon":"ion-home","title":"Entete"},{"name":"report","url":"/report","templateUrl":"report","title":"Rapport","icon":"ion-ios-printer-outline"},{"name":"articles","url":"/articles","templateUrl":"articles","title":"Articles","icon":"ion-ios-list-outline"},{"name":"Gestion","url":"/gestion","templateUrl":"gestion","title":"Gestion","icon":"ion-hammer"}]}]}},
    
    {name:'article',	data:{titles:{list:'Articles',add:'un article',edit:'l\'article {{item.reference}}'},views:[{name:'main',states:[{name:'main',url:'/main',templateUrl:'main',icon:'ion-home',title:'Entete'},{name:'Chiffrages',url:'/chiffrages',templateUrl:'chiffrages',icon:'ion-social-euro',title:'Chiffrages'},{name:'Dp',url:'/dps',templateUrl:'dps',icon:'ion-ios-list',title:'Offres de Prix'}]}]}},
    
    {name:'chiffrage',	data:{titles:{list:'Chiffrages',add:'un chiffrage',edit:'le chiffrage'},views:[{name:'main',states:[{name:'main',url:'/main',templateUrl:'main',icon:'ion-home',title:'Entete'},{name:'Chiffrages',url:'/chiffrages',templateUrl:'chiffrages',icon:'ion-social-euro',title:'Chiffrages'},{name:'Dp',url:'/dps',templateUrl:'dps',icon:'ion-ios-list',title:'Offres de Prix'}]}]}},
    
    {name:'matiere',data:{titles:{list:'Gestion des matieres',add:'une matiere',edit:'la matiere',fields:['nom']}}},
    {name:'chiffragenuancematiere',data:{titles:{list:'Nuances matieres',add:'une nuance',edit:'la nuance',fields:['nom']}}},
    {name:'chiffragemodeloperation',data:{titles:{list:'Modeles d\'operation',add:'une operation',edit:'l\'operation',fields:['nom']}}},
    {name:'client',data:{titles:{list:'Clients',add:'un client',edit:'le client',fields:['nom']}}},
    {name:'contact',data:{titles:{list:'Contacts',add:'un contact',edit:'le contact',fields:['civilite','nom','prenom']}}}
])
.constant('SubmenusStates',[
    {name:'deviseur',data:{title:'Gestion deviseur'}},
    {name:'commercial',data:{title:'Gestion commerciale'}}
])
.constant('FormMode',{
    add:'Ajouter',
    edit:'Editer'
})
.constant('FormActions',[
    {id:1,text:'Menu',icon:'ion-chevron-down',show:'formMode isTablet',showActionMenu:true,action:'showActionMenu'},
    {id:2,text:'Liste',icon:'ion-android-arrow-back',show:'formMode !isTablet',inActionMenu:true,action:'goToList'},
    {id:3,text:'Ajouter',icon:'ion-ios-plus-empty',show:'listMode', inActionMenu:false,action:'addItem'},
    {id:4,text:'Rechercher',icon:'ion-ios-search',show:'listMode', inActionMenu:false,action:'searchItem'},
    {id:5,text:'Sauver',icon:'ion-android-send',show:'formMode !isTablet canGoBack',inActionMenu:true,action:'saveForm'},
    {id:6,text:'Sauver et Continuer',icon:'ion-ios-download-outline',show:'formMode !isTablet ',inActionMenu:true,action:'saveAndContinueForm'},
    {id:7,text:'Sauver',icon:'ion-ios-download-outline',show:'addMode !isTablet ',inActionMenu:true,action:'saveAndContinueForm'},
    {id:8,text:'Copier',icon:'ion-ios-copy-outline',show:'formMode !isTablet ',inActionMenu:true,action:'copyForm'},
    {id:9,text:'Supprimer',icon:'ion-ios-trash-outline',show:'formMode !isTablet ',inActionMenu:true,action:'deleteForm'},
    {id:10,text:'Imprimer',icon:'ion-ios-printer-outline',show:'formMode !isTablet ',inActionMenu:true,action:'printForm'},
])
.constant('Messages',{
    onModelChanged:'onModelChanged',
    onShowActionMenu:'onShowActionMenu',
    onGoToList:'onGoToList',
    onGoBack:'onGoBack',
    onAdd:'onAdd',
    onSaveForm:'onSaveForm',
    onSaveAndContinueForm:'onSaveAndContinueForm',
    onCopyForm:'onCopyForm',
    onDeleteForm:'onDeleteForm',
    onPrintForm:'onPrintForm'
})
.config(['$stateProvider','$urlRouterProvider','toastrConfig','ionicDatePickerProvider','erpStateProvider',function($stateProvider,$urlRouterProvider,toastrConfig,ionicDatePickerProvider,erpStateProvider){
    console.dir('config application');
    
    
    
    $stateProvider
        .state('home',{
            url:'',
            template:'<ion-nav-view></ion-nav-view>',
            abstract:true
        })
        .state('home.main',{
            url:'/main',
            templateUrl:'templates/main.html'
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
            cache:false,
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
        .state('home.localsettings',{
            url:'/localsettings',
            templateUrl:'templates/localsettings/form.html',
            controller:'LocalSettingsController',
            data:{
                titles:{
                    edit:'Configuration Locale'
                },
                mode:'edit'
            }
        })
       
        erpStateProvider.registerSubmenus(); 
        erpStateProvider.registerStandardStates();
        $urlRouterProvider.otherwise('/main');

        
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


.controller('MainController',['$rootScope', '$scope','$state','Messages','$ionicActionSheet','$ionicHistory','screenSize','FormActions','localStorageService',function($rootScope,$scope,$state,messages,$ionicActionSheet,$ionicHistory,screenSize,FormActions,localStorageService){
    
    $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams, options){ 
            console.dir('reset state');
            console.dir(toState);
            //delete $scope.modelName;
            if(toState.data.mode)
                $scope.mode=toState.data.mode;
            else
                $scope.mode='';
           $scope.state=toState;
          //  console.dir($scope.formMode());
         });
    console.dir('//////// MAIN CONTROLLER  ////////////////');
    /*io.socket.on('connect', function() {console.dir('MainController sails connected')});
    if(! ('localsettings' in localStorageService) || !(angular.isDefined(localStorageService.get('localsettings').restserver))){
        $state.go('home.localsettings');
        return;
    }
        
    io.sails.url =  localStorageService.get('localsettings').restserver;
    io.sails.connect();
    console.dir(io.sails.url);*/
    
    
    $scope.formActions=FormActions;
    
    //$scope.isTablet = screenSize.is('xs') ;
    
    $scope.formActionClick = function(index){
        //console.dir('index:'+index);return;
        if(FormActions[index].action && angular.isFunction($scope[FormActions[index].action]))
            $scope[FormActions[index].action]();
        else if(FormActions[index].message)
            $rootScope.$broadcast(FormActions[index].message);
    }
    
  /*  $rootScope.$on(FormActions[0].message,function(event,args){
        $scope.showActionMenu();
    });
    
    $rootScope.$on(FormActions[1].message,function(event,args){
        
            $scope.goToList();
    })*/
    
    $rootScope.$on(messages.onModelChanged,function(event,args){
       // console.dir(args);
        $scope.modelName=args.modelName;
        $scope.mode=args.mode;
        //console.dir(args);
        //$scope.formMode  = ($scope.mode =='edit' || $scope.mode=='add');
        //$scope.listMode = $scope.mode == 'list';
    })
    
    
    
    $scope.addMode = function(){
        return  $scope.mode=='add';
    }
    
    $scope.formMode = function(){
        return $scope.mode =='edit' ;
    };
    
    $scope.listMode = function(){
        return $scope.mode == 'list';
    };
    
    $scope.addItem = function(){
        //console.dir($state.current.name.split('.').pop());
        $state.go('home.'+ $state.current.name.split('.').pop() +'-add');
    }
    
    $scope.searchItem = function(){
        alert('search item TODO');
    }
    
    $scope.saveForm = function(continueModify){
        $rootScope.$broadcast(messages.onSaveForm,{continueModify:continueModify});
    };

    $scope.saveAndContinueForm = function(){
        $rootScope.$broadcast(messages.onSaveAndContinueForm);
    }
    $scope.copyForm = function(){
        $rootScope.$broadcast(messages.onCopyForm);
    };
    
    $scope.deleteForm = function(){
        $rootScope.$broadcast(messages.onDeleteForm);
    };
    
    $scope.printForm = function(){
        $rootScope.$broadcast(messages.onPrintForm);    
    };
    
    $scope.goBack = function(){
        $state.historyBack();//goBack();
    };
    
    $scope.canGoBack = function(){
        return $state.canGoBack();
    };
    
    $scope.goToList = function(){
        //alert($scope.modelName);
        $state.go('home.'+$scope.modelName);
    };
    
    $scope.showActionMenu = function(){
        var btns=_.filter(FormActions,function(btn){return btn.inActionMenu});
        var tpl =  angular.element('<div><i class="icon "></i></div>') ;console.dir(tpl.html());
        var buttons=[];
        
        angular.forEach(btns,function(btn){
            var tmp='<i class="icon '+ btn.icon+'"></i>'+ (btn.text ||'');
            buttons.push({text: tmp});
        })
       
        $ionicActionSheet.show({
            titleText: 'Menu',
            buttons:buttons,
            buttonClicked: function(index) {
                //console.log('BUTTON CLICKED', index);
                //$rootScope.$broadcast(btns[index].message);
                $scope.formActionClick(_.findIndex(FormActions,function(fa){return fa.id == btns[index].id;}));
                return true;
            },
        });
    };
    
    $scope.isTablet=function(){
        return screenSize.is('xs') ;
    }
    console.dir('---------- MAIN CONTROLLER --------------');

    
}])
.controller('LeftMenuController',['$scope','$injector', function($scope,$injector){
    //io.socket.on('connect', function socketConnected() {
        //console.dir('LeftMenuController sails connected');
        var MenuService = $injector.get('MenuService');
        MenuService.getLeftMenu().then(function(menus){$scope.menus=menus; });
    //});
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
            if(!('name' in menu)){
                var tmpmenu=MenuService.create(defaultMenu);
                MenuService.upsert(tmpmenu).then(function(menu){$scope.menu=menu;});
            }else{
                $scope.menu=menu;
               
            }
        })
        .catch(function(err){
            console.dir(err);
        })
}])
.controller('LocalSettingsController',['$scope','$state','localStorageService','$ionicHistory', function($scope,$state,localStorageService,$ionicHistory){
    $scope.state = $state;
    $scope.item = localStorageService.get('localsettings') ||{};
    console.dir($scope.item);
    $scope.$watch('item',function(oldv,newv){ 
        console.dir('Rest Server has changed');
        console.dir(oldv);
        console.dir(newv);
    },true);
 
    $scope.saveItem = function(){
        console.dir($scope.item.restserver)
        localStorageService.set('localsettings',$scope.item);
        $ionicHistory.nextViewOptions({
            //disableAnimate: true,
            disableBack: true
        });
        $state.go('home.main');
    }
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
    $scope.menu=undefined;
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
    };
    $scope.save = function(){
        alert('save');
        MenuService.upsert($scope.menu);
    };
    
    $scope.editItem = function(index){
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
            $scope.menu=menu;
        });
}])

.controller('ListController',['$ionicNavBarDelegate', '$ionicHistory','Paths','$injector','$scope','$state','$stateParams','$ionicModal','toastr','modelName',function($ionicNavBarDelegate, $ionicHistory,paths,$injector,$scope,$state,$stateParams,$ionicModal,toastr,modelName){
    
    $scope.state=$state;
    $scope.items=[];
    $scope.title='toto';
    //$scope.title=$scope.state.current.data.titles.list;
    //$ionicNavBarDelegate.title($scope.title);
    //$ionicHistory.currentTitle($scope.title);
    var menuService= $injector.get('MenuService');
    
    var dataService= $injector.get('DataService');//var dataService=$injector.get( modelName+'Service');
    dataService.init(modelName);
    $scope.wrapper=dataService.wrapper();
    
    /*if(  $injector.has(modelName+'Service')){
        $scope.wrapper = $injector.get(modelName+'Service');
    }*/

    
    $scope.addItem = function(){
        $state.go('home.'+modelName+'-add');
    }

    $scope.editItem = function(id){
        var name='home.'+modelName+'-edit'
        if($state.has(name+'.main'))
            name=name+'.main';
        $state.go(name,{id:id});
    }
    
    $scope.copyItem = function(id){
        dataService.copy(id).then(
            function(item){
                reload();
            }
        );
    }
    
    $scope.detailItem = function($event,id){
        $state.go('home.'+modelName+'-detail',{id:id});
        $event.preventDefault();
    }
    
    $scope.deleteItem = function($event,item){
        dataService.delete(item).then(function(){$event.preventDefault();reload();});
    }
    
    function reload(){
        menuService.getByState($state.current.name)
            .then(function(menuItem){
                dataService.all(menuItem.listoptions).then(function(items){$scope.items=items;console.dir($scope.items);});
            });
    }

    reload();
}])

.controller('FormController',['StandardStatesService', 'Messages', '$ionicNavBarDelegate', '$rootScope', '$compile', '$ionicHistory','$log', 'FormMode','Paths','$injector','$scope','$state','$stateParams','$ionicModal','toastr','ionicDatePicker','modelName','moment',function(StandardStatesService,messages,$ionicNavBarDelegate,$rootScope, $compile,$ionicHistory,$log,mode,paths,$injector,$scope,$state,$stateParams,$ionicModal,toastr,ionicDatePicker,modelName,moment){
    $scope.state = $state;
    $scope.title = 'title';
    $scope.item = {};
    $scope.nestedTabs = [];
    $scope.numberOfItemsToDisplay = 2;
    var dataService= $injector.get('DataService');//$injector.get( modelName+'Service');
    dataService.init(modelName,$scope);
    $scope.wrapper=dataService.wrapper();
    
    console.dir('*** NEW FORM CONTROLLER ****');

    $rootScope.$broadcast(messages.onModelChanged,{modelName:modelName,mode:$scope.state.current.data.mode});
   /* if(  $injector.has(modelName+'Service')){
        $scope.wrapper = $injector.get(modelName+'Service');
    }*/
    $scope.$on(messages.onSaveForm,function(event,args){
        //alert('save');
        $scope.saveItem(args);
    });
    $scope.$on(messages.onSaveAndContinueForm,function(event,args){
        //alert('save');
        $scope.saveItem({continueModify:true});
    });
    $scope.$on(messages.onCopyForm,function(event,args){
        alert('copy');
    });
    $scope.$on(messages.onDeleteForm,function(event,args){
        alert('delete');
    });
    $scope.$on(messages.onPrintForm,function(event,args){
        alert('print');
    });
    

    $scope.editMode = function(){
        return $scope.state.current.data.mode =='edit';    
    };
    
    $scope.addMode = function(){
        return $scope.state.current.data.mode =='add';    
    };
    
    $scope.goToList = function(){
        //alert($scope.modelName);
        $state.go('home.'+$scope.modelName);
    };
    
    $scope.cancel = function(){
        if($state.canGoBack())
            $state.historyBack();
        else
            $scope.goToList();
    }
    if($scope.editMode())
        dataService.get($stateParams.id).then(function(item){
            $scope.item=item;
            if( angular.isDefined( $stateParams.parent) && angular.isDefined($stateParams.id))
                $scope.item[$stateParams.parent]=$stateParams.id;
            //setTitle();
            //$ionicHistory.currentTitle($scope.title);
            //$ionicNavBarDelegate.title($scope.title);
        });
    else if($scope.addMode()){
        //$log.log('create new '+modelName);
        dataService.create().then(function(item){
            $scope.item=item;//console.dir($scope.item);
            
        }) ;
        //setTitle();
        // $ionicHistory.currentTitle($scope.title);
    }
    
    if(angular.isDefined($state.current.data.nested) && $state.current.data.nested){
        //$scope.nesteds=
        //console.dir($state.current.data);
        _.forEach($state.current.data.views,function(view){
           _.forEach(view.states,function(nestedView){
                   $scope.nestedTabs.push(nestedView);
                   //console.dir(nestedState);
              
           }) 
        });
    }
    
    $scope.pickdate = function(field){
         var ipObj1 = {
            callback: function (val) { 
                //console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                $scope.item[field] = moment(new Date(val)).format('DD/MM/YYYY');
                console.dir($scope.item[field] );
            },
            
        };
        ionicDatePicker.openDatePicker(ipObj1);
    };
    
    function setTitle(){
        //$log.log('setTitle()');
        $scope.title=getTitle();
    }
    function getTitle(){
        var elt=angular.element('<span>{{item.numero}}</span>');
        var result=mode[$scope.state.current.data.mode]+' '+$scope.state.current.data.titles[$scope.state.current.data.mode];
        /*if($scope.state.current.data.mode=='edit' && $scope.state.current.data.titles.fields){
            result=result+' '+ $scope.state.current.data.titles.fields.map(function(item){return $scope.item[item]}).join(' ');
        }*/
        //elt.append(result);
        var content=$compile(elt)($scope);
        console.dir(content.html());
        return content.text();
   }
    

    
    $scope.addItem = function(collection,model){
         var subserv=$injector.get('DataService');
        subserv.init(model);
        
        /*$scope.currentItem= {};
        $scope.currentItem.collection=collection;
        $scope.currentItem.model = model;
        $scope.currentItem.index = -1;
        $scope.currentItem.item = subserv.create();*/
        $state.go('home.'+model+'-add',{parent:modelName,id:$scope.item.id});
        //editItem();
    }
    
    $scope.editItem = function(collection,model,index){
        $scope.currentItem= {};
        $scope.currentItem.collection=collection;
        $scope.currentItem.model = model;
        $scope.currentItem.index =index;
        $scope.currentItem.item = angular.copy($scope.item[collection][index] );
        
        $state.go('home.'+$scope.currentItem.model+'-edit',{id:$scope.currentItem.item.id});
        //editItem();
    };
    
    
    
    function editItem(){
       // var form=paths.template+$scope.currentItem.model+'/edit.html';
        $state.go('home.'+$scope.currentItem.model+'-edit',{id:$scope.currentItem.item.id});
        /*var tpl='<ion-modal-view><ng-include="'+form+'"></ng-include></ion-modal-view>';
        $scope.modal=$ionicModal.fromTemplate(tpl,{scope:$scope,animation:'slide-in-up'});
        $scope.modal.show();*/
        /*$ionicModal.fromTemplateUrl(paths.template+modelName+'/'+$scope.currentItem.model+'.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            modal.show();
        });*/
    }
    
    
    $scope.saveItem = function(args){
        if(angular.isDefined($scope.modal)){
            if(angular.isDefined($scope.currentItem.item) && angular.isDefined($scope.currentItem.item.id))
                $scope.item[$scope.currentItem.collection][$scope.currentItem.index]=$scope.currentItem.item;
            else
                $scope.item[$scope.currentItem.collection].push($scope.currentItem.item);
            $scope.modal.hide();
        }else{
            args=angular.extend({},args || {});
            if(! ('continueModify' in args))
                args.continueModify=false;
            
            console.dir('item save');
            dataService.save($scope.item).then(function(item){
                $scope.item=item;
                toastr.success('Enregistré avec succès');
                
                if($scope.addMode())
                    gotoEditMode();
               
                if(!args.continueModify && $scope.canGoBack() )
                    $state.historyBack();//goBack();
            });
        }
        
    }
    function gotoEditMode(){
        if(!$scope.addMode())return;
        var state=StandardStatesService.getEditState(modelName);
        if(angular.isDefined(state))
            $state.go(state,{id:$scope.item.id});
    }
    
   
    
    $scope.hasParent = function(){
        return (angular.isDefined( $stateParams.parent) && angular.isDefined($stateParams.id)) || angular.isDefined($scope.item[$stateParams.parent]);
    };
    
   $scope.addMoreItem  = function(){
       console.dir('add More Items');
       if ($scope.items.length > $scope.numberOfItemsToDisplay)
          $scope.numberOfItemsToDisplay += 2;
        done();
   }
    
    
   $scope.tabsGo = function($event,goto){
       var parent= $state.parent(true);
       parent.push(goto);
       var state=parent.join('.');
       console.dir(state);
      
       
       
       $state.go(state);
   } 
   $scope.isTabs = function(state){
       return $state.current.name.split('.').pop()==state;
   }
     // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        //$scope.modal.remove();
        $scope.currentItem ={};
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
        //$scope.currentItem ={};
        delete $scope.modal;
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
        
    });
    
    
    
}])

.controller('DetailController',['Paths','$injector','$scope','$state','$stateParams','$ionicModal','toastr','ionicDatePicker','modelName',function(paths,$injector,$scope,$state,$stateParams,$ionicModal,toastr,ionicDatePicker,modelName){
    $scope.state = $state;
    var dataService= $injector.get('DataService');//$injector.get( modelName+'Service');
    dataService.init(modelName);
    
}])

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
                element.replaceWith(clone);
            });
        }
    }
}])
.directive('ngTitle',['$timeout', '$ionicNavBarDelegate', '$ionicHistory', '$rootScope','$compile','FormMode', function($timeout, $ionicNavBarDelegate, $ionicHistory, $rootScope,$compile,mode){
    return{
        restrict:'E',
        require:'ngModel',
        scope:{
            ngModel:'=',
            ngData:'=',
            realTitle:'@'
        },
        link:function($scope,$element,attrs,ctrl){
            
            $scope.realTitle = attrs.realTitle;
            if($scope.ngData.mode=='list'){
                
                $scope.$watch('ngModel',function(newo,oldo){
                    //if(!angular.isDefined($scope.ngModel) || (angular.isArray($scope.ngModel) && $scope.ngModel.length>0) )return;
                    var elt= angular.element('<span></span>');
                   // console.dir('models has changed');
                    $scope.items=$scope.ngModel;
                   // console.dir(oldo);
                    //console.dir(newo);
                    var result=$scope.ngData.titles[$scope.ngData.mode];//console.dir(result);
                    elt.append(result);
                    $scope.realTitle=$compile(elt)($scope);
                    
                    $timeout(function(){
                      //  console.dir($scope.items);
                       // console.dir(oldo);
                    //console.dir(newo);
                        $ionicNavBarDelegate.title($scope.realTitle.text());
                        $ionicHistory.currentTitle($scope.realTitle.text());
                        
                    },1000);
                },true);
            }else{
            
                $scope.$watch('ngModel',function(){
                    
                    //if(!angular.isDefined($scope.ngModel))return;
                    var elt= angular.element('<span></span>');
                    $scope.item=$scope.ngModel;
                    //console.dir(mode[$scope.ngData.mode]);
                    //console.dir($scope.ngData.titles[$scope.ngData.mode]);
                    var result=mode[$scope.ngData.mode]+' '+$scope.ngData.titles[$scope.ngData.mode];
                    if($scope.ngData.mode=='edit' && $scope.ngData.titles.fields){
                        result=result+' '+$scope.ngData.titles.fields.map(function(item){return $scope.ngModel[item]}).join(' ');
                    }
                    elt.append(result);
                    $scope.realTitle=$compile(elt)($scope);
                    $timeout(function(){
                        $ionicNavBarDelegate.title($scope.realTitle.text());
                        $ionicHistory.currentTitle($scope.realTitle.text());
                        
                    },1000);
                
                
                    //$element.replaceWith($scope.realTitle);
                });
            }
            
        }
    }
    
}])
.directive('ngFormMenu',['$compile','screenSize',function($compile,screenSize){
    
    function isTablet(){
        return screenSize.is('xs') ;
    
    }
    return{
        restrict:'E',
        scope:{
            btnData:'=',
            btnIndex:'=',
            btnClick:'&',
            formMode:'=',
            addMode:'=',
            listMode:'='
            //isTablet:'='
        },
        replace:true,
        //template:'<button class="button icon " ></button>',
        link:function($scope,$element,attrs){
           // if(!angular.isDefined($scope.isTablet))
            $scope.isTablet = isTablet;
            
            var tpl=angular.element('<button ng-resizable class="button icon " ></button>');
            tpl.addClass($scope.btnData.icon);
            if($scope.btnData.show){
                var shows=_.filter($scope.btnData.show.split(' '),String);
                angular.forEach(shows,function(show,index){
                    shows[index]=show+'()';
                });
            // console.dir(_.filter(shows,String));
                tpl.attr('ng-hide','!('+shows.join(' && ')+')');
            }
            tpl.click($scope.btnClick);
            /*tpl.on('click',function(e){
                alert($scope.isTablet());
            })*/
            $element.replaceWith($compile(tpl)($scope));
            
            
        }
    }
    
}])
.directive('ngResizable',['$window',function($window){
    return{
        restrict:'A',
        link:function($scope,$element,attr){
            function initializeWindowSize (){
                $scope.windowHeight = $window.innerHeight;
                $scope.windowWidth = $window.innerWidth;
            };
            function cleanUp() {
                angular.element($window).off('resize', onResize);
            }
            function onResize(){
                //console.dir($scope.windowWidth)
                initializeWindowSize();
                $scope.$apply(); 
            }
            initializeWindowSize();
            angular.element($window).bind('resize',onResize);
            $scope.$on('$destroy', cleanUp);
        }
    }
}])
;