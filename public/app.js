angular.module('pullPix',[
    'ngRoute',
    'angularFileUpload',
    'ngAnimate',
    'ui.bootstrap'
]);
angular.module('pullPix')
    .controller('ApplicationCtrl', ["$rootScope", function($rootScope){
        $rootScope.$on('login', function(_, user){
            $rootScope.currentUser = user; //
            console.log('appctrl ' + user.username);
    });
}]);

angular.module('pullPix')
    .controller('FullscreenCtrl', ["$scope", "$timeout", "QueueService", function ($scope, $timeout, QueueService) {
        var INTERVAL = 3000,
        slides = [{id:"image00", src:"./uploads/ansel1.jpg"},
                  {id:"image01", src:"./uploads/ansel2.jpg"},
                  {id:"image02", src:"./uploads/ansel3.jpg"},
                  {id:"image03", src:"./uploads/ansel4.jpg"},
                  {id:"image04", src:"./uploads/ansel5.jpg"}];

    function setCurrentSlideIndex(index) {
        $scope.currentIndex = index;
    }

    function isCurrentSlideIndex(index) {
        return $scope.currentIndex === index;
    }

    function nextSlide() {
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        $timeout(nextSlide, INTERVAL);
    }


    function loadSlides() {
        QueueService.loadManifest(slides);
    }


    $scope.$on('queueComplete', function(event, slides) {
        $scope.$apply(function(){
            $scope.slides = slides;
            $scope.loaded = true;

            $timeout(nextSlide, INTERVAL);
        });
    });

    $scope.progress = 0;
    $scope.loaded = false;
    $scope.currentIndex = 0;
    

    $scope.setCurrentSlideIndex = setCurrentSlideIndex;
    $scope.isCurrentSlideIndex = isCurrentSlideIndex;
    
    loadSlides();
}]);

angular.module('pullPix')
.service('QueueService', ["$rootScope", function($rootScope){
    var queue = new createjs.LoadQueue(true);

    function loadManifest(manifest) {
        queue.loadManifest(manifest);


        queue.on('complete', function() {
            $rootScope.$broadcast('queueComplete', manifest);
        });
    }

    return {
        loadManifest: loadManifest
    }
}]);




angular.module('pullPix')
    .controller('ListCtrl',["ListSvc", function(ListSvc){
        var vm = this;
   vm.ListAdd = function () {
      if (vm.listBody) {
          ListSvc.create({
              body: vm.listBody
          })
              .success(function(post){
                  vm.posts.unshift(post);
                  vm.listBody = null;
              });
      }
   }
    ListSvc.fetch()
        .success(function (posts) {
           vm.posts = posts
        });

}]);
angular.module('pullPix')
.controller('LoginCollapseCtrl', ["$scope", "UserSvc", "$rootScope", "$location", function ($scope, UserSvc, $rootScope, $location) {
  $scope.isCollapsed = true;

  $scope.login = function(username, password){
            UserSvc.login(username, password)
                .then(function(user){
                    $rootScope.$emit('login', user);
                    console.log('User ' + user);
                    $location.path('/upload');
              });
  			};
  		}]);
angular.module('pullPix')
     .controller('LoginCtrl', ["$scope", "UserSvc", "$location", function($scope, UserSvc, $location){
        $scope.login = function(username, password){
            UserSvc.login(username, password)
                .then(function(user){
                    $scope.$emit('login', user);
                    console.log('User ' + user);
                    $location.path('/upload');
            	});
        };
    }]);

angular.module('pullPix')
    .controller('MemberListCtrl', ["$scope", "MemberListSvc", function($scope, MemberListSvc){
        MemberListSvc.fetch()
            .success(function(users){
                $scope.members = users;
            });
    }]);
angular.module('pullPix')
.controller('ModalDemoCtrl', ["$scope", "$modal", function ($scope, $modal) {


  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
    });
  };
}]);




// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('pullPix')
.controller('ModalInstanceCtrl', ["$scope", "$rootScope", "UserSvc", "$location", "$modalInstance", function ($scope, $rootScope, UserSvc, $location, $modalInstance) {

  $scope.register = function (username, password){
            UserSvc.register(username, password)
                .then(function(user){
                    console.log('WORK');
                    $rootScope.$emit('login', user);
                    $location.path('/upload');
            });
  };

  $scope.login = function(username, password){
            UserSvc.login(username, password)
                .then(function(user){
                    $rootScope.$emit('login', user);
                    console.log('User ' + user);
                    $location.path('/upload');
              });
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);


angular
    .module('pullPix')
    .controller('ProfileCtrl',["$scope", "ImgMetaSvc", "$routeParams", "$rootScope", function($scope, ImgMetaSvc, $routeParams, $rootScope) {
        $scope.userName = $routeParams.userName;

        ImgMetaSvc.fetch($scope.userName)
            .success(function(imgmetas){
               $rootScope.imgmetas = imgmetas;
                console.log(imgmetas);
            });

    }]);


angular.module('pullPix')
    .controller('RegisterCtrl', ["$scope", "UserSvc", "$location", function($scope, UserSvc, $location){
        $scope.register = function (username, password){
            UserSvc.register(username, password)
                .then(function(user){
                    $scope.$emit('login', user);
                    $location.path('/upload');
            });
        };
    }]);

angular.module('pullPix')
    .config(["$routeProvider", function ($routeProvider){
        $routeProvider
            .when('/',           {controller: 'ModalDemoCtrl',   templateUrl: '/partials/splash-page.html'})
            .when('/upload',     {controller: 'UploadCtrl', controllerAs: 'vm', templateUrl: '/partials/upload-page.html'})
            .when('/photo',      {controller: 'ImgMetaCtrl', templateUrl: '/partials/photo-page.html'}) 
            .when('/photo-map',  {controller: '',            templateUrl: '/partials/map-page.html'})
            .when('/photo-page', {controller: '',            templateUrl: '/partials/photo-page.html'})
            .when('/fullscreen', {controller: 'FullscreenCtrl',    templateUrl: '/partials/fullscreen.html'})
            .when('/:userName',  {controller: 'ProfileCtrl',  templateUrl: '/partials/profile-page.html'});
     }]);



angular.module('pullPix')
.controller('SignupCollapseCtrl', ["$scope", "UserSvc", "$rootScope", "$location", function ($scope, UserSvc, $rootScope, $location) {
  $scope.isCollapsed = true;

  $scope.register = function (username, password){
            UserSvc.register(username, password)
                .then(function(user){
                    console.log('WORK');
                    $rootScope.$emit('login', user);
                    $location.path('/upload');
            });
  };
}]);
angular
    .module('pullPix')
    .controller('UploadCtrl', Upload);

  Upload.$inject = ['$upload', 'ImgMetaSvc', '$location'];

 
  function Upload($upload, ImgMetaSvc, $location) {
 
 
    var vm = this;
    vm.fileout = null;
    vm.currentuser = null;
    vm.lat = null;
    vm.lon = null;
    vm.cameraModel = null;
    vm.shutterSpeed = null;
    vm.aperture = null;
    vm.iso = null;
    vm.timeDate = null;
    vm.upload = null;
    vm.geometry = null;
    vm.onFileSelect = onFileSelect;
    vm.imgUpdate = imgUpdate;

    function onFileSelect(files) {
 
      vm.upload = $upload.upload({
        url: '/api/user/upload',  
        method: 'POST',
        // data: {myObj: $scope.myModelObj},
        file: files  //number files uploaded

      }).progress(function(evt) {

      }).success(function(data, status, headers, config) {
        console.log('success fileout 1');
        vm.fileout = "/uploads/" + files[0].name;
        //TEMP DELETE NOT WORKING vm.currentuser = CurrentUser.userid;
 


        try
          {
          console.log('success fileout 2');
          console.log(data);
    
          // convert deg to dec here
          var lat = data["Profile-EXIF"]['GPS Latitude'];
          var latDirection = data["Profile-EXIF"]['GPS Latitude Ref'];        
          var lon = data["Profile-EXIF"]['GPS Longitude'];
          var lonDirection = data["Profile-EXIF"]['GPS Longitude Ref'];
          var iso = data["Profile-EXIF"]['ISO Speed Ratings'];
          var cameraModel = data["Profile-EXIF"].Model;
          var shutterSpeed = data["Profile-EXIF"]['Shutter Speed Value'];
          var aperture = data["Profile-EXIF"]['Aperture Value'];
          var timeDate = data["Profile-EXIF"]['Date Time'];

          var shutterCalc = function (shutterSpeed){
              var speed=  (Math.pow(2,(shutterSpeed[0]/shutterSpeed[1]) ) ) ;
              // DON'T YET KNOW IF THIS FORMULA IS RIGHT - IT IS SOMETHING LIKE THIS
              return speed;
          };

          var apertureCalc = function (aperture){
              var aperture= (Math.pow(1.4142, (aperture[0]/aperture[1]) ) );
              // DON'T YET KNOW IF THIS FORMULA IS RIGHT - IT IS SOMETHING LIKE THIS
              return aperture;
          };

          var degreeToDecimal = function (coord, compass){ 
            if (coord != null && compass != null)  //handles missing EXIF data error
            {
              //transforms standard degree min sec EXIF coord to decimal value, latitude or longitude
              //N and E compass positive, S and W compass negative
              var direction = 1;  // N or E
              var decimalCoord; // return value
              var elements = coord.split(",");//should give 3 element array>>> 45/1,31/1,54636/1000
              var degrees=elements[0].split("/"); //should give 2 element array 45,1 
              var finalDegrees = degrees[0]/degrees[1];
              var minutes = elements[1].split("/"); //should give 2 element array 31,1
              var finalMinutes = minutes[0]/minutes[1];
              var seconds = elements[2].split("/");  //should give 2 element array 54636/1000
              var finalSeconds = seconds[0]/seconds[1];
              if ((compass === "S")|| (compass === "W"))
                {direction=-1 }; 
              decimalCoord = direction * (Math.abs(finalDegrees) + (finalMinutes/60.0) + (finalSeconds / 3600.0) );
            }
            return decimalCoord;
         };
          console.log("generate lat lon");
 

          vm.lat = degreeToDecimal(lat, latDirection);
          vm.lon = degreeToDecimal(lon, lonDirection);
          
          vm.cameraModel = cameraModel;
          vm.shutterSpeed = shutterCalc(shutterSpeed);
          vm.aperture = apertureCalc(aperture);
          vm.iso = iso;
          vm.timeDate = timeDate;
          
          console.log(iso + " is iso");
          console.log(cameraModel + " is cameraModel");
          console.log(aperture + " is aperture");
          console.log(shutterSpeed + " is shutterSpeed");
          console.log(lat + " is lat");
          console.log(lon + " is lon");
      }
      catch(err)
      {
          console.log("EXIF read error was " + err);
          vm.lat = null;
          vm.lon = null;
          vm.cameraModel = null;
          vm.shutterSpeed = null;
          vm.aperture = null;
          vm.iso = null;
          vm.timeDate = null;
      }
      //end try catch

     });
  }

  function imgUpdate(metadata){
            if(metadata){
                ImgMetaSvc.create({
                  username        : metadata.username,
                  path            : metadata.path,
                  title           : metadata.title,
                  caption         : metadata.caption,
                  tags            : metadata.tags,
                  camera          : metadata.camera,
                  shutter         : metadata.shutter,
                  aperture        : metadata.aperture,
                  iso             : metadata.iso,
                  date            : metadata.date
                })
                .success(function(imgmeta){
                  console.table(imgmeta);
                  //metadata = null;
                  $location.path('/' + metadata.username);
 
                });
        }
    };
}


angular
    .module('pullPix')
    .directive('slider', ["$timeout", function($timeout){
        return {
            restrict: 'AE',
            replace: true,
            scope: { imgmetas: '=imgmetas'},
            link: function(scope, elem, attrs){
                scope.currentIndex = 0;
                console.log('slid-dir ' + scope.imgmetas);
                scope.next = function(){
                   scope.currentIndex < scope.imgmetas.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
                };

                scope.prev = function(){
                    scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.imgmetas.length - 1;
                };

                scope.$watch('currentIndex', function(){
                    scope.imgmetas.forEach(function(imgmeta){
                        imgmeta.visible = false;
                    });
                    scope.imgmetas[scope.currentIndex].visible = true;
                });

                /* Start: For Automatic slideshow*/

                var timer;

                var sliderFunc=function(){
                    timer=$timeout(function(){
                        scope.next();
                        timer=$timeout(sliderFunc,5000);
                    },5000);
                };

                sliderFunc();

                scope.$on('$destroy',function(){
                    $timeout.cancel(timer);
                });

                /* End : For Automatic slideshow*/
            },
            templateUrl: 'partials/slider.html'
        }
    }]);

angular.module('pullPix')
    .factory('CurrentUser', function(){
        var currentuser = {
            'userid' : 666
        }
        return currentuser;
    });
angular.module('pullPix')
    .service('ImgMetaSvc', ["$http", function($http){
        this.fetch = function(username){
            return $http.get('/img-meta/' + username);
        };
        this.create = function(imgmeta){
            return $http.post('/img-meta', imgmeta);
        }
    }]);

angular.module('pullPix')
    .service('ListSvc', ["$http", function($http){
       this.fetch = function(){
            return $http.get('http://localhost:3000/api/posts');
       };
        this.create = function(post){
            return $http.post('http://localhost:3000/api/posts', post);
        };
    }]);


angular.module('pullPix')
    .service('MemberListSvc', ["$http", function($http){
        this.fetch = function(){
            return $http.get('http://localhost:3000/member');
        }
    }]);
angular.module('pullPix')
    .service('UserSvc', ["$http", "$window", function ($http, $window) {
        var svc = this;
        svc.getUser = function () {
            return $http.get('/users',{
                headers: {'X-Auth': this.token}
            })
                .then(function (response) {
                    return response.data;
                });
        };
        svc.login = function (username, password) {
            return $http.post('/sessions', {
                username: username, password: password
            }).then(function (response) {
                console.log("Res data " + response.data);
                $window.localStorage.setItem('access_token', response.data);
                svc.token = response.data;
                $http.defaults.headers.common['X-Auth'] = response.data;
                return svc.getUser();
            });
        };
        svc.register = function (username, password) {
            return $http.post('/users', {
                username: username, password: password
            }).then(function () {
                return svc.login(username, password);
            });
        };
    }]);
