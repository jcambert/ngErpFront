angular.module('ngErp')
.provider('erpState',['Messages', '$stateProvider','Paths','$injector','StandardStates','SubmenusStates',function(messages,$stateProvider,Paths,$injector,StandardStates,SubmenusStates){
    var self=this;
    
    
        
    
    self.registerStandardStates = function(){
        angular.forEach(StandardStates,function(state){
           self.addStandardState(state.name,state.data || {}); 
        });
    }
    
    self.registerSubmenus = function(){
        angular.forEach(SubmenusStates,function(state){
            $stateProvider.state('home.'+state.name,{
                url:'/'+state.name,
                cache:false,
                templateUrl:'templates/submenus.html',
                controller:'SubmenuController',
                resolve:{
                    menu:function(){return state.name;}
                },
                data:state.data || {title:state.name}
                
            })
        })
    }
    
    self.addStandardState= function(state,data){
       // console.log(state);
        //console.dir(data);
        var defaultdata={hasdetail:false,candelete:true,canedit:true,cancopy:false};
        data=angular.extend({},defaultdata,data);
        //console.dir(data);
        this.addState({model:state, name:'home.'+state, url:'/'+state,templateUrl:state+'/list.html',controller:'ListController',title:'Liste des '+state,dataService:state+'Service'},angular.extend({},data,{mode:'list'}));
        
        if(!('views' in data)){
            this.addState({model:state, name:'home.'+state+'-edit', url:'/'+state+'-edit/:id',templateUrl:state+'/form.html',controller:'FormController',title:'Gestion '+state,dataService:state+'Service'},angular.extend({},data,{mode:'edit'}));
        }else{
            this.addState({model:state, name:'home.'+state+'-edit', url:'/'+state+'-edit/:id',templateUrl:state+'/form.html',controller:'FormController',title:'Gestion '+state,dataService:state+'Service',abstract:true},angular.extend({},data,{mode:'edit'}));
            //this.addState({name:'home.'+state+'-edit.main',url:'/'+state+'-edit/:id/main',views:{name:'main',states:[{name:'main',templateUrl:Paths.template+state+'inner/main.html'}]}});
            _.forEach(data.views,function(view,key){
                _.forEach(view.states,function(nestedView){
                   // _.forEach(nestedView.states,function(nestedState){
                        //console.dir(data.views);
                        //console.dir(nestedState);
                        //console.dir(nestedView);
                        var optionsview={};
                        optionsview.url=nestedView.url;
                        optionsview.data=angular.extend({},data, {mode:'edit',nested:true});
                        optionsview.views={};
                        optionsview.views[view.name]={templateUrl:Paths.template+state+'/inner/'+nestedView.templateUrl+'.html'};
                        console.dir('home.'+state+'-edit.'+nestedView.name);
                        console.dir(nestedView);
                        console.dir(optionsview);
                        $stateProvider.state('home.'+state+'-edit.'+nestedView.name,optionsview);
                    //});
                    
                   
                    
                    //this.addState({name:'home.'+state+'-edit.'+nestedstate.name,url:'/'+nestedstate.url,views:optionsview},{});    
                   //this.addState({},{}); 
                });
                
            });
        }
        this.addState({model:state, name:'home.'+state+'-add',  url:'/'+state+'-add?parent&id', templateUrl:state+'/add.html',controller:'FormController',title:'Gestion '+state,dataService:state+'Service'},angular.extend({},data,{mode:'add'}));
        if(data.hasdetail)
            this.addState({model:state, name:'home.'+state+'-detail', url:'/'+state+'-detail/:id',templateUrl:state+'/detail.html',controller:'DetailController',title:'Détail '+state,dataService:state+'Service'},data);
    }
    
    this.temp = function(state,data){
       // console.dir('****************** addState ************************');
        
      //  console.dir('------------------------------------------------');
    }
    
    self.addView = function(state,data){
        
        $stateProvider.state(state.name,data);
    }
    self.addState = function(state,data){
        //return this.temp(state,data);
       // console.dir('****************** addState ************************');
        var options={
                    url:state.url,
                };
        if('controller' in state)
            angular.extend(options,{controller:state.controller,cache: false});
        if('abstract' in state)
            angular.extend(options,{abstract:state.abstract});
        if('model' in state)
            angular.extend(options,{resolve:{modelName:function(){return state.model;}}});
        if( angular.isDefined(data) )
            angular.extend(options,{data:data});     
        if('templateUrl' in state)
            angular.extend(options,{templateUrl:Paths.template+state.templateUrl})
        if('views' in state)
            angular.extend(options,data.views);
            
        //console.dir('add state '+state.name+' with options');console.dir(options);
        $stateProvider.state(state.name,options);
        //console.dir('------------------------------------------------');
    }
     
    return{
        addStandardState:this.addStandardState,
        addState:this.addState,
        addView:this.addView,
        registerStandardStates:this.registerStandardStates,
        registerSubmenus:this.registerSubmenus,
        $get:function(){
            
        }
    }
}])

.service('ModeService',['$state',function($state){
    this.add = function(){
        return $state.current.data.mode == 'add';
    }
    
    this.edit = function(){
        return $state.current.data.mode == 'edit';
    }
    
    this.list = function(){
        return $state.current.data.mode == 'list';
    }
    
    this.change = function(mode){
        $state.current.data.mode == mode;
    }
}])
.service('MenuService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    var Menu=sailsResource('Menu',{
        byname:{method:'GET',url:'/menu/byname/:name',isArray:false},
        bystate:{method:'GET',url:'/menu/bystate/:state',isArray:false},
        upsert:{method:'POST',url:'/menu/'},
        left:{method:'GET',url:'/menu/left',isArray:true}
    })
    var Item=sailsResource('MenuItem',{});
    
    this.delete = function(id){
        var d=$q.defer();
        this.byId(id)
            .then(function(item){
                item.$delete(function(){d.resolve();})
            }) 
            .catch(function(err){
                d.reject(err);
            });
        return d.promise;
    }
    
    this.list = function(){
        var d=$q.defer();
        Menu.query(
            function(menus){d.resolve(menus);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer les menus');
                d.reject(err);
            }
        )
        return d.promise;
    }
    
    this.create = function(menu){
        var result= new Menu();
        if(angular.isDefined(menu))
            result=angular.extend(result,menu);
            console.dir(result);
        return result;
    };
    
    this.byName = function(name){
         var d=$q.defer();
        Menu.byname(
            {name:name},
            function(menu){
                d.resolve(menu);
            },
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer le menu:'+name);
                d.reject(err);
            }
        );
        return d.promise;
    };
    
    this.byId = function(id){
        var d=$q.defer();
        Menu.get({id:id},
            function(menu){
                d.resolve(menu);
            },
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer le menu:'+nidame);
                d.reject(err); 
                
            }
        );
        return d.promise;
    }
    
    this.upsert = function(menu){
        var d=$q.defer();
        menu.$save(
            function(menu){ d.resolve(menu);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de sauver le menu:'+menu.name);
                d.reject(err);
            }
        );
        return d.promise;
    };
    
    this.createItem = function(menu){
        var item=new Item();
        item.menu=menu.id;
        return item;
    }
    
    this.saveItem = function(item){
         var d=$q.defer();
         if(!angular.isDefined(item.id))
            item.$save(
                function(item){ d.resolve(item);},
                function(err){
                    $log.log(err);
                    toastr.error('Impossible de sauver l\'item:'+item.text);
                    d.reject(err);
                }
            );
         else
            Item.get({id:item.id},function(iitem){
                iitem=angular.extend(iitem,item);
            
                iitem.$save(
                    function(item){ d.resolve(item);},
                    function(err){
                        $log.log(err);
                        toastr.error('Impossible de sauver l\'item:'+item.text);
                        d.reject(err);
                    }
                );
            })
        return d.promise;
    }
    
    
    this.getLeftMenu = function(){
        var d=$q.defer();
        Menu.left(
            function(menus){d.resolve(menus);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer le menu à gauche');
                d.reject(err);
            });
        return d.promise;
    }
    
    this.getByState = function(state){
        var d=$q.defer();
        Menu.bystate({state:state},
                function(menu){
                    d.resolve(menu);
                },
                function(err){
                     $log.log(err);
                    toastr.error('Impossible de recuperer le menu de l\'etat:'+state);
                    d.reject(err);
            });
        return d.promise;
    }
}])

.service('StandardStatesService',['StandardStates','$state',function(StandardStates,$state){
    this.getEditState = function(stateName){
        var statedef=_.filter(StandardStates,function(ss){return ss.name==stateName});
        console.dir(statedef);
        statedef=statedef[0].data;
        if(!angular.isDefined(statedef))return;
        var parent= $state.parent(true);
        parent.push(stateName+ '-edit');
        if(statedef.views && statedef.views.length>0){
            console.dir('stage 1');
            var view=statedef.views[0];
            if(view.states && view.states.length>0){
                console.dir('stage 2');
                parent.push(view.states[0].name);
            }
        }
        console.dir(parent);
        return parent.join('.');
    }
}])
.factory('DataService',['sailsResource','toastr','$log','$q','$rootScope','$injector',function(sailsResource,toastr,$log,$q,$rootScope,$injector){
    var ITEM = null;
    var wrapper = null;
    var self=this;
    this.modelName='';
    this.$scope=null;
    
    
    this.init = function(modelName,$scope,options){
        this.$scope=$scope;
        ITEM=sailsResource(modelName,options || {
            copy:{method:'GET',url:'/'+ modelName+'/copy/:id',isArray:false}
        });
        this.modelName = modelName;
        if(  $injector.has(modelName+'Service')){
            wrapper = $injector.get(modelName+'Service');
            if(angular.isFunction(wrapper.setScope))
                wrapper.setScope($scope);
            else 
                $log.warn('There is no \'setScope\' function in '+modelName + 'Service' );
                
            if(angular.isFunction(wrapper.init))
                wrapper.init();
            else 
                $log.warn('There is no \'init\' function in '+modelName + 'Service' );
            
        }
    }
    
    function callWrapper(method,args){
        if(!angular.isDefined(wrapper))return null;
        if(angular.isFunction(wrapper[method]))
            return wrapper[method](args);
    }
    
    function hasWrapper(method){
        if(!angular.isDefined(wrapper) || wrapper==null )return false;
        if(angular.isDefined(method))
            return angular.isFunction(wrapper[method]);
        return false;
    }
    
    this.all = function(options){
        var toptions={}
       
       angular.extend(toptions, options);
        
        var d=$q.defer();
        ITEM.query(toptions || {},
            function(items){d.resolve(items);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer '+this.modelName );
                d.reject(err);
            }
        )
        return d.promise;
    };
    
    this.create = function(){
        if(hasWrapper('create')){
            console.dir(new ITEM());
            return wrapper.create(new ITEM());
        }
            
        return $q(function(resolve, reject) {
            
            resolve(new ITEM());
        });
    };
    
    this.save = function(item){
        console.dir('saving '+ this.modelName);
        console.dir(item);
        var d=$q.defer();
        item.$save(
            function(item){ d.resolve(item);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer '+this.modelName +'with id:'+id);
                d.reject(err);
            }
        );
        return d.promise;
    };
    
    this.get = function(id){
        var d=$q.defer();
        ITEM.get({id:id},
            function(item){d.resolve(item);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer '+this.modelName +'with id:'+id);
                d.reject(err);
            });
        return d.promise;
    };
    
    this.delete = function(item){
        var d=$q.defer();
        item.$delete(
            function(){d.resolve();},
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer '+this.modelName +'with id:'+id);
                d.reject(err);
            });
        return d.promise;
    };
    
    this.copy = function(id,save){
        var d=$q.defer();
        ITEM.copy({id:id},
            function(newItem){d.resolve(newItem);},
            function(err){
                 $log.log(err);
                toastr.error('Impossible de recuperer '+this.modelName +'with id:'+id);
                d.reject(err);
            });
        return d.promise;
    }
    
    return{
        init:this.init,
        all:this.all,
        create:this.create,
        save:this.save,
        get:this.get,
        delete:this.delete,
        copy:this.copy,
        resource:function(){return ITEM;},
        wrapper:function(){return wrapper;}
        
    }
}])
.service('matiereService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    
}])
.service('chiffragenuancematiereService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    var Mat = sailsResource('matiere',{});
    

    this.allMatiere = function(){
        console.dir('query allmatiere()');
        return Mat.query({sort:{nom:1}});
    }
  
   
}])

.service('contactService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    var Client = sailsResource('client',{});
    

    this.allClient = function(){
        console.dir('query allClient()');
        return Client.query({sort:{nom:1}});
    }
}])

.service('dpService',['sailsResource','toastr','$log','$q','$rootScope',function(sailsResource,toastr,$log,$q,$rootScope){
    var $scope=null;//initialized by DataService or Manually
    var Client = sailsResource('client',{
        ports:{method:'GET',url:'/ports',isArray:false},
        delais:{method:'GET',url:'/delais',isArray:false},
        reglements:{method:'GET',url:'/reglements',isArray:false},
        causesdeclines:{method:'GET',url:'/causesdeclines',isArray:false},
        
    });
    
    var Dp = sailsResource('dp',{
        maxnumero:{method:'GET',url:'/dp/max',isArray:false}
    })
    
    this.init = function(){
        if(!angular.isDefined($scope))return;
        this.getClients().then(function(clients){$scope.clients=clients});
        this.getPorts().then(function(ports){$scope.ports=ports;});
        this.getDelais().then(function(delais){$scope.delais=delais;});
        this.getReglements().then(function(reglements){$scope.reglements=reglements;});
        this.getCausesDeclines().then(function(causes){$scope.causesdeclines=causes;});
    }
    
    this.setScope = function(scope){
        $scope=scope;
    }

    this.create = function(item){
        var d = $q.defer();
        Dp.maxnumero(function(numero){
            console.dir(numero.numero);
             item.numero=Number(numero.numero)+1;
             console.dir(item);
             d.resolve(item);
            });
        return d.promise;
    }

    this.getClients = function(){
        var d=$q.defer();
        //console.dir('query allClient()');
        Client.query({sort:{nom:1}},function(clients){d.resolve(clients);});
        return d.promise;
    };
    
    this.getPorts = function(){
        var d=$q.defer();
        Client.ports(function(items){
            d.resolve(items);
        });
        return d.promise;
    };
    
    this.getDelais = function(){
        var d=$q.defer();
        Client.delais(function(items){
            d.resolve(items);
        });
        return d.promise;
    };
    
    this.getReglements = function(){
        var d=$q.defer();
        Client.reglements(function(items){
            d.resolve(items);
        });
        return d.promise;
    };
    
    this.getCausesDeclines = function(){
        var d=$q.defer();
        Client.causesdeclines(function(items){
            d.resolve(items);
        });
        return d.promise;
    };
}])

.service('ChiffrageService',['sailsResource','toastr','$log','$q','$rootScope','ModeService',function(sailsResource,toastr,$log,$q,$rootScope,mode){
     var $scope=null;//initialized by DataService or Manually
    var Article = sailsResource('article',{
        
    })
    

    
    this.init = function(){
        if(!angular.isDefined($scope))return;
        if(mode.add())
            this.getArticles().then(function(items){$scope.articles=items});
        
    }
    
    this.setScope = function(scope){
        $scope=scope;
    }
    
     this.getArticles = function(){
        var d=$q.defer();
        Article.query(function(items){
            d.resolve(items);
        });
        return d.promise;
    };
}])
;