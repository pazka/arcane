//here we are going to draw the p5 image of the molecule to make her interactive.

//We use a variable called molName to get the name of the molecules and
// molJson to get the proprieties of this molecule

var clickedImgVect;

var dispMol = function( p ) {
    var localAtomList = molJson.atomList;
    var molRatio = molJson.sizey / molJson.sizex;
    var colors = ["#4285F4","#FBBC05","#EA4335","#34A853","#AF5DA4"];
    var actualWidth;
    var actualHeight;
    var desiredHeigth = $("#interactMol").height()-$("#interactMol").height()*0.2;

    //animation
    var max_width = $("#p5Mol").width();
    var max_height = $("#p5Mol").height();
    var velocity = 0.6; // in px
    var damping = 0.995; // dvidie the velocity each iteration
    var damp_limit = 0.05; // limit of velocity before changing
    var curPosX = 0;
    var curPosY = 0;
    var k = 0;
    //IMG display

    //controller for all imgboxes, it can instanciates them and removes them
    var clickedImg;


    function molSetup(){
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
            p.image(rpz,0,0,actualWidth,actualHeight);
            curPosX = $("#p5Mol").width()/2 - actualWidth/2;
            curPosY = $("#p5Mol").height()/2 - actualHeight/2;
        });

        //updating all the positions and distances of the atoms
        for(var i = 1; i <= molJson.nbAtoms;i++){
            localAtomList[i].x = localAtomList[i].x * xRatio;
            localAtomList[i].y = localAtomList[i].y * xRatio;
            localAtomList[i].r = localAtomList[i].r * xRatio;
        }

        p.strokeWeight(5);
        p.noFill();
    }

    function molDraw(){
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
        p.image(rpz,curPosX,curPosY,actualWidth,actualHeight);

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
                    //refreshInfos(i,getMolName());

                /*    if(a.video != undefined)
                    preloadVideo(i,getMolName(),a.video);
                    else if (a.audio != undefined)
                    preloadAudio(i,getMolName(),a.audio);
                    else
                    preloadImg(i,getMolName());*/
                }
                found = true;
            }

        }
    }

    p.setup = function() {
        molSetup();
        //IMG DISP
        window.c_imgBox = new c_ImgBox(p);
        //initAtom vien du controleur
        if (window.initAtom != undefined){
            window.c_imgBox.addImg(window.initAtom);
        }
    };

    p.changeClick = function (click){
        clicked = false;
    }

    //making the interactiviy
    p.draw = function() {
        p.clear();
        if(p.cursor() != p.CURSOR && !clicked) {p.cursor(p.CURSOR)};
        //deplacement
        //calcul du vecteur

        //drawing of the molecule
        molDraw();

        //dawing of all the imgboxes
        window.c_imgBox.draw();
    };

    p.mousePressed = function(){

        // if there is an atom found
        if( found && !clicked){
            window.c_imgBox.addImg(currentAtom);
            //showInfoImage(currentAtom,getMolName());
            pressed = false;
            clicked = false;
            currentAtom = -1;
        }
    };

    p.mouseDragged = function(){
        if(window.curImg != null){

            curImg.x = window.myp5.mouseX-window.clickedImgVect[0];
            curImg.y = window.myp5.mouseY-window.clickedImgVect[1];
            curImg.domClose.position(window.myp5.mouseX -window.clickedImgVect[0]+ curImg.domClose.imgOffsetX, window.myp5.mouseY-window.clickedImgVect[1] + curImg.domClose.imgOffsetY);
            curImg.domPlus.position(window.myp5.mouseX -window.clickedImgVect[0]+ curImg.domPlus.imgOffsetX, window.myp5.mouseY-window.clickedImgVect[1]+curImg.domPlus.imgOffsetY);
            curImg.domMinus.position(window.myp5.mouseX -window.clickedImgVect[0]+curImg.domMinus.imgOffsetX,window.myp5.mouseY-window.clickedImgVect[1]+ curImg.domMinus.imgOffsetY);
        }
    }

    p.mouseReleased =function(){
      curImg = null;
      window.clickedImgVect = [0,0];
    };


        p.mouseWheel = function(event){
                img = window.c_imgBox.findById(currentAtom);
                img.changeRatio("width",img.width - event.delta);
        }
};
