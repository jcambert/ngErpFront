angular.module('ngErp')
.service('MenuService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
    var Menu=sailsResource('Menu',{
        byname:{method:'GET',url:'/menu/byname/:name',isArray:false},
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
         console.dir(item);
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
}])

.service('DpService',['sailsResource','toastr','$log','$q',function(sailsResource,toastr,$log,$q){
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
;