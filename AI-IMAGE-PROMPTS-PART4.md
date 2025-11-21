# AI 图片生成提示词 - 第四部分（辅助图标）

## 🎨 辅助功能图标

---

### 12. biography.png - 传记

#### 中文提示词
```
一个简洁优雅的传记图标，象征着历史人物的生平记录。画面中心是一本打开的书，采用略微倾斜的透视角度（约15度）。书页微微翻起，左右两页对称展开。左页有几条横向的文字线条，右页有一个简化的人物剪影或五角星图案。书本使用深红色（#D32F2F）线条勾勒，线宽3-4px。在书本的上方，有一支羽毛笔或钢笔斜插，笔尖指向书页，象征着记录和书写。书本周围有2-3个小的星星或光点，暗示历史的闪光时刻。整体风格线性简约，构图平衡，背景透明。传递出历史记录、人物传记、文献资料的文化感和厚重感。
```

#### 英文提示词
```
A clean and elegant biography icon symbolizing historical figure life records. Center features an open book with slightly tilted perspective (about 15 degrees). Book pages gently curl, left and right pages symmetrically spread. Left page has several horizontal text lines, right page has simplified human silhouette or five-pointed star pattern. Book outlined in deep red (#D32F2F), 3-4px stroke width. Above book, a quill pen or fountain pen diagonally inserted, nib pointing to pages, symbolizing recording and writing. 2-3 small stars or light dots around book, suggesting historical shining moments. Overall linear minimalist style, balanced composition, transparent background. Conveys cultural depth and gravitas of historical records, biographical writing, and documentary materials. Professional book icon design, vector quality, 4K resolution.

--ar 1:1 --style raw --v 6
```

---

### 13. medal.png - 勋章

#### 中文提示词
```
一个庄重而精致的勋章图标，象征着荣誉和成就。画面中心是一枚圆形勋章，外圈是精美的花纹边框，内圈有一个五角星图案。勋章上方连接着一条丝带，丝带呈倒V字形，两端自然下垂，有轻微的飘动感。勋章主体使用深红色（#D32F2F）和金色（#FFD700）的组合，勋章边框和星星为金色，丝带为红色。所有线条粗细3-4px，风格精致而不繁琐。在勋章周围，有几个小的光点或星星闪烁，增加荣耀感。整体构图对称，勋章占据画布中心偏上的位置，丝带自然下垂。背景透明，传递出荣誉、成就、奖励的庄重感和喜悦感。
```

#### 英文提示词
```
A solemn and exquisite medal icon symbolizing honor and achievement. Center features a circular medal, outer ring with ornate pattern border, inner circle with five-pointed star pattern. Ribbon connects above medal in inverted V-shape, ends naturally draping with slight flowing feel. Medal body uses combination of deep red (#D32F2F) and gold (#FFD700), medal border and star in gold, ribbon in red. All lines 3-4px stroke width, refined style without being cluttered. Several small light dots or stars sparkle around medal, enhancing glory feel. Overall symmetrical composition, medal positioned center-upper of canvas, ribbon naturally draping. Transparent background, conveying solemn dignity and joy of honor, achievement, and reward. Professional military medal icon design, vector quality, 4K resolution.

--ar 1:1 --style raw --v 6
```

---

### 14. quote.png - 名言

#### 中文提示词
```
一个富有文化气息的名言图标，传递经典语录的力量。画面中心是一对大的引号（""），左引号和右引号对称排列，中间留有空间。引号使用深红色（#D32F2F）填充，带有轻微的渐变效果，从深红到浅红。引号的笔画粗壮有力，传递出语言的分量。在引号的中间区域，有几条横向的文字线条，象征着名言的内容。引号的周围，有3-4个小的星星或光点环绕，呈圆弧形排列，暗示思想的光芒。整体风格简约现代，线条流畅。构图居中对称，引号占据画布的60-70%。背景透明，传递出经典、智慧、传承的文化感。
```

#### 英文提示词
```
A culturally-rich quote icon conveying the power of classic sayings. Center features a pair of large quotation marks (""), left and right quotes symmetrically arranged with space between. Quotes filled with deep red (#D32F2F) with subtle gradient effect from deep to light red. Quote strokes bold and powerful, conveying weight of words. In middle area between quotes, several horizontal text lines symbolizing quote content. 3-4 small stars or light dots orbit around quotes in arc formation, suggesting brilliance of thought. Overall minimalist modern style, flowing lines. Centered symmetrical composition, quotes occupying 60-70% of canvas. Transparent background, conveying cultural sense of classics, wisdom, and heritage. Professional typography icon design, vector quality, 4K resolution.

--ar 1:1 --style raw --v 6
```

---

## 📝 使用技巧

### Midjourney 参数说明
```
--ar 1:1        # 1:1 方形比例
--style raw     # 原始风格，减少过度渲染
--v 6           # 使用 Midjourney v6 版本
--s 50          # 风格化程度（可选，50-100 适合图标）
--q 2           # 高质量渲染（可选）
```

### DALL-E 3 使用建议
- 直接复制英文提示词
- 在末尾添加："high quality, professional icon design, 4K"
- 选择"Standard"质量即可
- 下载后使用 TinyPNG 压缩

### Stable Diffusion 使用建议
- 使用 ControlNet 保持风格一致
- 推荐模型：Realistic Vision, DreamShaper
- 负面提示词：blurry, low quality, distorted, messy
- CFG Scale: 7-9
- Steps: 30-50

### 国产 AI 使用建议
- **文心一格**：使用中文提示词，选择"图标设计"风格
- **通义万相**：使用中文提示词，选择"扁平插画"风格
- **Midjourney 中文版**：可以混用中英文

---

## 🎨 后期处理建议

### 1. 去除背景
如果 AI 生成的图片有背景：
- 使用 remove.bg (https://www.remove.bg)
- 或 Photoshop 的"选择主体"功能

### 2. 调整尺寸
```
推荐工具：
- Photoshop
- GIMP (免费)
- 在线工具：https://www.iloveimg.com/resize-image
```

### 3. 压缩优化
```
必须步骤：
1. 访问 TinyPNG (https://tinypng.com)
2. 上传所有图片
3. 下载压缩后的版本
4. 确保每个图标 < 50KB
```

### 4. 统一风格
如果生成的图标风格不一致：
- 在 Figma 中统一调整线条粗细
- 统一颜色（使用取色器）
- 统一圆角半径

---

## ✅ 质量检查清单

生成图片后，请检查：
- [ ] 背景是否透明
- [ ] 尺寸是否正确（256x256px 或更大）
- [ ] 颜色是否符合要求（#D32F2F 红色为主）
- [ ] 线条是否清晰（不模糊）
- [ ] 构图是否居中
- [ ] 文件大小是否合理（< 50KB）
- [ ] 风格是否与其他图标一致

---

## 💡 批量生成技巧

### 方法 1：使用 Midjourney 的 /imagine 批量
```
/imagine prompt: [提示词1] --ar 1:1 --v 6
/imagine prompt: [提示词2] --ar 1:1 --v 6
/imagine prompt: [提示词3] --ar 1:1 --v 6
```

### 方法 2：使用 DALL-E 的批量生成
- 在 ChatGPT Plus 中连续发送提示词
- 每次生成后立即下载

### 方法 3：使用 Stable Diffusion 的批量
- 使用 txt2img 的批量功能
- 将所有提示词放入文本文件
- 一次性生成所有图标

---

祝你生成出完美的图标！🎨
