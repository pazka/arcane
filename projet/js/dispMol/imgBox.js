
var rpz;
var currentAtom = 0;
var v =[0,0];
var m = new MersenneTwister();
var randomNumber = m.random();
var pressed  = false;
var found = false;
var clicked= false;
var curImg;
//CONTROLLER
function c_ImgBox(p){
        this.imgList = [];
        this.srcImgDict = {};
        this.loadImg = p.createImg("../ressources/loading.gif");
        this.loadImg.elt.style ="display:none";

        this.removeImg = function(img){
                /*console.log("imgList before supression of "+ img );
                console.log(this.imgList );*/

                //before
                //this.imgList.splice(this.imgList.indexOf(img),1);

                //now
                this.imgList[img.id] = null;
                /*console.log("imgListafter supression of "+ img.id );
                console.log(this.imgList );*/
        };

        this.addImg = function(imgId){
                if(this.findById(imgId) == undefined){
                        var img = new ImgBox(imgId,p,this);
                        //this.imgList.push(img);
                        this.imgList[imgId] = img;
                        this.srcImgDict[img.dom.attribute('src')] = img;
                        this.updateIndexes(img);
                }
                else{
                        var curImg = this.findById(img.id);

                        this.setPos(curImg,50,50);
                        curImg.domClose.position(50+ curImg.domClose.imgOffsetX, 50 + curImg.domClose.imgOffsetY);
                        curImg.domPlus.position(50+ curImg.domPlus.imgOffsetX, 50+curImg.domPlus.imgOffsetY);
                        curImg.domMinus.position(50+curImg.domMinus.imgOffsetX,50+ curImg.domMinus.imgOffsetY);
                }

                /*console.log("created img with id = "+img.id );*/
        }

        this.findById = function(id){
                return this.imgList[id];

                /* old version, less efficiency
                for (var i = 0; i < this.imgList.length; i++) {
                if(this.imgList[i].id == id)
                return this.imgList[i];
        }
        return undefined;*/
        };

        this.findBySrc = function(src){
                return this.srcImgDict[src];
        };

        /* deprecated
        this.getMouseOverImg = function(){
        hovered = null;

        this.imgList.forEach(function(elem){
        if (elem.mouseIsOver()){
        hovered = elem;
        }
        })

        return hovered;
        }*/

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
                        //p["image"](elem.img,elem.x,elem.y,elem.width,elem.height);
                        if(elem != null){
                                //to not execute the instruction for all
                                if (elem.dom.position().x != elem.x || elem.dom.position().y != elem.y){
                                        elem.dom.position(elem.x,elem.y);
                                }

                                if(elem.dom.size().width != elem.width || elem.dom.size().height != elem.height)
                                elem.dom.size(elem.width,elem.height);
                        }
                });
        };

        this.updateIndexes = function(img){
                c_imgbox = this;
                if(img.index != molJson.nbAtoms){
                        this.imgList.forEach(function(elem){
                                if(elem != null)
                                c_imgbox.setIndex(elem,elem.index -2);
                        });

                        this.setIndex(img,molJson.nbAtoms*2);
                }
        }
}


//object for an box containing an img
ImgBox.padding = 5;
ImgBox.resizeArea = 15;

// MODEL
function ImgBox(imgId,p,c_imgBox){
        this.media;
        this.id = imgId;
        this.ratio = 1;
        this.index = 1;
        this.src;
        this.width;
        this.dom;
        this.tempDom;
        this.sound = null;
        this.height;
        this.controlsOffset = 10;
        //initialisation of the instance, here we check the size

        //instanciation given the type
        if(molJson.atomList[imgId]["video"] != undefined){
                this.src = "./Molecules/"+getMolName()+"/Details/atome"+(imgId)+"/vid."+molJson.atomList[imgId]["video"];
                this.dom = p.createVideo(this.src);
                this.dom.attribute("id",this.id);
                this.dom.attribute("autoplay",true);
                this.dom.attribute("controls",true);

                this.ratio = this.width/this.height;
                this.media = {"width" : 300,"height": this.width * this.ratio};
                this.width = this.media.width;
                this.height = this.media.width * this.ratio;

        }else {
                if(molJson.atomList[imgId]["image"] != undefined){
                        //loading img and putting loagind img
                        this.src = "./Molecules/"+getMolName()+"/Details/atome"+imgId+"/img."+molJson.atomList[imgId]["image"] ;
                }else{
                        this.src = "./Molecules/"+getMolName()+"/Details/atome"+imgId+"/img.jpg";
                }

                this.dom = p.createImg(this.src);
                this.dom.elt.style = "visibility:hidden";
                this.tempDom = c_imgBox.loadImg;
                this.tempDom.elt.style = "visibility:visible";
                this.tempDom.position( p.mouseX, p.mouseY);

                this.dom.elt.onload = function(){
                        var img = c_imgBox.findById(this.id);

                        //changing ratio
                        img.media = {"width" : this.width,"height": this.height};
                        img.width = img.media.width;
                        img.height = img.media.height;
                        img.ratio = img.width/img.height;
                        img.changeRatio("height",300);

                        //replacing loading img
                        img.tempDom.elt.style ="visibility:hidden";
                        img.dom.elt.style = "visibility:visible";
                        img.tempDom = null;
                }

                if(molJson.atomList[imgId].audio != undefined){
                        var obj = this;
                        var sound = new p5.SoundFile("./Molecules/"+getMolName()+"/Details/atome"+(imgId)+"/audio."+molJson.atomList[imgId].audio,function(){
                                obj.sound = sound;
                                obj.sound.setVolume(1);
                                obj.sound.play();
                        });
                }
        }

        this.dom.style("width","auto");
        this.dom.style("height","auto");
        $(this.dom.elt).css("cursor","crosshair");
        this.dom.attribute("id",imgId);
        this.dom.position( p.mouseX, p.mouseY);
        this.dom.size(this.width,this.height);
        this.x = p.mouseX;
        this.y = p.mouseY;

        $(this.dom.elt).mouseenter(function(){
                var img = window.c_imgBox.findById(this.id);

                clicked = true;
                currentAtom = -1;
                $("#infos").css("display","initial");
        });
        //###DOM operations
        $(this.dom.elt).mousemove(function( event){
                var img = window.c_imgBox.findById(this.id);

                if(currentAtom != this.id){
                        currentAtom = this.id;
                        refreshInfos(img.id,getMolName());
                }

                if(!p.keyIsPressed){
                        $("#infos").css("left",p.mouseX+50);
                        $("#infos").css("top",p.mouseY-100);
                }
        });

        this.dom.mousePressed(function(){
                var img = window.c_imgBox.findById(this.elt.id);


                //visual priorities
                window.c_imgBox.updateIndexes(img);
                window.clickedImgVect = [p.mouseX-img.x,p.mouseY-img.y];
                window.curImg = img;
                pressed = true;
        });

        this.dom.mouseReleased(function(){
                pressed = false;
        });

        $(this.dom.elt).mouseleave(function(){
                pressed = false;
                clicked = false;
                currentAtom = -1;
                if(!p.keyIsPressed){
                        $("#infos").css("display","none");
                }
        });

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
                if(this.sound != null){
                        this.sound.stop();
                }
                window.c_imgBox.removeImg(this);
        }

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
                var img = window.c_imgBox.findById(this.imgId);
                if (img.width - 50 >= 50 && (img.width - 50)*img.ratio >= 40 || molJson.atomList[img.id]["video"] != undefined)
                img.changeRatio("width",img.width - 50);
        });
        this.domMinus.mousePressed(function(){
                var img = window.c_imgBox.findById(this.domMinus.imgId);


                //visual priorities
                window.c_imgBox.updateIndexes(img);
                window.clickedImgVect = [p.mouseX-img.x,p.mouseY-img.y];
                window.curImg = img;
                pressed = true;
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
                var img = window.c_imgBox.findById(this.imgId);
                //if (img.width + 50 <= $("body").width() && (img.width + 50)*img.ratio <= $( window ).height())
                img.changeRatio("width",img.width + 50);
        });
        this.domPlus.mousePressed(function(){
                var img = window.c_imgBox.findById(this.domPlus.imgId);


                //visual priorities
                window.c_imgBox.updateIndexes(img);
                window.clickedImgVect = [p.mouseX-img.x,p.mouseY-img.y];
                window.curImg = img;
                pressed = true;
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
                window.c_imgBox.findById(this.imgId).close();
                clicked = false;
        });
}
