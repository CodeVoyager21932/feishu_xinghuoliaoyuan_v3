# 现代扁平风格 AI 图片生成提示词

## 🎨 设计理念

**风格定位**：现代扁平化 + 极简主义 + 红色主题
**参考**：iOS 图标、Material Design、Notion 图标
**避免**：过度渲染、3D效果、复杂渐变、阴影

---

## 核心图片

### 1. xinghuo-avatar.png - AI头像

#### 超简洁版（推荐）
```
flat design icon, simple red star shape, minimal style, solid color #D32F2F, clean lines, no gradient, no shadow, white background, geometric, modern app icon style, 2D flat illustration --ar 1:1 --style raw --s 50 --v 6
```

#### 稍有细节版
```
minimalist red star icon, flat design, single solid color #D32F2F, subtle golden accent on edges, clean geometric shape, modern iOS app icon style, simple and elegant, white or transparent background --ar 1:1 --style raw --s 50 --v 6
```

---

### 2. empty-state.png - 空状态

```
simple empty box icon, minimal line art, thin stroke 2px, light gray #BDBDBD, geometric shape, flat design, no shading, clean and modern, empty state illustration, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 3. default-avatar.png - 默认头像

```
simple user icon, minimal person silhouette, flat design, solid red circle background #D32F2F, white figure, clean geometric shape, modern profile picture, no details --ar 1:1 --style raw --s 50 --v 6
```

---

## 功能图标（统一扁平风格）

### 4. ai_chat.png - 先辈回响

```
chat bubble icon, flat design, simple red outline #D32F2F, minimal style, thin line 3px, small star inside bubble, clean geometric shape, modern messaging icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 5. knowledge_graph.png - 星火燎原

```
network nodes icon, flat design, simple connected dots and lines, red color #D32F2F, minimal style, geometric pattern, clean and modern, constellation style, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 6. flashcards.png - 拾光碎片

```
stacked cards icon, flat design, simple overlapping rectangles, red outline #D32F2F, minimal style, clean geometric shapes, modern study icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 7. hero_gallery.png - 民族脊梁

```
medal icon, flat design, simple star with ribbon, red and gold colors #D32F2F #FFD700, minimal style, clean geometric shape, modern award icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 8. mystery_box.png - 尘封档案

```
treasure box icon, flat design, simple box shape, red color #D32F2F, minimal style, clean lines, slightly open lid, modern archive icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 9. museum.png - 初心印记

```
picture frame icon, flat design, simple square frame, red outline #D32F2F, star inside, minimal style, clean geometric shape, modern gallery icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 10. pk_battle.png - 上下求索

```
question mark icon, flat design, simple bold shape, red color #D32F2F, minimal style, clean geometric form, modern quiz icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 11. radio.png - 永不消逝

```
radio icon, flat design, simple vintage radio shape, red color #D32F2F, minimal style, clean lines, antenna with waves, modern retro icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 12. biography.png - 传记

```
book icon, flat design, simple open book shape, red outline #D32F2F, minimal style, clean geometric form, modern reading icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 13. medal.png - 勋章

```
medal icon, flat design, simple circular medal with star, red and gold #D32F2F #FFD700, minimal style, clean shape, modern award icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

### 14. quote.png - 名言

```
quotation marks icon, flat design, simple bold quotes, red color #D32F2F, minimal style, clean typography, modern text icon, white background --ar 1:1 --style raw --s 50 --v 6
```

---

## 🎯 关键参数说明

### 必须包含的关键词
- `flat design` - 扁平化设计
- `minimal style` - 极简风格
- `simple` - 简单
- `clean` - 干净
- `geometric` - 几何化
- `no shadow` - 无阴影
- `no gradient` - 无渐变（或只用简单渐变）

### Midjourney 参数
- `--style raw` - 原始风格，减少AI过度渲染
- `--s 50` - 风格化程度50（越低越简洁）
- `--v 6` - 版本6
- `--ar 1:1` - 方形比例

### 避免的关键词
- ❌ `3D`
- ❌ `realistic`
- ❌ `detailed`
- ❌ `complex`
- ❌ `shadow`
- ❌ `depth`
- ❌ `glossy`

---

## 💡 如果还是太复杂

### 终极简化版模板
```
[图标名称] icon, flat design, red #D32F2F, minimal, simple shape, clean lines, white background --ar 1:1 --style raw --s 25 --v 6
```

### 示例
```
star icon, flat design, red #D32F2F, minimal, simple shape, clean lines, white background --ar 1:1 --style raw --s 25 --v 6

chat icon, flat design, red #D32F2F, minimal, simple shape, clean lines, white background --ar 1:1 --style raw --s 25 --v 6

book icon, flat design, red #D32F2F, minimal, simple shape, clean lines, white background --ar 1:1 --style raw --s 25 --v 6
```

---

## 🎨 参考风格

### 推荐参考的图标库
1. **Feather Icons** - 超简洁线性图标
2. **Heroicons** - Tailwind 官方图标
3. **Lucide** - 现代扁平图标
4. **Phosphor Icons** - 灵活的图标系统

### 在提示词中引用
```
feather icons style, minimal line icon, flat design, red #D32F2F --ar 1:1 --style raw --s 50 --v 6
```

---

## 🔧 调试技巧

### 如果生成的图标还是太复杂

1. **降低风格化参数**
   ```
   --s 25  # 甚至 --s 0
   ```

2. **强调扁平化**
   ```
   , absolutely flat, no depth, 2D only, no 3D effects
   ```

3. **使用负面提示词**（Stable Diffusion）
   ```
   Negative prompt: 3D, shadow, gradient, realistic, detailed, complex, glossy, shiny
   ```

4. **参考具体图标**
   ```
   like iOS system icons, like Material Design icons
   ```

---

## 📱 iOS 风格版本（超简洁）

如果你想要类似 iOS 系统图标的风格：

```
iOS style icon, SF Symbols design, simple [图标名称], monochrome red #D32F2F, ultra minimal, clean lines, 2px stroke, flat design, white background --ar 1:1 --style raw --s 25 --v 6
```

### 示例
```
iOS style icon, SF Symbols design, simple star, monochrome red #D32F2F, ultra minimal, clean lines, 2px stroke, flat design, white background --ar 1:1 --style raw --s 25 --v 6
```

---

## 🎯 Material Design 风格版本

如果你想要 Google Material Design 风格：

```
Material Design icon, simple [图标名称], filled style, red #D32F2F, minimal geometric shape, clean and modern, flat design, white background --ar 1:1 --style raw --s 50 --v 6
```

---

希望这次的提示词能生成你满意的简洁图标！🎨
