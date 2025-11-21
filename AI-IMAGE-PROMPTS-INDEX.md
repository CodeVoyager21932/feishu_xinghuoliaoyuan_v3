# AI 图片生成提示词 - 总索引

## 📚 文档导航

本套提示词共包含 **14 个图片**的详细生成指令，分为 4 个文档：

---

## 📄 文档列表

### [第一部分](./AI-IMAGE-PROMPTS-PART1.md) - 核心图片（3个）
1. **xinghuo-avatar.png** - AI讲解员"星火同志"头像
2. **empty-state.png** - 空状态图标
3. **default-avatar.png** - 默认用户头像

### [第二部分](./AI-IMAGE-PROMPTS-PART2.md) - 功能图标 1-4
4. **ai_chat.png** - 先辈回响（AI讲解员）
5. **knowledge_graph.png** - 星火燎原（知识图谱）
6. **flashcards.png** - 拾光碎片（卡片学习）
7. **hero_gallery.png** - 民族脊梁（英雄长廊）

### [第三部分](./AI-IMAGE-PROMPTS-PART3.md) - 功能图标 5-8
8. **mystery_box.png** - 尘封档案（机密档案）
9. **museum.png** - 初心印记（珍藏馆）
10. **pk_battle.png** - 上下求索（知识竞答）
11. **radio.png** - 永不消逝（红色电台）

### [第四部分](./AI-IMAGE-PROMPTS-PART4.md) - 辅助图标
12. **biography.png** - 传记
13. **medal.png** - 勋章
14. **quote.png** - 名言

---

## 🎯 快速使用指南

### 步骤 1：选择 AI 工具
- **Midjourney**：最推荐，效果最好（需付费）
- **DALL-E 3**：ChatGPT Plus 内置，方便快捷
- **Stable Diffusion**：免费，需要本地部署
- **文心一格**：国产，中文友好
- **通义万相**：国产，免费使用

### 步骤 2：复制提示词
- 打开对应的文档部分
- 找到你需要的图片
- 复制**中文提示词**（国产AI）或**英文提示词**（国际AI）

### 步骤 3：生成图片
- 粘贴到 AI 工具中
- 点击生成
- 如果效果不满意，可以微调提示词重新生成

### 步骤 4：后期处理
1. 去除背景（如果有）
2. 调整到规定尺寸
3. 使用 TinyPNG 压缩
4. 重命名为正确的文件名

---

## 🎨 设计规范速查

### 核心图片
| 文件名 | 尺寸 | 格式 | 主色 |
|--------|------|------|------|
| xinghuo-avatar.png | 400x400px | PNG | #D32F2F + #FFD700 |
| empty-state.png | 400x400px | PNG | #BDBDBD |
| default-avatar.png | 200x200px | PNG | #D32F2F 渐变 |

### 功能图标（统一规范）
- **尺寸**：256x256px 或 512x512px
- **格式**：PNG（透明背景）
- **线条**：3-4px 粗细
- **主色**：#D32F2F（深红色）
- **辅色**：#FFD700（金色）
- **风格**：线性图标，现代简约

---

## 💡 提示词使用技巧

### Midjourney 专用参数
```
--ar 1:1        # 方形比例
--style raw     # 原始风格
--v 6           # 版本 6
--s 50          # 风格化程度 50
```

### 提示词模板结构
```
[主体描述] + [视角/构图] + [颜色方案] + [风格要求] + [技术参数]
```

### 如果效果不理想
1. **太复杂**：简化提示词，去掉部分细节描述
2. **颜色不对**：强调颜色代码，如 "must use #D32F2F red"
3. **风格不符**：添加参考，如 "like Google Material Design"
4. **背景不透明**：强调 "transparent background, no background"

---

## 📊 生成进度追踪

### 核心图片（优先级最高）
- [ ] xinghuo-avatar.png
- [ ] empty-state.png
- [ ] default-avatar.png

### 主要功能图标
- [ ] ai_chat.png
- [ ] knowledge_graph.png
- [ ] flashcards.png
- [ ] hero_gallery.png
- [ ] mystery_box.png
- [ ] museum.png
- [ ] pk_battle.png
- [ ] radio.png

### 辅助图标
- [ ] biography.png
- [ ] medal.png
- [ ] quote.png

---

## 🔧 推荐工具链

### AI 生成工具
1. **Midjourney** (https://midjourney.com) - 最佳质量
2. **DALL-E 3** (ChatGPT Plus) - 最方便
3. **文心一格** (https://yige.baidu.com) - 中文友好

### 后期处理工具
1. **Remove.bg** (https://remove.bg) - 去背景
2. **TinyPNG** (https://tinypng.com) - 压缩图片
3. **Photopea** (https://photopea.com) - 在线编辑

### 尺寸调整工具
1. **ILoveIMG** (https://iloveimg.com) - 批量调整
2. **Squoosh** (https://squoosh.app) - 高级压缩

---

## 🎯 质量标准

### 必须满足
- ✅ 背景透明
- ✅ 尺寸正确
- ✅ 颜色符合规范
- ✅ 线条清晰
- ✅ 文件大小 < 50KB（图标）

### 建议达到
- ⭐ 风格统一
- ⭐ 构图平衡
- ⭐ 细节精致
- ⭐ 易于识别

---

## 📞 常见问题

### Q: 生成的图标风格不一致怎么办？
**A**: 使用同一个 AI 工具，在同一个会话中连续生成，或使用 Midjourney 的 seed 参数保持一致性。

### Q: 颜色总是不对怎么办？
**A**: 在提示词中多次强调颜色代码，或生成后在 Photoshop/Figma 中统一调整。

### Q: 背景无法透明怎么办？
**A**: 使用 remove.bg 或 Photoshop 的"选择主体"功能手动去除背景。

### Q: 一次生成多少个比较好？
**A**: 建议每次生成 3-4 个，确保风格一致。可以分批生成：核心图片 → 主要图标 → 辅助图标。

### Q: 需要多长时间？
**A**: 
- 使用 Midjourney：约 2-3 小时（包括调整）
- 使用 DALL-E：约 3-4 小时
- 使用 Stable Diffusion：约 4-5 小时（需要调试）

---

## 🎉 完成后

生成所有图片后：
1. ✅ 统一压缩所有图片
2. ✅ 检查文件命名
3. ✅ 复制到 `miniprogram/images/` 对应目录
4. ✅ 在开发工具中测试
5. ✅ 真机预览效果

---

## 📝 反馈与改进

如果生成的图片需要调整：
- 记录哪些提示词效果好
- 记录哪些需要改进
- 可以混合使用多个 AI 的结果
- 必要时可以手动在 Figma 中微调

---

**祝你生成出完美的图标！** 🎨✨

如有问题，随时查阅对应部分的详细提示词。
