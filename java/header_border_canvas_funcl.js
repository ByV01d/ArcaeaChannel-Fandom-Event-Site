function createBorderL() {
    var lb=document.getElementById("left-border");
    if(!lb.getContext) return;
    var ltx=lb.getContext("2d");
    ltx.moveTo(0,0);
    ltx.lineTo(150,0);
    ltx.lineTo(0,150);
    ltx.lineTo(0,0);
    ltx.fillStyle="#fffef4";
    ltx.fill();
}
createBorderL();

