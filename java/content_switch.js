/* 原代码
function switchContent(type) {
  // 隐藏所有卡片
  document.querySelectorAll('.content-switch').forEach(card => {
    card.classList.remove('active');
  });
  
  // 显示目标卡片
  const target = document.getElementById(`${type}`);
  target.classList.add('active');

  // 保存状态
  localStorage.setItem('activeContent', type);
}
*/
function switchContent(type) {
  // 隐藏所有卡片
  const content = document.querySelectorAll('.content-switch');
  content.forEach(card => {
    card.classList.remove('active');
  });
  
  // 显示目标卡片
  const target = document.getElementById(`${type}`);
  if (target == "image"){
    target = "main"
  }
  const bg = document.getElementById('header-container');
  if (target) {
    target.classList.add('active');
    if (type != 'main'){
      bg.classList.remove('c-regular');
      bg.classList.add('c-changed');
    } else {
      bg.classList.remove('c-changed');
      bg.classList.add('c-regular');
    } 
  } else {
    console.error(`Element with id "${type}" not found.`);
  }



  // 保存状态
  localStorage.setItem('activeContent', type);
}

// 初始化加载
window.addEventListener('DOMContentLoaded', () => {
  const savedType = localStorage.getItem('activeContent') || 'main';
  switchContent(savedType);
});
