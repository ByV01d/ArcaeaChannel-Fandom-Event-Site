// 新增故事文本处理
let paragraphs = [];
let currentParagraphIndex = 0;
let typingSpeed = 50;  // ← 逐字显示速度（毫秒/字）
let isTyping = false;
let storyTextElement = null;  // 全局变量
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

// 确保DOM加载完成后再执行
document.addEventListener('DOMContentLoaded', () => {
    // 三次尝试获取元素
    const maxRetries = 3;
    let retryCount = 0;
    
    const tryGetElements = setInterval(() => {
        // 修复：使用正确的ID选择器
        storyTextElement = document.getElementById('storyText');
        tellerElement = document.getElementById('top-story-teller');
        
        if (storyTextElement || retryCount >= maxRetries) {
            clearInterval(tryGetElements);
            
            if (!storyTextElement) {
                console.error('[致命] storyText 元素始终未找到，请检查：');
                console.error('1. main.html第72行是否存在id="storyText"元素');
                console.error('2. 元素是否被动态移除');
                console.error('3. 是否存在多个相同id元素');
                return;
            }
            
            if (!tellerElement) {
                console.warn('top-story-teller 元素未找到，可能影响容器显示功能');
            }
            
            // 初始化成功后执行的代码
            console.log('✅ storyTextElement 已就绪:', storyTextElement);

            // 显示段落函数
            function showParagraph() {
                // 增强的样式检查
                if (storyTextElement && storyTextElement.offsetParent === null) {
                    console.warn('storyTextElement 当前不可见，检查CSS属性：');
                    console.warn(`display: ${getComputedStyle(storyTextElement).display}`);
                    console.warn(`visibility: ${getComputedStyle(storyTextElement).visibility}`);
                    console.warn(`position: ${getComputedStyle(storyTextElement).position}`);
                    console.warn(`top: ${getComputedStyle(storyTextElement).top}`);
                    console.warn(`left: ${getComputedStyle(storyTextElement).left}`);
                    console.warn(`z-index: ${getComputedStyle(storyTextElement).zIndex}`);
                }
                
                if (currentParagraphIndex >= paragraphs.length || !storyTextElement) return;

                const originalText = paragraphs[currentParagraphIndex];
                let index = 0;
                isTyping = true;
                
                // 清除旧的过渡类
                if (storyTextElement.classList) {
                    storyTextElement.classList.remove('last-paragraph');
                }

                const typingInterval = setInterval(() => {
                    if (index < originalText.length) {
                        // 双重检查元素存在性
                        if (!storyTextElement) {
                            clearInterval(typingInterval);
                            return;
                        }
                        
                        storyTextElement.textContent = originalText.substring(0, index + 1);
                        index++;
                    } else {
                        clearInterval(typingInterval);
                        isTyping = false;
                        
                        // 如果是最后一段，添加渐变透明效果
                        if (currentParagraphIndex === paragraphs.length - 1 && storyTextElement.classList) {
                            storyTextElement.classList.add('last-paragraph');
                        }
                    }
                }, typingSpeed);

                // 使用{ once: true }替代手动移除监听器
                document.addEventListener('mousedown', () => {
                    if (isTyping && storyTextElement) {
                        storyTextElement.textContent = originalText;
                        clearInterval(typingInterval);
                        isTyping = false;
                        
                        // 如果是最后一段，添加渐变透明效果
                        if (currentParagraphIndex === paragraphs.length - 1 && storyTextElement.classList) {
                            storyTextElement.classList.add('last-paragraph');
                        }
                    }
                }, { once: true });
                
                // 处理下一段或隐藏容器
                document.addEventListener('mousedown', () => {
                    if (isTyping) return;
                    
                    if (currentParagraphIndex < paragraphs.length - 1) {
                        currentParagraphIndex++;
                        if (storyTextElement) {
                            storyTextElement.textContent = '';
                        }
                        isTyping = true;
                        showParagraph();
                    } else {
                        // 最后一段点击后隐藏容器
                        if (tellerElement && tellerElement.classList && tellerElement.classList.contains('active')) {
                            // 立即清除所有文本内容
                            document.querySelectorAll('.story-text').forEach(el => {
                                el.textContent = '';
                            });
                            
                            // 移除active类
                            tellerElement.classList.remove('active');
                            
                            // 延迟重置状态
                            setTimeout(() => {
                                currentParagraphIndex = 0;
                                paragraphs = [];
                                if (storyTextElement) {
                                    storyTextElement.textContent = '';
                                    if (storyTextElement.classList) {
                                        storyTextElement.classList.remove('last-paragraph');
                                    }
                                }

                                tellerElement.classList.remove('active');
                                tellerElement.style.webkitBackdropFilter = 'blur(0px)';
                                tellerElement.style.backdropFilter = 'blur(0px)';
                                console.log(`当前元素模糊效果：${getComputedStyle(tellerElement).zIndex}`)
                                
                                // 强制同步样式更新
                                void tellerElement.offsetHeight;
                                
                                // 重置状态
                                setTimeout(() => {
                                    currentParagraphIndex = 0;
                                    paragraphs = [];
                                    if (storyTextElement) {
                                        storyTextElement.textContent = '';
                                    }
                                    
                                    // 向story.html发送重置消息
                                    const iframe = document.querySelector('iframe');
                                    if (iframe && iframe.contentWindow) {
                                        iframe.contentWindow.postMessage({
                                            type: 'resetStoryContainers'
                                        }, '*');
                                    }
                                }, 500);
                                
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
                // 更详细的来源检查（开发时可启用）
                // console.log('收到消息:', { origin: e.origin, data: e.data });
                
                // 动态重新获取teller元素
                if (!tellerElement) {
                    tellerElement = document.getElementById('top-story-teller');
                }
                
                // 消息类型验证
                if (typeof e.data !== 'object' || !e.data.type) {
                    console.debug('⚠️ 忽略无效消息:', e);
                    return;
                }
                
                if (e.data.type === 'showTeller' && e.data.containerId === 'story_f1') {
                    console.debug('📥 收到显示请求:', e.data);
                    
                    // 从服务器加载文本内容
                    fetch('/html/story/k.txt')  // 使用绝对路径
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP错误: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(text => {
                            if (typeof text !== 'string' || !text.trim()) {
                                throw new Error('接收到空文本响应');
                            }
                            
                            paragraphs = parseTextToArray(text);
                            
                            if (paragraphs.length > 0) {
                                // 重置文本状态
                                if (storyTextElement) {
                                    storyTextElement.textContent = '';
                                    if (storyTextElement.classList) {
                                        storyTextElement.classList.remove('last-paragraph');
                                    }
                                }
                                currentParagraphIndex = 0;
                                
                                // 添加兼容性前缀
                                if (tellerElement) {
                                    tellerElement.style.display = 'block';
                                    tellerElement.style.opacity = '0';
                                    tellerElement.style.webkitBackdropFilter = 'blur(0px)';
                                    tellerElement.style.backdropFilter = 'blur(0px)';
                                    
                                    requestAnimationFrame(() => {
                                        if (tellerElement && tellerElement.classList) {
                                            tellerElement.classList.add('active');
                                            void tellerElement.offsetWidth; // 强制重排
                                            tellerElement.style.opacity = '1';
                                            tellerElement.style.webkitBackdropFilter = 'blur(4px)';
                                            tellerElement.style.backdropFilter = 'blur(4px)';
                                            console.debug('✨ 容器已激活');
                                            
                                            // 双重验证容器是否可见
                                            setTimeout(() => {
                                                if (tellerElement.offsetParent === null) {
                                                    console.warn('⚠️ 容器在激活后仍不可见，当前样式：');
                                                    console.warn(`display: ${getComputedStyle(tellerElement).display}`);
                                                    console.warn(`visibility: ${getComputedStyle(tellerElement).visibility}`);
                                                    console.warn(`position: ${getComputedStyle(tellerElement).position}`);
                                                    console.warn(`top: ${getComputedStyle(tellerElement).top}`);
                                                    console.warn(`left: ${getComputedStyle(tellerElement).left}`);
                                                    console.warn(`z-index: ${getComputedStyle(tellerElement).zIndex}`);
                                                }
                                            }, 100);
                                        }
                                    });
                                }
                                
                                // 开始显示第一段文字
                                showParagraph();
                            } else {
                                console.warn('📄 解析得到空段落数组');
                            }
                        })
                        .catch(error => {
                            console.error("❌ 无法加载或解析 k.txt：", error);
                            paragraphs = [];
                        });
                } else if (e.data.type === 'hideTeller') {
                    console.debug('📥 收到隐藏请求:', e.data);
                    
                    // 隐藏teller
                    if (tellerElement && tellerElement.classList && tellerElement.classList.contains('active')) {
                        // 立即移除active类并重置模糊效果
                        tellerElement.classList.remove('active');
                        tellerElement.style.webkitBackdropFilter = 'blur(0px)';
                        tellerElement.style.backdropFilter = 'blur(0px)';
                        console.log(`当前元素模糊效果：${getComputedStyle(tellerElement).zIndex}`)
                        
                        // 强制同步样式更新
                        void tellerElement.offsetHeight;
                        
                        // 重置状态
                        setTimeout(() => {
                            currentParagraphIndex = 0;
                            paragraphs = [];
                            if (storyTextElement) {
                                storyTextElement.textContent = '';
                            }
                            
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
            });
        }
        
        retryCount++;
    }, 500);
});