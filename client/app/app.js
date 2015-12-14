angular.module('makerpair', [
  'shortly.auth'



  ])

.config(function($routeProvier, $httpProvider){
  $routeProvier
    .when('/',{
      templateUrl: './views/index.ejs',
      controller: 'IndexController'
    })
    .when('/login', {
      templateUrl: './views/login.ejs',
      controller: 'AuthController'
    })
    .when('/register',{
      templateUrl: './views/register.ejs',
      controller: 'AuthController'
    })
    .when('/dashboard', {
      templateUrl: './views/dashboard.ejs',
      controller: 'DashController'
    })
    .otherwise({
      redirectTo:'/'
    });

    //I need something like this

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    // $httpProvider.interceptors.push('AttachTokens');
})