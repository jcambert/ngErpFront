angular.module('ngErp')
.provider('erpState',['$stateProvider','Paths','$injector','StandardStates','SubmenusStates',function($stateProvider,Paths,$injector,StandardStates,SubmenusStates){
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
        console.log(state);
        console.dir(data);
        var defaultdata={hasdetail:false,candelete:true,canedit:true,cancopy:false,toro:true};
        data=angular.extend({},defaultdata,data);
        console.dir(data);
        this.addState({model:state, name:'home.'+state, url:'/'+state,templateUrl:state+'/list.html',controller:'ListController',title:'Liste des '+state,dataService:state+'Service'},data);
        
        this.addState({model:state, name:'home.'+state+'-edit', url:'/'+state+'-edit/:id',templateUrl:state+'/form.html',controller:'FormController',title:'Gestion '+state,dataService:state+'Service'},angular.extend({},data,{mode:'edit'}));
        this.addState({model:state, name:'home.'+state+'-add',  url:'/'+state+'-add?parent&id', templateUrl:state+'/form.html',controller:'FormController',title:'Gestion '+state,dataService:state+'Service'},angular.extend({},data,{mode:'add'}));
        if(data.hasdetail)
            this.addState({model:state, name:'home.'+state+'-detail', url:'/'+state+'-detail/:id',templateUrl:state+'/detail.html',controller:'DetailController',title:'Détail '+state,dataService:state+'Service'},data);
    }
    self.addState = function(state,data){
        
        
        $stateProvider.state(state.name,{
                    url:state.url,
                    cache: false,
                    templateUrl:Paths.template+state.templateUrl,
                    controller:state.controller,
                    data:data,
                    resolve:{
                        //dataService:function(){return state.dataService;},
                        modelName:function() {return state.model;}
                    }
                });
    }
     
    return{
        addStandardState:this.addStandardState,
        addState:this.addState,
        registerStandardStates:this.registerStandardStates,
        registerSubmenus:this.registerSubmenus,
        $get:function(){
            
        }
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


.factory('DataService',['sailsResource','toastr','$log','$q','$rootScope','$injector',function(sailsResource,toastr,$log,$q,$rootScope,$injector){
    var ITEM = null;
    var wrapper = null;
    var self=this;
    this.modelName='';
    
    
    
    this.init = function(modelName,options){
        ITEM=sailsResource(modelName,options || {});
        this.modelName = modelName;
        if(  $injector.has(modelName+'Service')){
            wrapper = $injector.get(modelName+'Service');
        }
    }
    
    function callWrapper(method,args){
        if(!angular.isDefined(wrapper))return null;
        if(angular.isFunction(wrapper[method]))
            return wrapper[method](args);
    }
    
    this.all = function(options){
        var toptions={}
       
       angular.extend(toptions, options);
        
        var d=$q.defer();
        ITEM.query(toptions || {},
            function(items){d.resolve(items);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer les matieres');
                d.reject(err);
            }
        )
        return d.promise;
    };
    
    this.create = function(){
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
                toastr.error('Impossible de sauver l\'offre de prix N°:'+item.numero);
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
                toastr.error('Impossible de recuperer l\'offre de prix id:'+id);
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
                toastr.error('Impossible de recuperer l\'offre de prix id:');
                d.reject(err);
            });
        return d.promise;
    };
    
    this.copy = function(id,save){
        var d=$q.defer();
        this.get(id).then(
            function(item){
                delete item.id;
                delete item.createdAt;
                delete item.updatedAt;
                item=callWrapper('copy',item);
                console.dir(item.version);
                if(save)
                    self.save(item).then(
                        function(item){
                            d.resolve(item);
                        },
                        function(err){
                            $log.log(err);
                            toastr.error('Impossible de recuperer l\'offre de prix id:'+id);
                            d.reject(err);
                    });
                else
                    d.resolve(item);
                
            },
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer l\'offre de prix id:'+id);
                d.reject(err);
            }
        );
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
    var Client = sailsResource('client',{});
    var scope = $rootScope.$new();
    scope.$on('dataService.copyItem',function(event,args){
        console.dir(args.item);
    })
    

    this.allClient = function(){
        console.dir('query allClient()');
        return Client.query({sort:{nom:1}});
    };
    
    this.copy = function(item){
        console.dir('dpService Wrapper.copy');
        console.dir(item.version);
        item.version=item.version+1;
        item.solde = true;
        console.dir(item.version);
        return item;
    }
}])
;