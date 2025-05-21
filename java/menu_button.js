let isGifPlaying = false;
let isHovering = false;
let isMenuOpen = false;

const menuGif = document.getElementById('menuGif');

// 修改鼠标事件处理逻辑
menuGif.addEventListener('mousedown', function() {
    if (!isGifPlaying) {
        this.src = 'img_all/menu.gif';
        // 增加GIF播放延迟处理
        setTimeout(() => {
            isGifPlaying = true;
        }, 300); 
    } else {
        this.src = 'img_all/menu_static.png';
    }
});

menuGif.addEventListener('mouseup', function() {
    if (isGifPlaying) { // 只在gif播放状态下生效
        if (isHovering && isMenuOpen) {
            this.src = 'img_all/menu_pressed_static.png';
        } else {
            this.src = 'img_all/menu_static.png';
            isGifPlaying = false;
        }        
    }
});

// 保持原有的悬停状态检测
menuGif.addEventListener('mouseenter', () => {
    isHovering = true;
    if (isMenuOpen) {
        menuGif.src = 'img_all/menu_pressed_static.png';
    }
    else  {
        isGifPlaying = false;
    }
});
menuGif.addEventListener('mouseleave', () => {
    isHovering = false;
    if (isGifPlaying && !isMenuOpen) { 
        menuGif.src = 'img_all/menu_static.png';
    }
    else {
        isGifPlaying = true;
    }
});