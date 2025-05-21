function createTextBorderT() {
    var tbt=document.getElementById("text-border-t");
    if(!tbt.getContext) return;
    var txt=tbt.getContext("2d");
    var img_border=document.getElementById("img-border") 
    txt.moveTo(0,0);
    txt.drawImage(img_border,0,0);
    txt.moveTo(25,10);
    txt.lineTo(575,10);
    txt.moveTo(580,0)
    txt.drawImage(img_border,580,0);
    txt.lineWidth=3;
    txt.stroke()
}
createTextBorderT();

function createTextBorderB() {
    var tbb=document.getElementById("text-border-b");
    if(!tbb.getContext) return;
    var txb=tbb.getContext("2d");
    var img_border=document.getElementById("img-border") 
    txb.moveTo(0,0);
    txb.drawImage(img_border,0,0);
    txb.moveTo(25,10);
    txb.lineTo(575,10);
    txb.moveTo(580,0)
    txb.drawImage(img_border,580,0);
    txb.lineWidth=3;
    txb.stroke()
}
createTextBorderB();