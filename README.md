# Claude Skill Designer

A web-based application for creating document design skills for Claude products. Generate brand guidelines that produce ready-to-use Claude skills for Word, Google Docs, PowerPoint, and Google Slides.

## Live Demo

[**Open Claude Skill Designer**](https://hillis.github.io/ClaudeSkillDesigner)

## What It Does

Claude Skill Designer helps you define your brand's visual identity and automatically generates Claude skills that enforce consistent styling across all your documents and presentations. Instead of manually describing your brand guidelines every time, create a skill once and reuse it across Claude Projects, Claude Cowork, or Claude Code.

### Generated Skills Include:
- Color palette with usage guidelines
- Typography specifications (fonts, sizes, weights)
- Logo placement instructions
- Header/footer formatting
- Watermark settings
- Layout and margin specifications
- Step-by-step application instructions

## Features

### Brand Profile Management
- Create multiple brand profiles for different projects or clients
- Auto-save to browser localStorage
- Export/import profiles as JSON files
- Duplicate and rename profiles

### Design Controls

| Feature | Description |
|---------|-------------|
| **Colors** | Primary, Secondary, Accent, Text, and Background colors with visual picker and hex input |
| **Typography** | Google Fonts integration, separate heading/body fonts, sizes for H1-H3, weight controls, line height, letter spacing |
| **Logo** | PNG/JPG upload, position options (left/center/right), size controls |
| **Header/Footer** | Company name, tagline, contact info, footer text with page number placeholders |
| **Watermark** | Text or image, opacity slider, position (center/diagonal/corner) |
| **Layout** | Configurable margins, paragraph spacing presets |

### Preset Templates

Get started quickly with four professionally designed presets:

- **Corporate** - Professional blues, serif headings, clean layout
- **Creative** - Bold colors, modern fonts, dynamic spacing
- **Minimal** - Monochrome, simple typography, generous whitespace
- **Academic** - Traditional fonts, formal structure, citation-friendly

### Word Template Import

Upload an existing `.docx` file to automatically extract:
- Color schemes
- Font families
- Font sizes
- Styling patterns

### Live Preview

Real-time preview showing your brand applied to:
- Document view (reports, letters, memos)
- Presentation view (slides with title and content layouts)

### Skill Generation

Generate Claude skills for four document types:
- Microsoft Word
- Google Docs
- PowerPoint
- Google Slides

Each skill includes detailed formatting instructions tailored to the specific platform.

## How to Use

### 1. Create a Brand Profile

1. Open the app and complete the onboarding wizard, or
2. Click the **+** button in the header to create a new profile
3. Name your profile (e.g., "Acme Corp Brand")

### 2. Configure Your Brand

**Colors Tab:**
- Click any color swatch to open the color picker
- Enter hex codes directly for precise values
- Use the preset buttons to apply a complete color scheme

**Typography:**
- Select heading and body fonts from the Google Fonts dropdown
- Adjust font weights, sizes, and spacing
- Preview changes in real-time

**Logo:**
- Upload your logo (PNG or JPG, max 2MB)
- Choose position and size

**Additional Settings:**
- Add header/footer text
- Configure watermark if needed
- Adjust margins and spacing

### 3. Preview Your Design

- Switch to the **Preview** tab to see a full-size preview
- Toggle between document and presentation views
- The sidebar also shows a live mini-preview

### 4. Generate Your Skill

1. Go to the **Generate Skill** tab
2. Select your target document type (Word, Google Docs, PowerPoint, or Google Slides)
3. Click **Copy to Clipboard** or **Download .md**

### 5. Use Your Skill

**In Claude Projects:**
1. Open your Claude Project
2. Go to Project Instructions
3. Paste the skill content
4. Save and start creating documents

**In Claude Cowork:**
1. Create a new skill file in your workspace
2. Paste the markdown content
3. Reference the skill in your conversations

**In Claude Code:**
1. Save as a `.md` file in your project
2. Reference in `CLAUDE.md` or include directly in prompts

## Local Development

No build step required. Simply:

```bash
# Clone the repository
git clone https://github.com/hillis/ClaudeSkillDesigner.git

# Open in browser
open ClaudeSkillDesigner/index.html
```

Or serve with any static file server:

```bash
cd ClaudeSkillDesigner
python -m http.server 8000
# Open http://localhost:8000
```

## Technology Stack

- **Vanilla JavaScript** (ES6+) - No framework dependencies
- **Tailwind CSS** (CDN) - Utility-first styling
- **Pickr** - Color picker component
- **Mammoth.js** - Word document parsing
- **Google Fonts API** - Typography options
- **localStorage** - Profile persistence

## Browser Support

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## File Structure

```
ClaudeSkillDesigner/
├── index.html          # Main application
├── css/
│   └── styles.css      # Custom styles
├── js/
│   ├── app.js          # Main controller
│   ├── storage.js      # localStorage management
│   ├── presets.js      # Preset templates
│   ├── onboarding.js   # First-time wizard
│   ├── colorPicker.js  # Color picker integration
│   ├── typography.js   # Font controls
│   ├── templateParser.js # Word doc parsing
│   ├── skillGenerator.js # Markdown generation
│   └── preview.js      # Live preview
└── assets/
    └── presets/        # (Reserved for future use)
```

## License

MIT License - Feel free to use, modify, and distribute.

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

Built for use with [Claude](https://claude.ai) by Anthropic.
