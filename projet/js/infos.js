// those function are those who are going to display images OBSELETE

function refreshInfos(idA,molName){
    $.get("./Molecules/"+molName+"/Details/atome"+idA+"/expl.txt",null,function(res){
        insertInfos(res);
    },"text").fail(function(){
        insertInfos("DATA NOT FOUND : atome n°"+ idA);
    });
}

function insertInfos(data){
    var txtList = data.split('\n');

    $("#title").html(txtList[0]);
    $("#subtitle").html(txtList[1]);
    //creating a text div for each line
    var curText = txtList[2];
    var i = 2;
    $("#varInfos").html("");

    while(curText != undefined){
        if(curText != ""){
            if(curText.split(':')[0] != "http"){
                $("#varInfos").append("<p>"+curText+"</p>");
            }else{
                $("#varInfos").append("<a target='_blank' href ='"+curText+"'> Lien </p>");
            }
        }
        i++;
        curText = txtList[i];
    }
}

var preloaded_img = new Array();

function preloadImg(idA,molName){
    idA--;
    if(preloaded_img[idA] == undefined){
        preloaded_img[idA] = new Image();
        preloaded_img[idA].src = "./Molecules/"+molName+"/Details/atome"+(idA+1)+"/img.jpg";
        preloaded_img[idA].id = "fullImg";
    }
}

function preloadVideo(idA,molName,vidType){
    idA--;
    if(preloaded_img[idA] == undefined){
        preloaded_img[idA] = $("<video controls>Votre navigateur ne supporte pas l'élément vidéo, vous pouvvez retrouver la vidéo à cette adresse : ./Molecules/"+molName+"/Details/atome"+(idA+1)+"/vid."+vidType+"</video>");
        preloaded_img[idA].attr("src", "./Molecules/"+molName+"/Details/atome"+(idA+1)+"/vid."+vidType);
        preloaded_img[idA].attr("id", "fullImg");
        preloaded_img[idA].attr("preload", true);
    }
}

function preloadAudio(idA,molName,audioType){
    idA--;
    if(preloaded_img[idA] == undefined){
        // image
        var img = new Image();
        img.src = "./Molecules/"+molName+"/Details/atome"+(idA+1)+"/img.jpg";

        // audio
        var audio = $("<audio controls>Votre navigateur ne supporte pas l'élément audio, vous pouvvez retrouver le son à cette adresse : ./Molecules/"+molName+"/Details/atome"+(idA+1)+"/audio."+audioType+"</video>");
        audio.attr("src", "./Molecules/"+molName+"/Details/atome"+(idA+1)+"/audio."+audioType);
        audio.attr("preload", true);

        preloaded_img[idA] = $("<div class='audioImg'></div>");
        preloaded_img[idA].attr("id","fullImg");
        preloaded_img[idA].append(img);
        preloaded_img[idA].append(audio);
    }
}

function showInfoImage(idA,molName){

    $("#imgDisp").append(preloaded_img[idA-1]);
    $("#fullImg").mousedown(function(event) {
        if (event.which == 1) {
            removeImgDisp();
        }
    });
    //  $("#imgDisp img").attr("src","./Molecules/"+molName+"/Details/atome"+idA+"/img.jpg");
    $("#imgDisp").toggleClass("animated zoomIn imgDisplayer");
    $("#imgDisp").show();
}

function removeImgDisp(){
    $("#fullImg").remove();
    $("#imgDisp").toggleClass("animated zoomIn imgDisplayer");
    $("#imgDisp").hide();
    changeP5Click(false);
}
