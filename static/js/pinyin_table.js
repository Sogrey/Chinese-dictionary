// Pinyin Table Generator and Controller

// Define the comprehensive pinyin table data
const pinyinTableData = {
    headers: ['韵母/声母', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'],
    
    categories: [
        {
            name: '单韵母',
            class: 'simple-vowel',
            rows: [
                {
                    yunmu: 'a',
                    syllables: ['ba', 'pa', 'ma', 'fa', 'da', 'ta', 'na', 'la', 'ga', 'ka', 'ha', '', '', '', 'zha', 'cha', 'sha', '', 'za', 'ca', 'sa', 'ya', 'wa']
                },
                {
                    yunmu: 'o',
                    syllables: ['bo', 'po', 'mo', 'fo', '', '', '', 'lo', '', '', '', '', '', '', '', '', '', '', '', '', '', 'yo', 'wo']
                },
                {
                    yunmu: 'e',
                    syllables: ['', '', 'me', '', 'de', 'te', 'ne', 'le', 'ge', 'ke', 'he', '', '', '', 'zhe', 'che', 'she', 're', 'ze', 'ce', 'se', 'ye', '']
                },
                {
                    yunmu: 'i',
                    syllables: ['bi', 'pi', 'mi', '', 'di', 'ti', 'ni', 'li', '', '', '', 'ji', 'qi', 'xi', 'zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si', 'yi', '']
                },
                {
                    yunmu: 'u',
                    syllables: ['bu', 'pu', 'mu', 'fu', 'du', 'tu', 'nu', 'lu', 'gu', 'ku', 'hu', '', '', '', 'zhu', 'chu', 'shu', 'ru', 'zu', 'cu', 'su', '', 'wu']
                },
                {
                    yunmu: 'ü',
                    syllables: ['', '', '', '', '', '', 'nü', 'lü', '', '', '', 'ju', 'qu', 'xu', '', '', '', '', '', '', '', 'yu', '']
                }
            ]
        },
        {
            name: '复韵母',
            class: 'compound-vowel',
            rows: [
                {
                    yunmu: 'ai',
                    syllables: ['bai', 'pai', 'mai', '', 'dai', 'tai', 'nai', 'lai', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'wai']
                },
                {
                    yunmu: 'ei',
                    syllables: ['bei', 'pei', 'mei', 'fei', 'dei', '', 'nei', 'lei', 'gei', 'kei', 'hei', '', '', '', 'zhei', '', 'shei', '', 'zei', '', '', '', 'wei']
                },
                {
                    yunmu: 'ui',
                    syllables: ['', '', '', '', 'dui', 'tui', '', '', 'gui', 'kui', 'hui', '', '', '', 'zhui', 'chui', 'shui', 'rui', 'zui', 'cui', 'sui', '', '']
                },
                {
                    yunmu: 'ao',
                    syllables: ['bao', 'pao', 'mao', '', 'dao', 'tao', 'nao', 'lao', 'gao', 'kao', 'hao', '', '', '', 'zhao', 'chao', 'shao', 'rao', 'zao', 'cao', 'sao', 'yao', '']
                },
                {
                    yunmu: 'ou',
                    syllables: ['', 'pou', 'mou', 'fou', 'dou', 'tou', 'nou', 'lou', 'gou', 'kou', 'hou', '', '', '', 'zhou', 'chou', 'shou', 'rou', 'zou', 'cou', 'sou', 'you', '']
                },
                {
                    yunmu: 'iu',
                    syllables: ['', '', 'miu', '', 'diu', '', 'niu', 'liu', '', '', '', 'jiu', 'qiu', 'xiu', '', '', '', '', '', '', '', '', '']
                },
                {
                    yunmu: 'ie',
                    syllables: ['bie', 'pie', 'mie', '', 'die', 'tie', 'nie', 'lie', '', '', '', 'jie', 'qie', 'xie', '', '', '', '', '', '', '', 'ye', '']
                },
                {
                    yunmu: 'üe',
                    syllables: ['', '', '', '', '', '', 'nüe', 'lüe', '', '', '', 'jue', 'que', 'xue', '', '', '', '', '', '', '', 'yue', '']
                },
                {
                    yunmu: 'er',
                    syllables: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
                }
            ]
        },
        {
            name: '前鼻韵母',
            class: 'front-nasal',
            rows: [
                {
                    yunmu: 'an',
                    syllables: ['ban', 'pan', 'man', 'fan', 'dan', 'tan', 'nan', 'lan', 'gan', 'kan', 'han', '', '', '', 'zhan', 'chan', 'shan', 'ran', 'zan', 'can', 'san', 'yan', 'wan']
                },
                {
                    yunmu: 'en',
                    syllables: ['ben', 'pen', 'men', 'fen', 'den', '', 'nen', '', 'gen', 'ken', 'hen', '', '', '', 'zhen', 'chen', 'shen', 'ren', 'zen', 'cen', 'sen', '', 'wen']
                },
                {
                    yunmu: 'in',
                    syllables: ['bin', 'pin', 'min', '', '', '', 'nin', 'lin', '', '', '', 'jin', 'qin', 'xin', '', '', '', '', '', '', '', 'yin', '']
                },
                {
                    yunmu: 'un',
                    syllables: ['', '', '', '', 'dun', 'tun', '', 'lun', 'gun', 'kun', 'hun', '', '', '', 'zhun', 'chun', 'shun', 'run', 'zun', 'cun', 'sun', '', '']
                },
                {
                    yunmu: 'ün',
                    syllables: ['', '', '', '', '', '', '', '', '', '', '', 'jun', 'qun', 'xun', '', '', '', '', '', '', '', 'yun', '']
                }
            ]
        },
        {
            name: '后鼻韵母',
            class: 'back-nasal',
            rows: [
                {
                    yunmu: 'ang',
                    syllables: ['bang', 'pang', 'mang', 'fang', 'dang', 'tang', 'nang', 'lang', 'gang', 'kang', 'hang', '', '', '', 'zhang', 'chang', 'shang', 'rang', 'zang', 'cang', 'sang', 'yang', 'wang']
                },
                {
                    yunmu: 'eng',
                    syllables: ['beng', 'peng', 'meng', 'feng', 'deng', 'teng', 'neng', 'leng', 'geng', 'keng', 'heng', '', '', '', 'zheng', 'cheng', 'sheng', 'reng', 'zeng', 'ceng', 'seng', '', 'weng']
                },
                {
                    yunmu: 'ing',
                    syllables: ['bing', 'ping', 'ming', '', 'ding', 'ting', 'ning', 'ling', '', '', '', 'jing', 'qing', 'xing', '', '', '', '', '', '', '', 'ying', '']
                },
                {
                    yunmu: 'ong',
                    syllables: ['', '', '', '', 'dong', 'tong', 'nong', 'long', 'gong', 'kong', 'hong', 'jiong', 'qiong', 'xiong', 'zhong', 'chong', '', 'rong', 'zong', 'cong', 'song', 'yong', '']
                }
            ]
        },
        {
            name: '三拼音节韵母',
            class: 'triple-spell',
            rows: [
                {
                    yunmu: 'i-a',
                    syllables: ['', '', '', '', 'dia', '', '', 'lia', '', '', '', 'jia', 'qia', 'xia', '', '', '', '', '', '', '', '', '']
                },
                {
                    yunmu: 'i-an',
                    syllables: ['bian', 'pian', 'mian', '', 'dian', 'tian', 'nian', 'lian', '', '', '', 'jian', 'qian', 'xian', '', '', '', '', '', '', '', '', '']
                },
                {
                    yunmu: 'i-ang',
                    syllables: ['', '', '', '', '', '', 'niang', 'liang', '', '', '', 'jiang', 'qiang', 'xiang', '', '', '', '', '', '', '', '', '']
                },
                {
                    yunmu: 'i-ao',
                    syllables: ['biao', 'piao', 'miao', '', 'diao', 'tiao', 'niao', 'liao', '', '', '', 'jiao', 'qiao', 'xiao', '', '', '', '', '', '', '', '', '']
                },
                {
                    yunmu: 'i-ong',
                    syllables: ['', '', '', '', '', '', '', '', '', '', '', 'jiong', 'qiong', 'xiong', '', '', '', '', '', '', '', '', '']
                },
                {
                    yunmu: 'u-a',
                    syllables: ['', '', '', '', '', '', '', '', 'gua', 'kua', 'hua', '', '', '', 'zhua', 'chua', 'shua', 'rua', '', '', '', '', '']
                },
                {
                    yunmu: 'u-ai',
                    syllables: ['', '', '', '', '', '', '', '', 'guai', 'kuai', 'huai', '', '', '', 'zhuai', 'chuai', 'shuai', '', '', '', '', '', '']
                },
                {
                    yunmu: 'u-an',
                    syllables: ['', '', '', '', 'duan', 'tuan', 'nuan', 'luan', 'guan', 'kuan', 'huan', '', '', '', 'zhuan', 'chuan', 'shuan', 'ruan', 'zuan', 'cuan', 'suan', '', '']
                },
                {
                    yunmu: 'u-ang',
                    syllables: ['', '', '', '', '', '', '', '', 'guang', 'kuang', 'huang', '', '', '', 'zhuang', 'chuang', 'shuang', '', '', '', '', '', '']
                },
                {
                    yunmu: 'u-o',
                    syllables: ['', '', '', '', 'duo', 'tuo', 'nuo', 'luo', 'guo', 'kuo', 'huo', '', '', '', 'zhuo', 'chuo', 'shuo', 'ruo', 'zuo', 'cuo', 'suo', '', '']
                },
                {
                    yunmu: 'ü-an',
                    syllables: ['', '', '', '', '', '', '', '', '', '', '', 'juan', 'quan', 'xuan', '', '', '', '', '', '', '', 'yuan', '']
                }
            ]
        }
    ]
};

// Table generation function
function generatePinyinTable() {
    const container = document.getElementById('pinyin-table-container');
    
    let tableHTML = `
        <div class="pinyin-table-container">
            <table class="pinyin-table">
                <thead>
                    <tr>
    `;
    
    // Generate headers
    pinyinTableData.headers.forEach((header, index) => {
        if (index === 0) {
            tableHTML += `<th class="yunmu-header">${header}</th>`;
        } else {
            tableHTML += `<th>${header}</th>`;
        }
    });
    
    tableHTML += `
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Generate category rows
    pinyinTableData.categories.forEach(category => {
        // Category header row
        tableHTML += `
                    <tr class="${category.class}">
                        <td colspan="24" class="text-center fw-bold py-2">${category.name}</td>
                    </tr>
        `;
        
        // Category data rows
        category.rows.forEach(row => {
            tableHTML += `<tr class="${category.class}">`;
            tableHTML += `<td class="yunmu-header">${row.yunmu}</td>`;
            
            row.syllables.forEach(syllable => {
                if (syllable) {
                    tableHTML += `<td><span class="syllable" data-pinyin="${syllable}">${syllable}</span></td>`;
                } else {
                    tableHTML += `<td class="empty-cell"></td>`;
                }
            });
            
            tableHTML += `</tr>`;
        });
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
    
    // Add click event listeners
    addSyllableClickListeners();
}

// Add click event listeners to syllables
function addSyllableClickListeners() {
    const syllables = document.querySelectorAll('.syllable[data-pinyin]');
    
    syllables.forEach(syllable => {
        syllable.addEventListener('click', function() {
            const pinyin = this.getAttribute('data-pinyin');
            playPinyinPronunciation(pinyin, this);
        });
    });
}

// Play pinyin pronunciation
function playPinyinPronunciation(pinyin, element) {
    console.log('Playing pronunciation for:', pinyin);
    
    // Add visual feedback
    element.classList.add('speaking');
    
    // Use the existing TTS functionality
    if (window.ChineseDictionary && window.ChineseDictionary.playPinyinWithFallback) {
        window.ChineseDictionary.playPinyinWithFallback(pinyin)
            .finally(() => {
                setTimeout(() => {
                    element.classList.remove('speaking');
                }, 500);
            });
    } else {
        // Fallback to basic Web Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(pinyin);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.7;
            
            utterance.onend = () => {
                setTimeout(() => {
                    element.classList.remove('speaking');
                }, 100);
            };
            
            utterance.onerror = () => {
                console.warn('Speech synthesis failed');
                element.classList.remove('speaking');
            };
            
            speechSynthesis.speak(utterance);
        } else {
            console.warn('Speech synthesis not supported');
            element.classList.remove('speaking');
        }
    }
}

// Tone selection functionality
function initializeToneSelector() {
    const toneRadios = document.querySelectorAll('input[name="tone"]');
    
    toneRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedTone = this.value;
            console.log('Selected tone:', selectedTone);
            // TODO: Implement tone filtering if needed
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Pinyin Table...');
    generatePinyinTable();
    initializeToneSelector();
    console.log('Pinyin Table initialized successfully');
});