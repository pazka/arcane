var open = false;

function showHelpText(){
    if(!open){
        open =true;
        $("#helpText").css("display","inline");
        $("#helpText").toggleClass("slideDown");
    }else{
        open = false;
        $("#helpText").toggleClass("slideDown");
        $("#helpText").css("display","none");
    }
}
