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
        this.addState({model:state, name:'home.'+state, url:'/'+state,templateUrl:state+'/list.html',controller:'ListController',title:'Liste des '+state,dataService:state+'Service'},data);
        this.addState({model:state, name:'home.'+state+'-edit', url:'/'+state+'edit/:id',templateUrl:state+'/edit.html',controller:'EditController',title:'Gestion '+state,dataService:state+'Service'},data);
        this.addState({model:state, name:'home.'+state+'-detail', url:'/'+state+'detail/:id',templateUrl:state+'/detail.html',controller:'DetailController',title:'Détail '+state,dataService:state+'Service'},data);
    }
    self.addState = function(state,data){
        var defaultdata={title:state.title,hasdetail:true,candelete:true};
        
        $stateProvider.state(state.name,{
                    url:state.url,
                    cache: false,
                    templateUrl:Paths.template+state.templateUrl,
                    controller:state.controller,
                    data:angular.extend(defaultdata,data),
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
/*
.service('dpService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    var DP = sailsResource('dp',{
        
    });
    
    this.all = function(){
        var d=$q.defer();
        DP.query(
            function(items){d.resolve(items);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de recuperer les offres de prix');
                d.reject(err);
            }
        )
        return d.promise;
    };
    
    this.create = function(){
        return $q(function(resolve, reject) {
            resolve(new DP());
        });
    };
    
    this.save = function(item){
        var d=$q.defer();
        //var cmd=angular.isDefined(item.id)?item.$save:item.$update;
        item.$save(
            function(item){ d.resolve(item);},
            function(err){
                $log.log(err);
                toastr.error('Impossible de sauver l\'offre de prix N°:'+item.numero);
                d.reject(err);
            }
        );
        return d.promise;
    }
    
    this.getById = function(id){
        var d=$q.defer();
        DP.get({id:id},
            function(item){d.resolve(item);},
            function(err){
                 $log.log(err);
                toastr.error('Impossible de recuperer l\'offre de prix id:'+id);
                d.reject(err);
            });
        return d.promise;
    }
}])

.service('matiereService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    var ITEM = sailsResource('matiere',{
        
    });
    
    this.all = function(){
        var d=$q.defer();
        ITEM.query({sort:{'nom':1}},
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
    }
    
    this.getById = function(id){
        var d=$q.defer();
        ITEM.get({id:id},
            function(item){d.resolve(item);},
            function(err){
                 $log.log(err);
                toastr.error('Impossible de recuperer l\'offre de prix id:'+id);
                d.reject(err);
            });
        return d.promise;
    }
}])


.service('nuancematiereService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    var ITEM = sailsResource('nuancematiere',{
        
    });
    
    this.all = function(){
        var d=$q.defer();
        ITEM.query(
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
    }
    
    this.getById = function(id){
        var d=$q.defer();
        ITEM.get({id:id},
            function(item){d.resolve(item);},
            function(err){
                 $log.log(err);
                toastr.error('Impossible de recuperer l\'offre de prix id:'+id);
                d.reject(err);
            });
        return d.promise;
    }
}])*/

.factory('DataService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    var ITEM = null;
    this.modelName='';
    this.init = function(modelName,options){
        ITEM=sailsResource(modelName,options || {});
        this.modelName = modelName;
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
    }
    
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
    }
    
    
    return{
        init:this.init,
        all:this.all,
        create:this.create,
        save:this.save,
        get:this.get,
        resource:function(){return ITEM;}
        
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
;