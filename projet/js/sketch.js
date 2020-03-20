//here we are going to draw the p5 image of the molecule to make her interactive.

//We use a variable called molName to get the name of the molecules and
// molJson to get the proprieties of this molecule

var s = function( p ) {
  var localAtomList = molJson.atomList;
  var molRatio = molJson.sizey / molJson.sizex;
  var colors = ["#4285F4","#FBBC05","#EA4335","#34A853","#AF5DA4"];
  var actualWidth;
  var actualHeight;
  var desiredHeigth = $("#interactMol").height()-$("#interactMol").height()*0.2;
  var rpz;
  var currentAtom = 0;
  var v =[0,0];
  var m = new MersenneTwister();
  var randomNumber = m.random();

  //animation
  var max_width = $("#p5Mol").width();
  var max_height = $("#p5Mol").height();
  var velocity = 0.6; // in px
  var damping = 0.995; // dvidie the velocity each iteration
  var damp_limit = 0.05; // limit of velocity before changing
  var curPosX = 10;
  var curPosY = 10;

  p.setup = function() {

    //Creating a canvas of the right size
    actualWidth = $("#interactMol").width() - ($("#interactMol").width()*0.1);
    actualHeight = actualWidth*molRatio;

    // adapt by the height rather than the width
    if(actualHeight > desiredHeigth){
      actualHeight = desiredHeigth;
      actualWidth = actualHeight / molRatio;
    }

    //ratio to place all the elements
    var xRatio = actualWidth / molJson.sizex;

    var canvas = p.createCanvas($("#p5Mol").width(),$("#p5Mol").height());
    canvas.id = "molCanvas";
    //  canvas.class("floating");
    //loading the molecule image
    rpz = p.loadImage("./Molecules/"+getMolName()+"/rpz.png",function(rpz){
      p["image"](rpz,0,0,actualWidth,actualHeight);
    });

    //updating all the positions and distances of the atoms
    for(var i = 1; i <= molJson.nbAtoms;i++){
      localAtomList[i].x = localAtomList[i].x * xRatio;
      localAtomList[i].y = localAtomList[i].y * xRatio;
      localAtomList[i].r = localAtomList[i].r * xRatio;
    }

    p.strokeWeight(5);
    p.noFill();
  };

var k = 0;
var found = false;
var clicked= false;

  p.changeClick = function (click){
    clicked = false;
  }

  //making the interactiviy
  p.draw = function() {
    //deplacement
    //calcul du vecteur
    if(Math.abs(v[0]) <= damp_limit){
      v[0] = (Math.round((m.random()*10) -5))%velocity;
    }
    if(Math.abs(v[1]) <= damp_limit){
      v[1] = (Math.round((m.random()*10) -5))%velocity;
    }

    //application du vecteur et alteration
    if(curPosX+v[0]+actualWidth > max_width || curPosX+v[0] < 0 || curPosY+v[1]+actualHeight > max_height || curPosY+v[1] < 0 ){
      v[0] = 0;
      v[1] = 0;
    }
    else{
      curPosX += v[0];
      curPosY += v[1];
      v[0] = v[0] * damping;
      v[1] = v[1] * damping;
    }

    //dessin
    p.clear();
    p.cursor(p.CURSOR);
    p["image"](rpz,curPosX,curPosY,actualWidth,actualHeight);

    found = false;
    for(var i = 1; i <= molJson.nbAtoms; i++){
      var a = localAtomList[i];

      if (p.mouseX >= a.x + curPosX && p.mouseX <= a.x + curPosX + a.r && p.mouseY >= a.y + curPosY && p.mouseY <= a.y + curPosY + a.r && !clicked){
        //cursor on an atom
        p.cursor(p.HAND);
        p.stroke(colors[a.color]);

        p.ellipse(a.x + curPosX + a.r/2 ,a.y + curPosY + a.r/2  ,a.r,a.r);
        if(i != currentAtom ){
          currentAtom = i;
          refreshInfos(i,getMolName());

          if(a["video"] != undefined)
            preloadVideo(i,getMolName(),a["video"]);
          else if (a["audio"] != undefined)
            preloadAudio(i,getMolName(),a["audio"]);
          else
            preloadImg(i,getMolName());
        }
        found = true;
      }

    }
  };

  p.mousePressed = function(){
    if(currentAtom != 0 && found){
      showInfoImage(currentAtom,getMolName());
      clicked = true;
    }
  };

};
