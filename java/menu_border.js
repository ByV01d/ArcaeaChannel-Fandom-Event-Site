function createMenuBorder() { 
    var mb=document.getElementById("menu_border");
    if(!mb.getContext) return;
    var mx=mb.getContext("2d");
    mx.beginPath();
    mx.moveTo(0,0);
    mx.lineTo(450,0);
    mx.lineTo(450,150);
    mx.lineTo(150,150);
    mx.lineTo(0,0);
    mx.fillStyle="#79776a8e";
    mx.fill();
}
createMenuBorder();
