// 全局状态变量
let paragraphs = []; // 段落数组（点击后加载）
let currentParagraphIndex = 0; // 当前段落索引
let isProcessing = false; // 处理中状态
let originalTypingSpeed = 50; // 默认打字速度
let typingSpeed = originalTypingSpeed; // 当前打字速度
let isTyping = false; // 打字状态
let storyTextElement = null; // 全局文本元素

// 文本解析函数
function parseTextToArray(text) {
    const lines = text.split(/\r?\n/);
    const result = [];
    let currentStr = '';

    for (let line of lines) {
        line = line.trim();

        if (line === '-') {
            if (currentStr) {
                currentStr = currentStr.replace(/\n$/, '');
                result.push(currentStr);
                currentStr = '';
            }
        } else if (line === '+') {
            if (currentStr) {
                currentStr = currentStr.replace(/\n$/, '');
                result.push(currentStr);
            }
            break;
        } else {
            if (currentStr) currentStr += '\n';
            currentStr += line;
        }
    }

    if (currentStr) {
        currentStr = currentStr.replace(/\n$/, '');
        result.push(currentStr);
    }

    return result;
}

// 增强版点击加载逻辑
// 点击加载文本（确保容器存在时绑定）
function bindStoryF1ClickListener() {
    const storyF1 = document.getElementById('story-f1');
    if (storyF1) {
        // 使用事件委托避免重复绑定
        storyF1.addEventListener('click', async (e) => {
            console.log('story-f1 clicked');  // 添加调试日志
            // 防止事件冒泡
            e.stopPropagation();
            
            // 检查是否已加载
            if (paragraphs.length > 0) return;
            
            try {
                const response = await fetch('html/story/k.txt');
                console.log('Response status:', response.status);  // 添加调试日志
                // 显式检查响应状态
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const text = await response.text();
                console.log('Text length:', text.length);  // 添加调试日志
                paragraphs = parseTextToArray(text);
                console.log('Parsed paragraphs:', paragraphs);  // 添加调试日志
                
                // 初始化故事显示
                const storyContainer = document.getElementById('top-story-teller');
                if (storyContainer && paragraphs.length > 0) {
                    currentParagraphIndex = 0;
                    isProcessing = false;
                    console.log('Starting paragraph transition');  // 添加调试日志
                    await handleParagraphTransition(storyContainer, paragraphs);
                }
            } catch (error) {
                console.error('加载文本失败:', error);
                // 显示用户友好的错误提示
                const storyContainer = document.getElementById('top-story-teller');
                if (storyContainer) {
                    storyContainer.innerHTML = '<div class="error">无法加载故事内容，请稍后再试。</div>';
                }
            }
        });
    }
}

// DOM加载完成后绑定事件
document.addEventListener('DOMContentLoaded', bindStoryF1ClickListener);

// 如果容器样式重置后需要重新绑定
function rebindStoryF1ClickListener() {
    // 移除所有旧监听器
    const storyF1 = document.getElementById('story-f1');
    if (storyF1) {
        const newElement = storyF1.cloneNode(true);
        storyF1.parentNode.replaceChild(newElement, storyF1);
    }
    // 绑定新监听器
    bindStoryF1ClickListener();
}

let tellerElement = null;     // 新增teller缓存

// 解析k.txt内容（移出嵌套作用域）
function parseTextToArray(text) {
    const lines = text.split(/\r?\n/);
    const result = [];
    let currentStr = '';

    for (let line of lines) {
        line = line.trim();

        if (line === '-') {
            if (currentStr) {
                currentStr = currentStr.replace(/\n$/, '');
                result.push(currentStr);
                currentStr = '';
            }
        } else if (line === '+') {
            if (currentStr) {
                currentStr = currentStr.replace(/\n$/, '');
                result.push(currentStr);
            }
            break;
        } else {
            if (currentStr) currentStr += '\n';
            currentStr += line;
        }
    }

    if (currentStr) {
        currentStr = currentStr.replace(/\n$/, '');
        result.push(currentStr);
    }

    return result;
}

function onElementReady(selector, callback) {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.matches && node.matches(selector)) {
                    observer.disconnect();
                    callback(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// 使用单一绑定机制
onElementReady('#story-content', function(element) {
    element.addEventListener('click', restoreStoryStyles);
});

// 简化后备方案
(function waitForElement() {
    const element = document.getElementById('story-content');
    if (element) {
        element.addEventListener('click', restoreStoryStyles);
        // 初始化时触发段落显示
        restoreStoryStyles();
    } else {
        setTimeout(waitForElement, 500);
    }
})();

// 监听来自story.html的消息
window.addEventListener('message', function(e) {
    if (e.data === 'restoreStyles') {
        restoreStoryStyles();
    }
});

function showParagraph(element, delay = 0) {
    setTimeout(() => {
        element.classList.add('fade-in');
        element.style.opacity = '1';
    }, delay);
}

// 整合到现有逻辑
function restoreStoryStyles() {
    const textElements = document.querySelectorAll('.story-text');
    textElements.forEach((element, index) => {
        element.style.opacity = '0';
        // 使用优化后的showParagraph
        showParagraph(element, index * 150);
    });
}

// 增强版逐字显示函数
function showParagraphWithProgress(container, text, delay = 0) {
    console.log('Showing paragraph:', text);  // 添加调试日志
    return new Promise((resolve) => {
        const effectiveDelay = Math.max(delay, 100);
        
        // 清除现有内容
        container.innerHTML = '';
        
        // 创建文本容器
        const textElement = document.createElement('div');
        textElement.className = 'story-text';
        container.appendChild(textElement);
        
        // 重置样式
        textElement.style.opacity = '0';
        
        // 文本逐字显示逻辑
        let charIndex = 0;
        const totalChars = text.length;
        let intervalId = null;
        
        // 使用requestAnimationFrame优化性能
        window.requestAnimationFrame(() => {
            intervalId = setInterval(() => {
                if (charIndex < totalChars) {
                    textElement.textContent = text.substring(0, charIndex + 1);
                    charIndex++;
                } else {
                    clearInterval(intervalId);
                    // 文字完全显示后触发回调
                    setTimeout(() => {
                        // 添加淡出过渡
                        textElement.style.transition = 'opacity 0.5s';
                        textElement.style.opacity = '1';
                        resolve();
                    }, 300);
                }
            }, typingSpeed);
        });
        
        // 错误处理：超时保护
        setTimeout(() => {
            if (charIndex < totalChars) {
                clearInterval(intervalId);
                textElement.textContent = text;
                resolve();
            }
        }, 10000); // 10秒超时保护
    });
}

// 淡出并清理函数
function fadeOutElements(container) {
    return new Promise(resolve => {
        // 修改容器样式
        container.style.transition = 'color 1s';
        container.style.color = 'transparent';
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #00000070;
            z-index: 9999;
            transition: background-color 1s;
        `;
        document.body.appendChild(overlay);
        
        // 执行淡出
        setTimeout(() => {
            overlay.style.backgroundColor = 'transparent';
            container.style.opacity = '0';
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(overlay);
                // 清空段落容器
                container.innerHTML = '';
                // 清空段落数组
                paragraphs = [];
                resolve();
            }, 1000);
        }, 50);
    });
}
