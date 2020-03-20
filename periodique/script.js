var allAtoms;
var currentTab;
var arrow;
var colors = ["rgba(33,100,200,1)","rgba(251,188,5,1)","rgba(234,67,53,1)","rgba(52,168,83,1)","rgba(175,93,164,1)"];
//"0b1y2r3v4r"
function showMinis(color){
    $.ajax({
      url: "allAtoms.json",
      dataType: "json",
      success: function (data) {
        allAtoms = data.allMol;
        displayImgs(color);
        $("#allMinis img").mouseenter(function(){
            $("#"+this.id).css("border","solid 4px "+colors[color]);
        });
        $("#allMinis img").mouseleave(function(){
            $("#"+this.id).css("border","none");
        });
      },
      error: function(err){
        alert("Something went wrong :\n"+err.toString());
      }
    });
}

function displayImgs(color){
    $("#allMinis").html("");
    allAtoms.forEach(function(mol){
        var i;
        for(i = 1 ; i <= mol.nbAtoms ; i++){
            if(mol.atomList[i].color == color){
                appendImg(mol.name,i);
            }
        }
    });
}

function appendImg(molName,id){
    $("<a href='../projet/#/"+molName+"/"+id+"'><img id='"+molName+id+"' src='./../projet/Molecules/"+molName+"/Details/atome"+id+"/mini.jpg' alt='miniature en jpg'></a>").appendTo("#allMinis");
}

//init
showMinis(2);
