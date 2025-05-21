function createBorderR() {
    var rb=document.getElementById("right-border");
    if(!rb.getContext) return;
    var rtx=rb.getContext("2d");
    rtx.moveTo(150,0);
    rtx.lineTo(150,150);
    rtx.lineTo(0,0);
    rtx.lineTo(150,0);
    rtx.fillStyle="#fffef4";
    rtx.fill();
}
createBorderR();

