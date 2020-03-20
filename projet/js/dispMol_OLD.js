//here we are going to draw the p5 image of the molecule to make her interactive.

//We use a variable called molName to get the name of the molecules and
// molJson to get the proprieties of this molecule

var dispMol = function( p ) {
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
    var k = 0;
    var found = false;
    var clicked= false;
    //IMG display

    //controller for all imgboxes, it can instanciates them and removes them
    var clickedImg;
    var clickedImgVect;
    var pressed  = false;

    function c_ImgBox(){
        this.imgList = [];
        this.srcImgDict = {};

        this.removeImg = function(img){
            console.log("imgList before supression of "+ img );
            console.log(this.imgList );
            this.imgList.splice(this.imgList.indexOf(img),1);
            console.log("imgListafter supression of "+ img.id );
            console.log(this.imgList );
        };

        this.addImg = function(imgId){
            if(this.findById(imgId) == undefined){
                var img = new ImgBox(imgId);
                c_imgBox.imgList.push(img);
                c_imgBox.srcImgDict[img.dom.attribute('src')] = img;
                c_imgBox.updateIndexes(img);
            }
            else{
                var curImg = this.findById(img.id);

                this.setPos(curImg,50,50);
                curImg.domClose.position(50+ curImg.domClose.imgOffsetX, 50 + curImg.domClose.imgOffsetY);
                curImg.domPlus.position(50+ curImg.domPlus.imgOffsetX, 50+curImg.domPlus.imgOffsetY);
                curImg.domMinus.position(50+curImg.domMinus.imgOffsetX,50+ curImg.domMinus.imgOffsetY);
            }

            console.log("created img with id = "+img.id );
        }

        this.findById = function(id){
            var i;
            for (var i = 0; i < this.imgList.length; i++) {
                if(this.imgList[i].id == id)
                    return this.imgList[i];
            }
            return undefined;
        };

        this.findBySrc = function(src){
            return this.srcImgDict[src];
        };

        this.getMouseOverImg = function(){
            hovered = null;

            this.imgList.forEach(function(elem){
                if (elem.mouseIsOver()){
                    hovered = elem;
                }
            })

            return hovered;
        }

        this.setPos = function(img,x,y){
            this.findById(img.id).x = x;
            this.findById(img.id).y = y;
        }

        this.setIndex = function(img,ind){
            var curImg = this.findById(img.id)
            if(curImg != undefined)
                curImg.setIndex(ind);
        }

        this.draw = function(){
            this.imgList.forEach(function(elem){
                //p.image(elem.img,elem.x,elem.y,elem.width,elem.height);

                if (elem.dom.position().x != elem.x || elem.dom.position().y != elem.y){
                    elem.dom.position(elem.x,elem.y);
                }

                if(elem.dom.size().width != elem.width || elem.dom.size().height != elem.height)
                    elem.dom.size(elem.width,elem.height);

            });
        };

        this.updateIndexes = function(img){
            if(img.index != molJson.nbAtoms){
                this.imgList.forEach(function(elem){
                    c_imgBox.setIndex(elem,elem.index -2);
                });

                this.setIndex(img,molJson.nbAtoms*2);
            }
        }
    }

    //object for an box containing an img
    ImgBox.padding = 5;
    ImgBox.resizeArea = 15;
    supported_img = ["jpg","jpeg","png","gif"];
    supported_vid = ["mov","mp4","webm"];

    function ImgBox(imgId){
        this.media;
        this.id = imgId;
        this.ratio = 1;
        this.index = 1;
        this.src;
        this.width;
        this.dom;
        this.height;
        this.controlsOffset = 10;
        //initialisation of the instance, here we check the size

        //instanciation given the type
        if(supported_vid.includes(molJson.atomList[imgId].video)){
          //SUPPORTED VIDEO
            this.src = "./Molecules/"+getMolName()+"/Details/atome"+(imgId)+"/vid."+molJson.atomList[imgId].video;
            this.dom = p.createVideo(this.src);
            this.dom.attribute("autoplay",true);
            this.dom.attribute("controls",true);

            this.ratio = this.width/this.height;
            this.media = {"width" : 300,"height": this.width * this.ratio};
            this.width = this.media.width;
            this.height = this.media.width * this.ratio;
        }else if(supported_img.includes(molJson.atomList[imgId].image)){
          //SUPPORTED IMG
            this.src = "./Molecules/"+getMolName()+"/Details/atome"+imgId+"/img."+molJson.atomList[imgId].image);
            this.dom = p.createImg(this.src);

            this.dom.elt.onload = function(){
                var img = c_imgBox.findById(this.id);
                img.media = {"width" : this.width,"height": this.height};
                img.width = img.media.width;
                img.height = img.media.height;
                img.ratio = img.width/img.height;
                img.changeRatio("height",300);
            }
        }else{
          //NOT SUPPORTED
            this.src = "./Molecules/404.jpg";
            this.dom = p.createImg(this.src);

            this.dom.elt.onload = function(){
                var img = c_imgBox.findById(this.id);
                img.media = {"width" : this.width,"height": this.height};
                img.width = img.media.width;
                img.height = img.media.height;
                img.ratio = img.width/img.height;
                img.changeRatio("height",300);

        }

        this.dom.style("width","auto");
        this.dom.style("height","auto");
        this.dom.attribute("id",imgId);
        this.dom.position(50,50);
        this.dom.size(this.width,this.height);
        this.x = 50;
        this.y = 50;

        this.domMinus = p.createP("-");
        this.domMinus.style("background-color","white");
        this.domMinus.style("padding","0 5px 0 5px");
        this.domMinus.imgId = this.id;
        this.domMinus.attribute("id","minus"+this.id);
        $("#minus"+this.id).css("cursor","pointer");
        this.domMinus.imgOffsetX = 3 * this.controlsOffset;
        this.domMinus.imgOffsetY = -2 * this.controlsOffset;
        this.domMinus.position(this.x + this.domMinus.imgOffsetX,this.y+this.domMinus.imgOffsetY);
        this.domMinus.mouseOver(function(){
            clicked = true;
        });
        this.domMinus.mouseClicked(function(){
            var img = c_imgBox.findById(this.imgId);
            if (img.width - 50 >= 50 && (img.width - 50)*img.ratio >= 40 || molJson.atomList[img.id].video != undefined)
                img.changeRatio("width",img.width - 50);
        });

        this.domPlus = p.createP("+");
        this.domPlus.style("background-color","white");
        this.domPlus.style("padding","0 5px 0 5px");
        this.domPlus.attribute("id","plus"+this.id);
        $("#plus"+this.id).css("cursor","pointer");
        this.domPlus.imgId = this.id;
        this.domPlus.imgOffsetX = 1.5 * this.controlsOffset;
        this.domPlus.imgOffsetY = -2 * this.controlsOffset;
        this.domPlus.position(this.x + this.domPlus.imgOffsetX,this.y+this.domPlus.imgOffsetY);
        this.domPlus.mouseOver(function(){
            clicked = true;
        });
        this.domPlus.mouseClicked(function(){
            var img = c_imgBox.findById(this.imgId);
            //if (img.width + 50 <= $("body").width() && (img.width + 50)*img.ratio <= $( window ).height())
                img.changeRatio("width",img.width + 50);
        });

        this.domClose = p.createP("X");
        this.domClose.style("background-color","white");
        this.domClose.style("padding","0 5px 0 5px");
        this.domClose.imgId = this.id;
        this.domClose.attribute("id","close"+this.id);
        $("#close"+this.id).css("cursor","pointer");
        this.domClose.imgOffsetX = 0 * this.controlsOffset;
        this.domClose.imgOffsetY = -2 * this.controlsOffset;
        this.domClose.position(this.x + this.domClose.imgOffsetX,this.y+this.domClose.imgOffsetY);
        this.domClose.mouseOver(function(){
            clicked = true;
        });
        this.domClose.mouseClicked(function(){
            c_imgBox.findById(this.imgId).close();
            clicked = false;
        });

        //###DOM operations
        this.dom.mouseMoved(function(){
            var img = c_imgBox.findBySrc(this.attribute("src"));
            clicked = true;

            if(currentAtom != this.attribute("id")){
                currentAtom = this.attribute("id");
                refreshInfos(img.id,getMolName());
            }

            if(pressed){
                img.x = p.mouseX-clickedImgVect[0];
                img.y = p.mouseY-clickedImgVect[1];
                img.domClose.position(p.mouseX -clickedImgVect[0]+ img.domClose.imgOffsetX, p.mouseY-clickedImgVect[1] + img.domClose.imgOffsetY);
                img.domPlus.position(p.mouseX -clickedImgVect[0]+ img.domPlus.imgOffsetX, p.mouseY-clickedImgVect[1]+img.domPlus.imgOffsetY);
                img.domMinus.position(p.mouseX -clickedImgVect[0]+img.domMinus.imgOffsetX,p.mouseY-clickedImgVect[1]+ img.domMinus.imgOffsetY);
            }
        });

        this.dom.mousePressed(function(){
            var img = c_imgBox.findBySrc(this.attribute("src"));
            //visual priorities
            c_imgBox.updateIndexes(img);

            clickedImgVect = [p.mouseX-img.x,p.mouseY-img.y];
            pressed = true;
        });

        this.dom.mouseReleased(function(){
            pressed = false;
        });

        this.dom.mouseOut(function(){
            pressed = false;
            clicked = false;
        });

        //###imgBox operation
        this.mouseIsOver = function(){
            return (p.mouseX >= this.x && p.mouseX <= this.x + this.width  && p.mouseY >= this.y && p.mouseY <= this.y + this.height);
        };

        this.isMouseOnEdge = function(){
            // Upleft
            if (p.mouseX > this.x - ImgBox.resizeArea &&
                p.mouseX < this.x + ImgBox.resizeArea &&
                p.mouseY > this.y - ImgBox.resizeArea &&
                p.mouseY < this.y + ImgBox.resizeArea)
                return "nw";
            // UPRight
            else if (p.mouseX > this.x + this.width - ImgBox.resizeArea &&
                     p.mouseX < this.x + this.width + ImgBox.resizeArea &&
                     p.mouseY > this.y - ImgBox.resizeArea &&
                     p.mouseY < this.y +  ImgBox.resizeArea)
                return "ne";
            // DOWNLeft
            else if (p.mouseX > this.x - ImgBox.resizeArea &&
                     p.mouseX < this.x + ImgBox.resizeArea &&
                     p.mouseY > this.y + this.height - ImgBox.resizeArea &&
                     p.mouseY < this.y + this.height + ImgBox.resizeArea)
                return "sw";
            // downRight
            else if (p.mouseX > this.x + this.width - ImgBox.resizeArea &&
                     p.mouseX < this.x + this.width + ImgBox.resizeArea &&
                     p.mouseY > this.y + this.height - ImgBox.resizeArea &&
                     p.mouseY < this.y + this.height + ImgBox.resizeArea)
                return "se";
            else {
                return 0;
            }
        };

        //this function change the ratio of the picture by taking in parameter the side changed
        this.changeRatio = function(side,wantedSize){
            if(side == "width"){ // if rtue == if width
                this.width = wantedSize;
                this.height = this.width / this.ratio;
            }else {
                this.height = wantedSize;
                this.width = this.height * this.ratio;
            }
        };

        this.setIndex = function(index){
            this.index = index;
            this.dom.style("z-index",(500+index));
            this.domClose.style("z-index",(500+index+1));
            this.domPlus.style("z-index",(500+index+1));
            this.domMinus.style("z-index",(500+index+1));
        }

        this.close = function(){
            this.dom.remove();
            this.domPlus.remove();
            this.domMinus.remove();
            this.domClose.remove();
            c_imgBox.removeImg(this);
        }
    }

    var c_imgBox;

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

        var canvas = p.createCanvas($("#interactMol").width(),$("#interactMol").height());
        canvas.id = "molCanvas";
        //  canvas.class("floating");
        //loading the molecule image
        rpz = p.loadImage("./Molecules/"+getMolName()+"/rpz.png",function(rpz){
            p.image(rpz,0,0,actualWidth,actualHeight);
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
                    refreshInfos(i,getMolName());

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
        c_imgBox = new c_ImgBox();
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

        molDraw();
        c_imgBox.draw();
    };

    p.mousePressed = function(){
        if(currentAtom != 0 && found && !clicked){
            c_imgBox.addImg(currentAtom);
            //showInfoImage(currentAtom,getMolName());
            //clicked = true;
        }
    };
};
