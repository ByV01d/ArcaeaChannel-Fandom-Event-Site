document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-button-container');
    const menuContainer = document.querySelector('.menu-container');
    const menuGif = document.getElementById('menuGif');
    const menuSelections = document.querySelectorAll('.menu-selection');
    
    // 切换菜单状态
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        menuContainer.classList.toggle('active');
        
        isMenuOpen = menuContainer.classList.contains('active');
        if (!isMenuOpen) {
            menuGif.src = 'img_all/menu_static.png';
        }
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!menuContainer.contains(e.target) && !menuButton.contains(e.target)) {
            menuContainer.classList.remove('active');
            isMenuOpen = false;
            menuGif.src = 'img_all/menu_static.png';
        }
    });

    // 鼠标离开菜单区域时关闭菜单
    menuContainer.addEventListener('mouseleave', () => {
        if (isMenuOpen) {
            menuContainer.classList.remove('active');
            isMenuOpen = false;
            menuGif.src = 'img_all/menu_static.png';
        }
    });

    // 添加菜单项点击样式切换
    menuSelections.forEach(selection => {
        selection.addEventListener('click', () => {
            menuSelections.forEach(s => s.classList.remove('active'));
            selection.classList.add('active');
        });
    });
});