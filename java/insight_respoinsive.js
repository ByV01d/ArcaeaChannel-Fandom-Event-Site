window.addEventListener('scroll', function() {
    const insightElement = document.querySelector('.insight');
    const scrollY = window.scrollY || window.pageYOffset;

    /* 最大边缘高度（洞烛会跟着向下滚动的最大距离）：px*/ 
    const maxPaddingTop = 250;

    let currentPaddingTop = parseFloat(insightElement.style.paddingTop) || 0;
    const targetPaddingTop = Math.min(scrollY, maxPaddingTop);

    function animate() {
        const threshold = 0.1; 
        const difference = targetPaddingTop - currentPaddingTop;
    
        if (Math.abs(difference) > threshold) {
            currentPaddingTop += difference * 0.1;
            insightElement.style.paddingTop = `${currentPaddingTop}px`;
            requestAnimationFrame(animate);
        } else {           
            currentPaddingTop = targetPaddingTop;
            insightElement.style.paddingTop = `${currentPaddingTop}px`;
        }
    }

    animate();
});