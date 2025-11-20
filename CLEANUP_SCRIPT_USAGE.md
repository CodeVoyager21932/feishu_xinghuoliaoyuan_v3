# 清理脚本使用说明

## 📋 脚本概述

提供了两个版本的清理脚本：
- `cleanup_script.py` - Python 版本（推荐，跨平台）
- `cleanup_script.ps1` - PowerShell 版本（Windows 专用）

两个脚本功能完全相同，可根据你的环境选择使用。

---

## 🎯 脚本功能

1. ✅ 创建带时间戳的垃圾箱目录 `_trash_bin_YYYYMMDD_HHMMSS`
2. ✅ 安全移动待删除文件到垃圾箱（保持目录结构）
3. ✅ 删除空目录
4. ✅ 统计移动的文件数量和释放的空间
5. ✅ 生成恢复指南文档
6. ✅ 支持可选文件的选择性删除

---

## 🚀 使用方法

### 方法一：Python 脚本（推荐）

#### 前置要求
- Python 3.6 或更高版本

#### 执行步骤

1. **打开命令行**（在项目根目录）
   ```bash
   # Windows
   cd C:\Users\72998\Desktop\xunfei - 副本 - 副本
   
   # 或者在文件管理器中右键 -> "在终端中打开"
   ```

2. **运行脚本**
   ```bash
   python cleanup_script.py
   ```

3. **按提示操作**
   ```
   是否包含可选删除文件？(y/N): n    # 输入 n 只删除必删文件
   确认执行清理操作？(y/N): y          # 输入 y 确认执行
   ```

4. **查看结果**
   - 脚本会显示详细的执行过程
   - 最后显示统计信息（文件数、释放空间）

---

### 方法二：PowerShell 脚本

#### 前置要求
- Windows PowerShell 5.0 或更高版本（Windows 10 自带）

#### 执行步骤

1. **打开 PowerShell**（在项目根目录）
   ```powershell
   # 在文件管理器中，按住 Shift + 右键 -> "在此处打开 PowerShell 窗口"
   ```

2. **允许脚本执行**（首次使用需要）
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```

3. **运行脚本**
   ```powershell
   .\cleanup_script.ps1
   ```

4. **按提示操作**
   ```
   是否包含可选删除文件？(y/N): n
   确认执行清理操作？(y/N): y
   ```

---

## 📊 脚本会删除什么？

### 必删文件（20个）- 零风险

#### 僵尸页面文件（4个）
```
miniprogram/pages/card-learning/card-learning.js
miniprogram/pages/card-learning/card-learning.wxml
miniprogram/pages/knowledge-graph/knowledge-graph.js
miniprogram/pages/knowledge-graph/knowledge-graph.wxml
```

#### 未使用的工具（5个）
```
miniprogram/utils/cache.js
miniprogram/utils/image.js
miniprogram/utils/performance.js
miniprogram/utils/request.js
miniprogram/utils/validator.js
```

#### 冗余数据文件（8个）
```
miniprogram/data/cards.json
miniprogram/data/daily-quotes.json
miniprogram/data/events.json
miniprogram/data/events.js
miniprogram/data/graph.json
miniprogram/data/heroes.json
miniprogram/data/quiz-questions.json
miniprogram/data/radio-playlist.json
miniprogram/data/relics.json
```

#### 文档文件（3个）
```
miniprogram/images/README.md
miniprogram/images/daily-sign-bg/README.md
docs/CARD-SWIPE-WXS-OPTIMIZATION.md
```

---

### 可选文件（5个）- 低风险

如果选择 `y` 包含可选文件，还会删除：

```
CLEANUP-CHECKLIST.md                    # 被新版本替代
TESTING.md                              # 与 TESTING-GUIDE.md 重复
星火红色教育智能体与知识图谱小程序.md    # 与 README.md 重复
CODE-REVIEW.md                          # 临时审查文档
PROGRESS.md                             # 开发进度（可归档）
```

---

## 📦 垃圾箱结构

执行后会创建如下结构：

```
_trash_bin_20241120_143025/
├── README_RESTORE.md                   # 恢复指南
├── miniprogram/
│   ├── pages/
│   │   ├── card-learning/
│   │   │   ├── card-learning.js
│   │   │   └── card-learning.wxml
│   │   └── knowledge-graph/
│   │       ├── knowledge-graph.js
│   │       └── knowledge-graph.wxml
│   ├── utils/
│   │   ├── cache.js
│   │   ├── image.js
│   │   ├── performance.js
│   │   ├── request.js
│   │   └── validator.js
│   ├── data/
│   │   ├── *.json
│   │   └── events.js
│   └── images/
│       ├── README.md
│       └── daily-sign-bg/
│           └── README.md
└── docs/
    └── CARD-SWIPE-WXS-OPTIMIZATION.md
```

---

## 🔄 如何恢复文件

### 方法一：手动恢复单个文件

1. 打开垃圾箱目录 `_trash_bin_YYYYMMDD_HHMMSS`
2. 找到需要恢复的文件
3. 复制文件到项目根目录的对应位置

**示例**：
```
从: _trash_bin_20241120_143025/miniprogram/utils/cache.js
到:  miniprogram/utils/cache.js
```

### 方法二：恢复所有文件

如果需要恢复所有文件：

```bash
# Windows PowerShell
Copy-Item -Path "_trash_bin_*\*" -Destination "." -Recurse -Force

# 或者手动将垃圾箱中的文件夹复制回项目根目录
```

---

## ⚠️ 注意事项

### 执行前

1. ✅ **确保已备份项目**（或已提交到 Git）
2. ✅ **仔细阅读待删除文件清单**
3. ✅ **确认这些文件确实不需要**

### 执行中

1. ⚠️ 脚本会要求两次确认
2. ⚠️ 如果不确定，选择 `N` 取消操作
3. ⚠️ 可以先选择 `n` 不包含可选文件

### 执行后

1. ✅ **测试项目功能**，确保一切正常
2. ✅ **保留垃圾箱至少24小时**，以便恢复
3. ✅ 确认无误后，手动删除垃圾箱目录

---

## 🧪 测试建议

执行清理后，建议测试以下功能：

1. ✅ 小程序编译是否成功
2. ✅ 首页是否正常显示
3. ✅ 卡片学习功能是否正常
4. ✅ 知识图谱功能是否正常
5. ✅ AI 对话功能是否正常
6. ✅ 其他核心功能

---

## 📈 预期效果

### 文件数量
- 删除文件：20-25 个
- 释放空间：约 97KB

### 项目优化
- ✅ 减少无用文件
- ✅ 提升项目可维护性
- ✅ 加快编译速度
- ✅ 减小代码体积

---

## 🐛 常见问题

### Q1: 脚本执行失败怎么办？

**A**: 检查以下几点：
1. 是否在项目根目录执行
2. 是否有文件被占用（关闭编辑器）
3. 是否有足够的磁盘空间
4. Python/PowerShell 版本是否符合要求

### Q2: 误删文件怎么办？

**A**: 从垃圾箱恢复：
1. 打开 `_trash_bin_*` 目录
2. 找到需要的文件
3. 复制回原位置

### Q3: 可以多次运行脚本吗？

**A**: 可以，但：
- 每次运行会创建新的垃圾箱
- 已删除的文件不会重复删除
- 建议清理完成后删除旧的垃圾箱

### Q4: 垃圾箱可以删除吗？

**A**: 可以，但建议：
1. 测试项目功能正常后再删除
2. 至少保留24小时
3. 确认不需要恢复任何文件

### Q5: 脚本会修改 Git 历史吗？

**A**: 不会：
- 脚本只移动文件，不修改 Git
- 需要手动 `git add` 和 `git commit`
- 建议清理后提交一次

---

## 🔐 安全性

### 脚本安全特性

1. ✅ **非破坏性操作**：移动而非删除
2. ✅ **保持目录结构**：便于恢复
3. ✅ **双重确认**：防止误操作
4. ✅ **详细日志**：记录所有操作
5. ✅ **恢复指南**：自动生成恢复文档

### 数据安全建议

1. ✅ 执行前提交 Git
2. ✅ 或创建项目备份
3. ✅ 测试后再删除垃圾箱
4. ✅ 重要文件单独备份

---

## 📞 获取帮助

如果遇到问题：

1. 查看脚本输出的错误信息
2. 检查 `README_RESTORE.md` 恢复指南
3. 查看本文档的常见问题部分
4. 从垃圾箱恢复文件后重试

---

## 📝 执行清单

执行前检查：
- [ ] 已阅读本文档
- [ ] 已备份项目或提交 Git
- [ ] 已确认待删除文件清单
- [ ] 已关闭所有编辑器
- [ ] 在项目根目录执行

执行后检查：
- [ ] 查看统计信息
- [ ] 测试项目功能
- [ ] 查看垃圾箱内容
- [ ] 阅读恢复指南
- [ ] 确认无误后提交 Git

---

**脚本版本**: 1.0  
**创建时间**: 2024-11-20  
**适用项目**: 星火红色教育智能体小程序
