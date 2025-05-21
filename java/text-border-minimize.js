function createTextBorderMinimize() {
    var tbm=document.getElementById("text-border-minimize");
    if(!tbm.getContext) return;
    var txm=tbm.getContext("2d");
    txm.moveTo(0,10);
    txm.lineTo(200,10);
    txm.lineWidth=3;
    txm.stroke()
}
createTextBorderMinimize();