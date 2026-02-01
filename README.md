# Claude Skill Designer

一款网页端品牌设计工具，帮你快速生成适用于 Claude 的文档格式化 Skill。支持 Word、Google Docs、PowerPoint、Google Slides 四种文档类型。

## 在线体验

[**打开 Claude Skill Designer**](https://frediwincode.github.io/Claude-Skill-Designer)

## 这个工具解决什么问题？

每次让 Claude 生成文档时，你都要重新描述品牌规范（颜色、字体、排版等），非常繁琐。

> 用这个工具，你只需配置一次品牌视觉，就能导出一份标准化的 Claude Skill 文件（`.md`），之后在 Claude Projects、Claude Cowork 或 Claude Code 中直接复用。

## 生成的 Skill 包含什么？

- 品牌色板及使用规范
- 字体规格（字族、字号、字重）
- Logo 放置规则
- 页眉 / 页脚格式
- 水印设置
- 页面布局与边距

## 功能一览

### 品牌档案管理
- 创建多个品牌档案（不同项目 / 客户）
- 自动保存到浏览器 localStorage
- 支持 JSON 格式导入 / 导出
- 档案复制与重命名

### 设计配置项

| 模块 | 说明 |
|------|------|
| **颜色** | 主色、辅色、强调色、文字色、背景色，支持取色器和 HEX 输入 |
| **字体** | 集成 Google Fonts，标题 / 正文字体分开设置，H1-H3 字号、字重、行高、字间距 |
| **Logo** | 上传 PNG/JPG（最大 2MB），可设置位置（左/中/右）和尺寸 |
| **页眉 / 页脚** | 公司名、Tagline、联系方式、页脚文字，支持页码占位符 |
| **水印** | 文字或图片水印，透明度滑块，位置选择（居中/对角线/角落） |
| **布局** | 可调边距、段落间距预设 |

### 预设模板

提供四套开箱即用的品牌模板：

- **Corporate** — 专业蓝色系，衬线标题，简洁排版
- **Creative** — 大胆配色，现代字体，动感间距
- **Minimal** — 黑白灰，极简字体，大量留白
- **Academic** — 传统字体，学术结构，适合引用格式

### Word 模板导入

上传现有 `.docx` 文件，自动提取：
- 配色方案
- 字体族
- 字号
- 样式规则

### 实时预览

实时查看品牌效果，支持两种视图：
- **文档视图**（报告、信函、备忘录）
- **演示文稿视图**（幻灯片标题页和内容页）

## 使用流程

### 第一步：创建品牌档案

1. 打开应用，按照引导向导完成初始设置；或
2. 点击页头的 **+** 按钮新建档案
3. 为档案命名（例如「Acme 品牌规范」）

### 第二步：配置品牌视觉

**颜色** — 点击色块打开取色器，或直接输入 HEX 值；也可使用预设配色方案一键应用。

**字体** — 从 Google Fonts 下拉选择标题和正文字体，调整字重、字号和间距，实时预览效果。

**Logo** — 上传 Logo 图片（PNG/JPG，≤ 2MB），选择位置和尺寸。

**其他** — 按需配置页眉页脚、水印、边距和间距。

### 第三步：预览效果

切换到 **Preview** 标签页查看完整预览，可在文档视图和演示文稿视图之间切换。侧边栏也有实时缩略预览。

### 第四步：生成 Skill

1. 进入 **Generate Skill** 标签页
2. 选择目标文档类型（Word / Google Docs / PowerPoint / Google Slides）
3. 点击 **Copy to Clipboard** 或 **Download .md**

### 第五步：使用生成的 Skill

**Claude Projects：**
1. 打开 Claude Project → Project Instructions
2. 粘贴 Skill 内容并保存

**Claude Cowork：**
1. 在工作区创建 Skill 文件
2. 粘贴 markdown 内容，在对话中引用

**Claude Code：**
1. 将 `.md` 文件保存到 `.claude/skills/` 目录
2. 在对话中即可被识别和使用

## 本地运行

无需构建步骤，直接打开即可：

```bash
# 克隆仓库
git clone https://github.com/Frediwincode/Claude-Skill-Designer.git

# 用浏览器打开
open Claude-Skill-Designer/index.html
```

或者启动本地服务器：

```bash
cd Claude-Skill-Designer
python -m http.server 8000
# 访问 http://localhost:8000
```

## 技术栈

- **Vanilla JavaScript**（ES6+）— 无框架依赖
- **Tailwind CSS**（CDN）— 原子化样式
- **Pickr** — 取色器组件
- **Mammoth.js** — Word 文档解析
- **Google Fonts API** — 字体选项
- **localStorage** — 档案持久化

## 浏览器支持

支持所有现代浏览器：
- Chrome / Edge（推荐）
- Firefox
- Safari

## 项目结构

```
Claude-Skill-Designer/
├── index.html            # 主应用
├── css/
│   └── styles.css        # 自定义样式
├── js/
│   ├── app.js            # 主控制器
│   ├── storage.js        # localStorage 管理
│   ├── presets.js         # 预设模板
│   ├── onboarding.js     # 首次使用向导
│   ├── colorPicker.js    # 取色器集成
│   ├── typography.js     # 字体控制
│   ├── templateParser.js # Word 文档解析
│   ├── skillGenerator.js # Markdown 生成
│   └── preview.js        # 实时预览
└── assets/
    └── presets/           # 预留
```

## 许可证

MIT License

## 贡献

欢迎提 Issue 或 Pull Request。

---

为 [Claude](https://claude.ai) by Anthropic 而构建。
