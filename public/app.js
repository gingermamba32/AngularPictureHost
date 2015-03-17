var pullPix=angular.module("pullPix",["ngRoute"]);angular.module("pullPix").controller("ApplicationCtrl",["$scope",function(t){t.$on("login",function(e,n){t.currentUser=n})}]),angular.module("pullPix").controller("ImgMetaCtrl",["$scope","ImgMetaSvc",function(t,e){t.ImgUpdate=function(t){t&&e.create({userid:t.userid,imgpath:t.imgpath,imgtitle:t.imgtitle,imgdesc:t.imgdesc,imgtag:t.imgtag}).success(function(e){console.table(e),t=null})}}]),angular.module("pullPix").controller("ListCtrl",["$scope","ListSvc",function(t,e){t.ListAdd=function(){t.listBody&&e.create({body:t.listBody}).success(function(e){t.posts.unshift(e),t.listBody=null})},e.fetch().success(function(e){t.posts=e})}]),angular.module("pullPix").service("ListSvc",["$http",function(t){this.fetch=function(){return t.get("http://localhost:3000/api/posts")},this.create=function(e){return t.post("http://localhost:3000/api/posts",e)}}]),angular.module("pullPix").controller("LoginCtrl",["$scope","UserSvc",function(t,e){t.login=function(n,l){e.login(n,l).then(function(e){t.$emit("login",e.data)})}}]),angular.module("pullPix").controller("RegisterCtrl",["$scope","UserSvc","$location",function(t,e,n){t.register=function(l,o){e.register(l,o).then(function(e){t.$emit("login",e),n.path("/")})}}]),angular.module("pullPix").config(["$routeProvider",function(t){t.when("/",{controller:"ListCtrl",templateUrl:"/partials/posts.html"}).when("/register",{controller:"RegisterCtrl",templateUrl:"/partials/register.html"}).when("/login",{controller:"LoginCtrl",templateUrl:"/partials/login.html"}).when("/imagemeta",{controller:"ImgMetaCtrl",templateUrl:"/partials/img-meta.html"})}]),angular.module("pullPix").service("UserSvc",["$http",function(t){var e=this;e.getUser=function(){return t.get("/users").then(function(t){return t.data})},e.login=function(n,l){return t.post("/sessions",{username:n,password:l}).then(function(n){return e.token=n.data,t.defaults.headers.common["X-Auth"]=n.data,e.getUser()})},e.register=function(n,l){return t.post("/users",{username:n,password:l}).then(function(){return e.login(n,l)})}}]),angular.module("pullPix").service("ImgMetaSvc",["$http",function(t){this.fetch=function(){return t.get("/img-meta")},this.create=function(e){return t.post("/img-meta",e)}}]);