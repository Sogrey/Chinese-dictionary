// Chinese Dictionary Query System - JavaScript

// Create global ChineseDictionary object immediately
window.ChineseDictionary = window.ChineseDictionary || {};
console.log('ChineseDictionary object initialized at script load');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing components...');
    
    // Ensure global object exists immediately
    if (!window.ChineseDictionary) {
        console.log('Creating ChineseDictionary global object...');
        window.ChineseDictionary = {};
    }
    
    // Initialize all components
    initializeSearch();
    initializeViewToggle();
    initializeKeyboardShortcuts();
    initializeTooltips();
    initializeScrollToTop();
    initializeTTS();
    
    console.log('All components initialized.');
    console.log('ChineseDictionary object after init:', window.ChineseDictionary);
});

// Search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[name="q"]');
    const searchForms = document.querySelectorAll('form[action*="search"]');
    
    // Auto-focus and select text on search inputs
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            setTimeout(() => this.select(), 50);
        });
        
        // Add search suggestions (placeholder for future implementation)
        input.addEventListener('input', debounce(function() {
            // TODO: Implement search suggestions
            handleSearchSuggestions(this.value);
        }, 300));
    });
    
    // Form submission handling
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const query = this.querySelector('input[name="q"]').value.trim();
            if (!query) {
                e.preventDefault();
                showNotification('请输入查询内容', 'warning');
                return;
            }
            
            // Add loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 查询中...';
            }
        });
    });
}

// View toggle functionality
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('[data-view]');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!resultsContainer) return;
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.dataset.view;
            
            // Update button states
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update container class
            resultsContainer.className = resultsContainer.className.replace(/\blist-view\b/, '');
            if (viewType === 'list') {
                resultsContainer.classList.add('list-view');
            }
            
            // Save preference
            localStorage.setItem('preferredView', viewType);
            
            // Animate transition
            resultsContainer.style.opacity = '0.7';
            setTimeout(() => {
                resultsContainer.style.opacity = '1';
            }, 150);
        });
    });
    
    // Restore saved view preference
    const savedView = localStorage.getItem('preferredView');
    if (savedView) {
        const savedButton = document.querySelector(`[data-view="${savedView}"]`);
        if (savedButton) {
            savedButton.click();
        }
    }
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[name="q"]');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // Escape: Clear search or go back
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('input[name="q"]:focus');
            if (searchInput) {
                searchInput.value = '';
                searchInput.blur();
            } else if (window.location.pathname.includes('/character/')) {
                history.back();
            }
        }
        
        // Arrow keys for pagination
        if (e.key === 'ArrowLeft' && e.altKey) {
            const prevLink = document.querySelector('.pagination .page-item:not(.disabled) .page-link[href*="page=' + (getCurrentPage() - 1) + '"]');
            if (prevLink) {
                prevLink.click();
            }
        }
        
        if (e.key === 'ArrowRight' && e.altKey) {
            const nextLink = document.querySelector('.pagination .page-item:not(.disabled) .page-link[href*="page=' + (getCurrentPage() + 1) + '"]');
            if (nextLink) {
                nextLink.click();
            }
        }
    });
}

// Initialize tooltips
function initializeTooltips() {
    // Add tooltips to various elements
    const tooltipElements = [
        { selector: '[data-view="grid"]', title: '网格视图' },
        { selector: '[data-view="list"]', title: '列表视图' },
        { selector: 'code', title: '点击复制' }
    ];
    
    tooltipElements.forEach(({ selector, title }) => {
        document.querySelectorAll(selector).forEach(el => {
            if (!el.hasAttribute('data-bs-toggle')) {
                el.setAttribute('title', title);
                el.setAttribute('data-bs-toggle', 'tooltip');
            }
        });
    });
    
    // Initialize Bootstrap tooltips for all elements with data-bs-toggle="tooltip"
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'btn btn-primary position-fixed rounded-circle';
    scrollButton.style.cssText = `
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    scrollButton.setAttribute('title', '回到顶部');
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Smooth scroll to top
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility functions

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get current page number from URL
function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
}

// Show notification (placeholder - could be enhanced with actual toast/modal)
function showNotification(message, type = 'info') {
    // Create simple alert for now
    const alertClass = {
        'success': 'alert-success',
        'warning': 'alert-warning', 
        'error': 'alert-danger',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-dismiss after 5 seconds for info messages, 3 seconds for others
    const dismissTime = type === 'info' ? 5000 : 3000;
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, dismissTime);
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已复制到剪贴板', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy function for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position: fixed; top: -1000px; left: -1000px;';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('已复制到剪贴板', 'success');
    } catch (err) {
        showNotification('复制失败，请手动复制', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Search suggestions (placeholder for future implementation)
function handleSearchSuggestions(query) {
    if (query.length < 2) return;
    
    // TODO: Implement AJAX search suggestions
    // This could call the API endpoint to get matching characters
    console.log('Search suggestions for:', query);
}

// Character card click handling
document.addEventListener('click', function(e) {
    // Handle character copying
    if (e.target.tagName === 'CODE' || e.target.closest('code')) {
        const codeElement = e.target.tagName === 'CODE' ? e.target : e.target.closest('code');
        copyToClipboard(codeElement.textContent);
        e.preventDefault();
    }
    
    // Handle character display clicking
    if (e.target.classList.contains('character-zi') || e.target.closest('.character-display')) {
        const characterElement = e.target.classList.contains('character-zi') ? e.target : e.target.closest('.character-display').querySelector('.character-zi');
        if (characterElement && !e.target.closest('a')) {
            copyToClipboard(characterElement.textContent);
        }
    }
});

// Search form enhancement
document.addEventListener('change', function(e) {
    // Auto-submit on search type change (optional)
    if (e.target.name === 'type' && e.target.closest('form')) {
        const form = e.target.closest('form');
        const queryInput = form.querySelector('input[name="q"]');
        if (queryInput && queryInput.value.trim()) {
            // Optional: auto-submit on type change
            // form.submit();
        }
    }
});

// Performance monitoring (optional)
if (window.performance) {
    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    });
}

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Enhance accessibility
document.addEventListener('keydown', function(e) {
    // Add keyboard navigation for character cards
    if (e.key === 'Enter' && e.target.classList.contains('character-card')) {
        const link = e.target.querySelector('a');
        if (link) {
            link.click();
        }
    }
});

// Export functions for potential external use
window.ChineseDictionary = {
    copyToClipboard,
    showNotification,
    debounce,
    getCurrentPage,
    playPinyin,
    playPinyinWithFallback,
    // Test function for debugging
    testTTS: function(text = 'zhōng') {
        console.log('Testing TTS with:', text);
        return playPinyinWithFallback(text);
    },
    // Check available voices
    checkVoices: function() {
        const voices = speechSynthesis.getVoices();
        console.log('All available voices:', voices);
        const chineseVoices = voices.filter(voice => 
            voice.lang.startsWith('zh') || 
            voice.name.toLowerCase().includes('chinese') ||
            voice.name.includes('中文')
        );
        console.log('Chinese voices:', chineseVoices);
        return chineseVoices;
    },
    // Quick test of Web Speech API
    quickTest: function() {
        console.log('Running quick TTS test...');
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('测试');
            utterance.lang = 'zh-CN';
            utterance.rate = 0.6;
            
            const voices = speechSynthesis.getVoices();
            const chineseVoice = voices.find(voice => voice.lang.startsWith('zh'));
            if (chineseVoice) {
                utterance.voice = chineseVoice;
                console.log('Using voice:', chineseVoice.name);
            }
            
            utterance.onstart = () => console.log('Quick test speech started');
            utterance.onend = () => console.log('Quick test speech ended');
            utterance.onerror = (e) => console.error('Quick test speech error:', e);
            
            speechSynthesis.speak(utterance);
            return true;
        }
        return false;
    }
};

console.log('ChineseDictionary object created with functions:', Object.keys(window.ChineseDictionary));

// Text-to-Speech functionality
function initializeTTS() {
    console.log('Initializing TTS functionality...');
    
    // Check TTS support
    const hasSpeechSynthesis = 'speechSynthesis' in window;
    console.log('Speech synthesis supported:', hasSpeechSynthesis);
    
    if (hasSpeechSynthesis) {
        console.log('Text-to-Speech is supported');
        
        // Function to log available voices
        function logAvailableVoices() {
            const voices = speechSynthesis.getVoices();
            console.log('Available voices loaded:', voices.length);
            
            // Log Chinese voices specifically
            const chineseVoices = voices.filter(voice => 
                voice.lang.startsWith('zh') || 
                voice.name.toLowerCase().includes('chinese') ||
                voice.name.includes('中文')
            );
            
            if (chineseVoices.length > 0) {
                console.log('Chinese voices available:');
                chineseVoices.forEach(voice => {
                    console.log(`  - ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
                });
            } else {
                console.warn('No Chinese voices found. TTS may use English pronunciation.');
                console.log('Suggestion: Install Chinese language pack or try Google TTS fallback.');
                
                // Show a one-time notification about voice pack installation
                if (!localStorage.getItem('chinese-voice-warning-shown')) {
                    setTimeout(() => {
                        showNotification('建议安装中文语音包以获得更好的发音效果！<br><small>或使用Chrome浏览器获得更好的中文TTS支持</small>', 'info');
                        localStorage.setItem('chinese-voice-warning-shown', 'true');
                    }, 2000);
                }
            }
        }
        
        // Wait for voices to load
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.addEventListener('voiceschanged', function() {
                logAvailableVoices();
            });
        } else {
            logAvailableVoices();
        }
        
        // Also check voices after a delay
        setTimeout(logAvailableVoices, 1000);
        
    } else {
        console.warn('Text-to-Speech is not supported in this browser');
    }
    
    console.log('Adding click event listener for pinyin badges...');
    // Add click handlers to pinyin badges
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target);
        
        // Check if clicked element is a pinyin badge (with speaker icon)
        const badge = e.target.closest('.badge.bg-primary');
        console.log('Badge found:', badge);
        
        if (badge && badge.querySelector('.fa-volume-up')) {
            console.log('Pinyin badge clicked, processing TTS...');
            e.preventDefault();
            e.stopPropagation();
            
            // Extract pinyin text (remove the speaker icon text)
            const pinyinText = badge.textContent.trim();
            console.log('Extracted pinyin text:', pinyinText);
            
            // Add visual feedback
            badge.classList.add('speaking');
            
            // Play pronunciation
            playPinyinWithFallback(pinyinText).finally(() => {
                // Remove visual feedback after speech ends
                setTimeout(() => {
                    badge.classList.remove('speaking');
                }, 500);
            });
        }
    });
}

// Primary TTS function using Web Speech API
function playPinyin(text) {
    if (!('speechSynthesis' in window)) {
        showNotification('您的浏览器不支持语音合成', 'warning');
        return false;
    }
    
    try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        // Wait a moment for cancellation to complete
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure for Chinese pronunciation with more specific settings
            utterance.lang = 'zh-CN';
            utterance.rate = 0.6; // Even slower for better clarity
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // Get available voices and find the best Chinese voice
            const voices = speechSynthesis.getVoices();
            console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
            
            // Priority order for Chinese voices
            const chineseVoiceSelectors = [
                // Mandarin Chinese voices
                v => v.lang === 'zh-CN' && v.name.includes('Mandarin'),
                v => v.lang === 'zh-CN' && v.name.includes('Chinese'),
                v => v.lang === 'zh-CN' && v.name.includes('中文'),
                v => v.lang === 'zh-CN' && v.name.includes('普通话'),
                // Any Chinese voice
                v => v.lang === 'zh-CN',
                v => v.lang.startsWith('zh-'),
                v => v.name.toLowerCase().includes('chinese'),
                v => v.name.includes('中文')
            ];
            
            let selectedVoice = null;
            for (const selector of chineseVoiceSelectors) {
                selectedVoice = voices.find(selector);
                if (selectedVoice) {
                    break;
                }
            }
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('Using Chinese voice:', selectedVoice.name, selectedVoice.lang);
            } else {
                console.warn('No Chinese voice found, using default');
                // Force Chinese language even without specific voice
                utterance.lang = 'zh-CN';
            }
            
            // Add event listeners for feedback
            utterance.onstart = function() {
                console.log('TTS started for:', text, 'Voice:', selectedVoice?.name || 'default');
            };
            
            utterance.onend = function() {
                console.log('TTS finished for:', text);
            };
            
            utterance.onerror = function(event) {
                console.error('TTS error:', event.error);
                showNotification('语音播放失败', 'warning');
                // Try Google TTS as fallback (removed modal)
                tryGoogleTTS(text).catch(() => {
                    console.log('All TTS methods failed, skipping modal');
                });
            };
            
            speechSynthesis.speak(utterance);
        }, 100);
        
        return true;
        
    } catch (error) {
        console.error('TTS error:', error);
        showNotification('语音播放失败', 'error');
        return false;
    }
}

// Fallback TTS function with multiple options
function playPinyinWithFallback(text) {
    console.log('playPinyinWithFallback called with:', text);
    
    return new Promise((resolve, reject) => {
        // Clean the text (remove extra spaces and icons)
        const cleanText = text.replace(/[\s\uF000-\uF8FF]/g, '').trim();
        console.log('Cleaned text:', cleanText);
        
        if (!cleanText) {
            console.warn('No pinyin text found');
            showNotification('无法获取拼音文本', 'warning');
            reject(new Error('No pinyin text'));
            return;
        }
        
        console.log('Playing pronunciation for:', cleanText);
        
        // Try primary method (Web Speech API)
        const speechResult = playPinyin(cleanText);
        console.log('Web Speech API result:', speechResult);
        
        if (speechResult) {
            // Wait for speech to end
            setTimeout(() => resolve(), 2000);
            return;
        }
        
        console.log('Falling back to Google TTS...');
        // Fallback 1: Google Translate TTS (unofficial)
        tryGoogleTTS(cleanText)
            .then(() => {
                console.log('Google TTS succeeded');
                resolve();
            })
            .catch(() => {
                console.log('Google TTS failed, no more fallbacks');
                // Removed pronunciation guide modal
                resolve();
            });
    });
}

// Google Translate TTS fallback
function tryGoogleTTS(text) {
    return new Promise((resolve, reject) => {
        try {
            const audio = new Audio();
            const encodedText = encodeURIComponent(text);
            
            // Use Google Translate TTS with explicit Chinese language setting
            audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-cn&client=tw-ob&q=${encodedText}&tk=1`;
            
            audio.oncanplaythrough = function() {
                console.log('Google TTS loaded successfully for Chinese');
                audio.play()
                    .then(() => {
                        console.log('Google TTS played successfully in Chinese');
                        resolve();
                    })
                    .catch((error) => {
                        console.warn('Google TTS play failed:', error);
                        reject(error);
                    });
            };
            
            audio.onerror = function(error) {
                console.warn('Google TTS failed to load:', error);
                reject(new Error('Google TTS failed'));
            };
            
            // Timeout after 5 seconds
            setTimeout(() => {
                reject(new Error('Google TTS timeout'));
            }, 5000);
            
        } catch (error) {
            console.error('Google TTS setup error:', error);
            reject(error);
        }
    });
}

// Show pronunciation guide as final fallback
function showPronunciationGuide(text) {
    // Check available Chinese voices for diagnostic info
    const voices = speechSynthesis.getVoices();
    const chineseVoices = voices.filter(voice => 
        voice.lang.startsWith('zh') || 
        voice.name.toLowerCase().includes('chinese') ||
        voice.name.includes('中文')
    );
    
    let voiceInfo = '';
    if (chineseVoices.length > 0) {
        voiceInfo = `
            <div class="alert alert-info mt-3">
                <small><strong>可用中文语音:</strong><br>
                ${chineseVoices.map(v => `${v.name} (${v.lang})`).join('<br>')}
                </small>
            </div>
        `;
    } else {
        voiceInfo = `
            <div class="alert alert-warning mt-3">
                <small><strong>没有找到中文语音包</strong><br>
                建议安装中文语音包或使用Chrome浏览器获得更好的中文发音。
                </small>
            </div>
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-volume-up text-primary"></i>
                        发音指导
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="pronunciation-display">
                        <div class="pinyin-large" style="font-size: 2rem; color: #e91e63; font-weight: bold; margin-bottom: 1rem;">
                            ${text}
                        </div>
                        <div class="text-muted mb-3">
                            <small>请根据拼音读出正确发音</small>
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-outline-primary btn-sm me-2" onclick="playPinyinWithFallback('${text}')">
                                <i class="fas fa-redo"></i> 重试Web Speech API
                            </button>
                            <button type="button" class="btn btn-outline-success btn-sm" onclick="tryGoogleTTS('${text}')">
                                <i class="fas fa-globe"></i> 尝试Google TTS
                            </button>
                        </div>
                        ${voiceInfo}
                        <div class="mt-3">
                            <small class="text-muted">
                                <strong>提示:</strong> 如果发音不准确，请尝试在Chrome浏览器中打开，或安装中文语音包。
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    if (typeof bootstrap !== 'undefined') {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Clean up after modal is hidden
        modal.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modal);
        });
    } else {
        // Fallback: simple alert
        alert(`发音: ${text}\n\n请根据拼音读出正确发音`);
        document.body.removeChild(modal);
    }
}

// Assign TTS functions to the global ChineseDictionary object
window.ChineseDictionary = window.ChineseDictionary || {};
Object.assign(window.ChineseDictionary, {
    // TTS Functions
    playPinyin: playPinyin,
    playPinyinWithFallback: playPinyinWithFallback,
    tryGoogleTTS: tryGoogleTTS,
    // showPronunciationGuide: showPronunciationGuide, // Disabled to prevent modal popup
    
    // Test Functions
    testTTS: function(text) {
        console.log('Testing TTS with text:', text);
        return playPinyinWithFallback(text || 'zhōng');
    },
    
    checkVoices: function() {
        if ('speechSynthesis' in window) {
            const voices = speechSynthesis.getVoices();
            console.log('Available voices (' + voices.length + ' total):');
            voices.forEach((voice, index) => {
                console.log(`${index + 1}. ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
            });
            
            const chineseVoices = voices.filter(voice => 
                voice.lang.startsWith('zh') || 
                voice.name.toLowerCase().includes('chinese') ||
                voice.name.includes('中文')
            );
            
            console.log('\nChinese voices found:', chineseVoices.length);
            chineseVoices.forEach((voice, index) => {
                console.log(`${index + 1}. ${voice.name} (${voice.lang})`);
            });
            
            return { total: voices.length, chinese: chineseVoices.length, voices: voices };
        } else {
            console.warn('Speech synthesis not supported');
            return { total: 0, chinese: 0, voices: [] };
        }
    },
    
    // Utility function to check TTS support
    checkTTSSupport: function() {
        const support = {
            speechSynthesis: 'speechSynthesis' in window,
            speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
            audioAPI: 'Audio' in window
        };
        console.log('TTS Support Check:', support);
        return support;
    }
});

console.log('ChineseDictionary object populated with TTS functions');
console.log('Available methods:', Object.keys(window.ChineseDictionary));