'use strict';
// Declare app level module which depends on views, and components

var getMolName;
var molJson;
var myp5;

function changeP5Click(click){
  myp5.changeClick(click);
}

angular.module('Mol', ['ngRoute'])
.config( function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider
  .when('/:param1', {
  templateUrl:"./partials/presentation.html",
  controller: 'molCtrl',
  resolve :{pageDir : function(){return "./media/Molecules/"+$routeProvider.param1 + "/";}}
  })
  .when('/:param1/:param2',{
      templateUrl:"./partials/presentation.html",
      controller: 'molCtrl',
      resolve :{pageDir : function(){return "./media/Molecules/"+$routeProvider.param1 + "/";}}
      })
  .otherwise({redirectTo: '/'});
})

.controller('molCtrl',['$scope','$routeParams',function($scope,$routeParams) {
  //functions

  //init
  getMolName = function(){return $routeParams.param1};
  $scope.name = getMolName();

    //init d'un atome okou
    if($routeParams.param2 != undefined){
        window.initAtom = $routeParams.param2;
    }
  //recupération du texte de formule
  $.get("./Molecules/"+getMolName()+"/txt.txt",null,function(res){
      $("#formula").html(res);
    });

  //la bonne promise qui lancera le dessin quand le fichier json sera réceptionné
  $.ajax({
    url: "./Molecules/"+getMolName()+"/Details/positions.json",
    dataType: "json",
    success: function (data) {
      molJson = data;

      //specifying instance of p5 in Mol div
      window.myp5 = new p5(dispMol,'p5Mol');

    },
    error: function(err){
          console.log(err);
      alert("Something went wrong :\n"+err.Message);
    }
  });


}]);
