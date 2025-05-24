// 新增故事文本处理
let paragraphs = [];
let currentParagraphIndex = 0;
let typingSpeed = 50;  // ← 逐字显示速度（毫秒/字）
let isTyping = false;

// 确保DOM加载完成后再执行
document.addEventListener('DOMContentLoaded', () => {
    const storyTextElement = document.getElementById('storyText');
    if (!storyTextElement) {
        console.error('storyText 元素未找到，请检查页面结构');
        return;
    }

    // 解析k.txt内容
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

    // 显示段落函数
    function showParagraph() {
        if (currentParagraphIndex >= paragraphs.length || !storyTextElement) return;

        const originalText = paragraphs[currentParagraphIndex];
        let index = 0;
        isTyping = true;
        
        // 清除旧的过渡类
        storyTextElement.classList.remove('last-paragraph');

        const typingInterval = setInterval(() => {
            if (index < originalText.length) {
                storyTextElement.textContent = originalText.substring(0, index + 1);
                index++;
            } else {
                clearInterval(typingInterval);
                isTyping = false;
                
                // 如果是最后一段，添加渐变透明效果
                if (currentParagraphIndex === paragraphs.length - 1) {
                    storyTextElement.classList.add('last-paragraph');
                }
            }
        }, typingSpeed);

        // 使用{ once: true }替代手动移除监听器
        document.addEventListener('mousedown', () => {
            if (isTyping) {
                storyTextElement.textContent = originalText;
                clearInterval(typingInterval);
                isTyping = false;
                
                // 如果是最后一段，添加渐变透明效果
                if (currentParagraphIndex === paragraphs.length - 1) {
                    storyTextElement.classList.add('last-paragraph');
                }
            }
        }, { once: true });
        
        // 处理下一段或隐藏容器
        document.addEventListener('mousedown', () => {
            if (isTyping) return;
            
            if (currentParagraphIndex < paragraphs.length - 1) {
                currentParagraphIndex++;
                storyTextElement.textContent = '';
                isTyping = true;
                showParagraph();
            } else {
                // 最后一段点击后隐藏容器
                const teller = document.getElementById('top-story-teller');
                if (teller && teller.classList.contains('active')) {
                    teller.classList.remove('active');
                    
                    // 延迟重置状态
                    setTimeout(() => {
                        currentParagraphIndex = 0;
                        paragraphs = [];
                        storyTextElement.textContent = '';
                        
                        // 向story.html发送重置消息
                        const iframe = document.querySelector('iframe');
                        if (iframe && iframe.contentWindow) {
                            iframe.contentWindow.postMessage({
                                type: 'resetStoryContainers'
                            }, '*');
                        }
                    }, 500);
                }
            }
        }, { once: true });
    }

    // 监听来自story.html的消息
    window.addEventListener('message', function(e) {
        // 添加消息来源验证（示例）
        // if (e.origin !== 'https://yourdomain.com') return;
        
        const teller = document.getElementById('top-story-teller');
        
        if (!teller) {
            console.error('top-story-teller 元素未找到，请检查页面结构');
            return;
        }
        
        if (e.data.type === 'showTeller' && e.data.containerId === 'story_f1') {
            // 从服务器加载文本内容
            fetch('/html/story/k.txt')  // 使用绝对路径
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP错误: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    paragraphs = parseTextToArray(text);
                    
                    if (paragraphs.length > 0) {
                        // 重置文本状态
                        storyTextElement.textContent = '';
                        storyTextElement.classList.remove('last-paragraph');
                        currentParagraphIndex = 0;
                        
                        // 添加兼容性前缀
                        teller.style.display = 'block';
                        teller.style.opacity = '0';
                        teller.style.webkitBackdropFilter = 'blur(0px)';
                        teller.style.backdropFilter = 'blur(0px)';
                        
                        requestAnimationFrame(() => {
                            teller.classList.add('active');
                            void teller.offsetWidth;
                            teller.style.opacity = '1';
                            teller.style.webkitBackdropFilter = 'blur(4px)';
                            teller.style.backdropFilter = 'blur(4px)';
                        });
                        
                        // 开始显示第一段文字
                        showParagraph();
                    }
                })
                .catch(error => {
                    console.error("无法加载或解析 k.txt：", error);
                    paragraphs = [];
                });
        } else if (e.data.type === 'hideTeller') {
            // 隐藏teller
            teller.classList.remove('active');
            
            // 重置状态
            setTimeout(() => {
                currentParagraphIndex = 0;
                paragraphs = [];
                storyTextElement.textContent = '';
                
                // 向story.html发送重置消息
                const iframe = document.querySelector('iframe');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'resetStoryContainers'
                    }, '*');
                }
            }, 500);
        }
    });
});