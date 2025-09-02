# 汉语字典查询系统 (Chinese Dictionary Web Application)

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0%2B-green.svg)](https://flask.palletsprojects.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.1-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

一个功能完整的汉语字典Web应用，基于20,880个汉字的综合数据库，提供多维度查询、拼音音节表、语音播放等功能。

## ✨ 核心特性

### 🔍 多维度查询系统
- **汉字查询**: 直接输入汉字进行查找
- **拼音查询**: 支持带声调和无声调拼音（如：zhōng 或 zhong）
- **五笔查询**: 支持五笔86码和98码
- **部首查询**: 按汉字部首分类查找
- **笔画查询**: 按总笔画数精确查找
- **Unicode查询**: 支持Unicode编码查询
- **全文搜索**: 跨所有字段的综合搜索

### 📊 拼音音节表
- **完整音节表**: 包含所有汉语拼音音节组合
- **分类显示**: 单韵母、复韵母、前鼻韵母、后鼻韵母、三拼音节
- **颜色编码**: 不同类型韵母用不同颜色区分
- **语音播放**: 点击任意音节即可听取标准发音
- **声调选择**: 支持选择特定声调进行学习

### 🔊 智能语音功能
- **多重TTS支持**: Web Speech API + Google TTS双重保障
- **中文语音优化**: 智能选择最佳中文语音引擎
- **跨浏览器兼容**: 支持Chrome、Firefox、Safari等主流浏览器
- **失败静默处理**: TTS失败时不打扰用户体验

### 💡 用户友好设计
- **响应式布局**: 完美适配桌面、平板、手机设备
- **双视图模式**: 网格视图（紧凑）+ 列表视图（详细）
- **可点击标签**: 部首、笔画、五笔码标签支持快速关联查询
- **键盘快捷键**: Ctrl+K快速聚焦搜索框
- **分页导航**: 每页50条记录，支持快速翻页

## 🏗️ 技术架构

### 后端技术栈
- **Python 3.8+**: 主要开发语言
- **Flask 2.0+**: 轻量级Web框架
- **SQLite**: 嵌入式数据库，包含19,636条汉字记录
- **Jinja2**: 模板引擎

### 前端技术栈
- **Bootstrap 5.1**: 响应式UI框架
- **Font Awesome 6.0**: 图标库
- **Vanilla JavaScript**: 原生JS，无重型依赖
- **CSS Grid**: 现代布局技术

### 核心功能模块
```
├── 搜索引擎模块 (search_characters)
│   ├── 多字段查询逻辑
│   ├── 分页处理
│   └── 结果排序
├── 拼音音节表模块 (pinyin_table)
│   ├── 动态表格生成
│   ├── 音节分类展示
│   └── 交互式语音播放
├── TTS语音模块 (ChineseDictionary)
│   ├── Web Speech API集成
│   ├── Google TTS备用方案
│   └── 中文语音引擎优选
└── 响应式界面模块
    ├── 双视图切换
    ├── 移动端适配
    └── 键盘快捷键
```

## 🚀 快速启动

### 环境要求
- Python 3.8 或更高版本
- 现代Web浏览器（Chrome推荐，获得最佳TTS体验）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/Sogrey/Chinese-dictionary.git
   cd Chinese-dictionary
   ```

2. **安装依赖**
   ```bash
   pip install flask
   ```

3. **启动应用**
   ```bash
   python app.py
   ```

4. **访问应用**
   ```
   打开浏览器访问: http://localhost:5000
   ```

### Docker部署（可选）

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 📊 数据库详情

### 数据统计
- **总字符数**: 20,880个汉字（数据库中包含19,636个有效记录）
- **数据字段**: 27个详细属性
- **图片资源**: ~56,000张支持图片
- **数据来源**: 康熙字典、新华字典、说文解字等权威资料

### 主要字段
| 字段名 | 描述 | 示例 |
|--------|------|------|
| zi | 汉字 | 中 |
| pinyin | 拼音（带声调） | zhōng |
| pinyin_toneless | 拼音（无声调） | zhong |
| bushou | 部首 | 丨 |
| zbh | 总笔画数 | 4 |
| wb86 | 五笔86码 | KHK |
| unicode | Unicode编码 | U+4E2D |
| jbjs | 基本解释 | 和四方、内外或两端距离同等的地位... |

### 图片资源分类
- **KangXi/**: 康熙字典传统参考图片
- **ShuFa/**: 书法示例图片
- **Zi/**: 标准字形图片  
- **Zy/**: 字源演变图片

## 🎯 使用指南

### 基础查询
1. **简单搜索**: 在首页搜索框输入汉字、拼音或五笔码
2. **精确查询**: 选择具体查询类型（汉字/拼音/五笔/部首等）
3. **查看详情**: 点击搜索结果中的汉字查看详细信息

### 拼音学习
1. **访问音节表**: 点击导航栏"拼音音节表"
2. **选择声调**: 使用顶部按钮选择要学习的声调
3. **听取发音**: 点击任意拼音音节听取标准发音
4. **分类学习**: 根据颜色区分不同类型的韵母

### 高级功能
- **关联查询**: 点击结果页面的部首、笔画、五笔标签进行关联查询
- **视图切换**: 使用网格/列表按钮切换显示模式
- **键盘导航**: Ctrl+K聚焦搜索，Alt+方向键翻页

## 🔧 开发指南

### 项目结构
```
字典20880条数据/
├── app.py                     # Flask主应用
├── 字典20880条数据.db           # SQLite数据库
├── templates/                 # Jinja2模板
│   ├── base.html             # 基础模板
│   ├── index.html            # 首页
│   ├── search.html           # 搜索结果页
│   ├── character.html        # 字符详情页
│   └── pinyin_table.html     # 拼音音节表
├── static/                   # 静态资源
│   ├── css/
│   │   ├── style.css         # 主样式表
│   │   └── pinyin_table.css  # 拼音表样式
│   └── js/
│       ├── app.js            # 主要JavaScript功能
│       └── pinyin_table.js   # 拼音表交互逻辑
├── Upload/                   # 图片资源目录
└── docs/                     # 文档目录
```

### 关键API端点
- `GET /` - 首页
- `GET /search` - 搜索页面和API
- `GET /character/<int:id>` - 字符详情页
- `GET /pinyin-table` - 拼音音节表
- `GET /api/search` - 搜索API
- `GET /api/character/<int:id>` - 字符详情API

### 自定义开发

1. **添加新搜索类型**:
   ```python
   # 在 search_characters() 函数中添加新的搜索逻辑
   elif search_type == 'your_new_type':
       sql = "SELECT * FROM httpcn_zi WHERE your_field LIKE ?"
   ```

2. **扩展TTS功能**:
   ```javascript
   // 在 app.js 中的 ChineseDictionary 对象中添加新方法
   window.ChineseDictionary.yourNewMethod = function() {
       // 您的自定义TTS逻辑
   };
   ```

3. **自定义样式**:
   ```css
   /* 在 style.css 中添加自定义样式 */
   .your-custom-class {
       /* 您的样式规则 */
   }
   ```

## 🐛 故障排除

### 常见问题

**Q: TTS语音播放没有声音？**
A: 
1. 检查浏览器音量设置
2. 确保系统音量未静音
3. 推荐使用Chrome浏览器获得最佳TTS支持
4. 检查浏览器是否允许自动播放音频

**Q: 搜索结果为空？**
A:
1. 检查输入是否正确
2. 尝试使用不同的查询类型
3. 使用更简短的关键词
4. 检查数据库文件是否完整

**Q: 页面样式显示异常？**
A:
1. 清除浏览器缓存
2. 检查网络连接（CDN资源加载）
3. 确保静态文件路径正确

### 性能优化建议

1. **数据库优化**:
   ```sql
   -- 为常用查询字段添加索引
   CREATE INDEX idx_pinyin ON httpcn_zi(pinyin);
   CREATE INDEX idx_bushou ON httpcn_zi(bushou);
   ```

2. **缓存策略**:
   ```python
   from flask_caching import Cache
   app.config['CACHE_TYPE'] = 'simple'
   cache = Cache(app)
   ```

3. **静态资源优化**:
   - 启用Gzip压缩
   - 使用CDN加速
   - 图片懒加载

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. **Fork项目** 到您的GitHub账户
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建Pull Request**

### 代码规范
- Python代码遵循PEP 8规范
- JavaScript使用ES6+语法
- CSS使用BEM命名约定
- 提交信息使用英文，格式清晰

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 康熙字典、新华字典、说文解字等传统字典资料
- Bootstrap和Font Awesome开源项目
- Flask Web框架社区
- 所有贡献者和用户的支持

## 📞 联系方式

- **项目Issues**: [GitHub Issues](https://github.com/Sogrey/Chinese-dictionary/issues)
- **功能建议**: [GitHub Discussions](https://github.com/Sogrey/Chinese-dictionary/discussions)

---

**用 ❤️ 为中文语言教育制作** | [GitHub](https://github.com/Sogrey/Chinese-dictionary) | [Issues](https://github.com/Sogrey/Chinese-dictionary/issues)

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**