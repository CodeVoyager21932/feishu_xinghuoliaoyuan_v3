# 图片压缩紧急指南

## 🚨 当前问题

**小程序总大小**: 8.57 MB
**主包限制**: 2 MB
**超出**: 6.57 MB (328%)

**必须立即压缩所有图片！**

---

## 📊 压缩目标

### 当前 vs 目标

| 类型 | 当前大小 | 目标大小 | 压缩率 |
|------|----------|----------|--------|
| 核心图片 (3个) | 525 KB | 80 KB | 85% |
| 功能图标 (11个) | 400 KB | 30 KB | 92% |
| 英雄头像 (6个) | 406 KB | 150 KB | 63% |

**压缩后预计总大小**: 1.5 MB ✅

---

## 🔧 方法 1: 使用 TinyPNG（最简单）

### 步骤

1. **访问 TinyPNG**
   ```
   https://tinypng.com
   ```

2. **批量上传**
   - 一次最多 20 张
   - 拖拽所有图片到网页

3. **下载压缩后的图片**
   - 点击 "Download all"
   - 解压到临时文件夹

4. **替换原图片**
   ```
   复制压缩后的图片 → miniprogram/images/
   ```

### 预期效果
- 图标: 525 KB → 50-80 KB (90% 压缩)
- 头像: 406 KB → 100-150 KB (70% 压缩)

---

## 🔧 方法 2: 使用命令行工具

### 安装 ImageMagick (Windows)

```powershell
# 使用 Chocolatey 安装
choco install imagemagick

# 或下载安装包
# https://imagemagick.org/script/download.php
```

### 批量压缩命令

```powershell
# 进入 images 目录
cd miniprogram/images

# 压缩所有 PNG 图标（质量 75）
Get-ChildItem -Recurse -Filter "*.png" | ForEach-Object {
    magick convert $_.FullName -quality 75 -strip $_.FullName
}

# 压缩所有 JPG 头像（质量 85）
Get-ChildItem -Recurse -Filter "*.jpg" | ForEach-Object {
    magick convert $_.FullName -quality 85 -strip $_.FullName
}
```

---

## 🔧 方法 3: 调整尺寸 + 压缩

### 图标太大了，需要缩小

```powershell
# 核心图片: 400x400 → 200x200
cd miniprogram/images
magick convert xinghuo-avatar.png -resize 200x200 -quality 80 xinghuo-avatar.png
magick convert empty-state.png -resize 200x200 -quality 80 empty-state.png
magick convert default-avatar.png -resize 200x200 -quality 80 default-avatar.png

# 功能图标: 当前尺寸 → 128x128
cd icons
Get-ChildItem -Filter "*.png" | ForEach-Object {
    magick convert $_.FullName -resize 128x128 -quality 75 $_.FullName
}

# 英雄头像: 保持尺寸，降低质量
cd ../heroes
Get-ChildItem -Filter "*.png" | ForEach-Object {
    magick convert $_.FullName -quality 70 -strip $_.FullName
}
```

---

## 📱 方案 4: 使用云存储（推荐）

### 将大图片移到云存储

**适合云存储的图片**:
- ✅ 英雄头像 (6个，每个 400KB)
- ✅ 背景图片
- ✅ 大尺寸图片

**必须在本地的图片**:
- ⚠️ 功能图标 (11个)
- ⚠️ 核心图片 (3个)

### 配置云存储

1. **上传图片到云存储**
   ```
   微信开发者工具 → 云开发 → 存储 → 上传文件
   ```

2. **获取云存储路径**
   ```
   cloud://your-env-id.xxxx/images/heroes/leifeng.png
   ```

3. **修改代码引用**
   ```javascript
   // data/heroes.js
   const CLOUD_BASE = 'cloud://cloud1-0g84030j58680666.xxxx/images/';
   
   const heroes = [
     {
       id: 1,
       name: '雷锋',
       avatar: CLOUD_BASE + 'heroes/leifeng.png',
       // ...
     }
   ];
   ```

---

## 🎯 关于那张 3D 图片

### 如果一定要用

**必须做的处理**:

1. **裁剪**: 只保留头像部分（去掉火炬）
2. **缩小**: 调整到 200x200px
3. **压缩**: 使用 TinyPNG 压缩到 < 80KB
4. **去背景**: 使用 remove.bg

### 处理后预期
```
原图: 1-2 MB
处理后: 60-80 KB ✅
```

### 在线处理工具

1. **Remove.bg** - 去背景
   ```
   https://remove.bg
   ```

2. **ILoveIMG** - 调整尺寸
   ```
   https://iloveimg.com/resize-image
   ```

3. **TinyPNG** - 压缩
   ```
   https://tinypng.com
   ```

---

## ⚡ 快速压缩脚本

### 创建压缩脚本

```powershell
# compress-all-images.ps1

Write-Host "开始压缩图片..." -ForegroundColor Cyan

$imagesPath = "miniprogram/images"

# 压缩核心图片
Write-Host "`n压缩核心图片..." -ForegroundColor Yellow
Get-ChildItem "$imagesPath/*.png" | ForEach-Object {
    $size = $_.Length / 1KB
    Write-Host "压缩 $($_.Name) (原大小: $([math]::Round($size, 2)) KB)"
    magick convert $_.FullName -resize 200x200 -quality 80 -strip $_.FullName
}

# 压缩图标
Write-Host "`n压缩功能图标..." -ForegroundColor Yellow
Get-ChildItem "$imagesPath/icons/*.png" | ForEach-Object {
    $size = $_.Length / 1KB
    Write-Host "压缩 $($_.Name) (原大小: $([math]::Round($size, 2)) KB)"
    magick convert $_.FullName -resize 128x128 -quality 75 -strip $_.FullName
}

# 压缩英雄头像
Write-Host "`n压缩英雄头像..." -ForegroundColor Yellow
Get-ChildItem "$imagesPath/heroes/*.png" | ForEach-Object {
    $size = $_.Length / 1KB
    Write-Host "压缩 $($_.Name) (原大小: $([math]::Round($size, 2)) KB)"
    magick convert $_.FullName -quality 70 -strip $_.FullName
}

Write-Host "`n压缩完成！" -ForegroundColor Green

# 显示新的总大小
$newSize = 0
Get-ChildItem "$imagesPath" -Recurse -File | ForEach-Object {
    $newSize += $_.Length
}
Write-Host "新的图片总大小: $([math]::Round($newSize/1KB, 2)) KB ($([math]::Round($newSize/1MB, 2)) MB)"
```

### 运行脚本

```powershell
.\compress-all-images.ps1
```

---

## ✅ 验证结果

### 压缩后检查

```powershell
cd miniprogram

# 检查总大小
$totalSize = 0
Get-ChildItem -Recurse -File | Where-Object { 
    $_.Extension -match '\.(js|json|wxml|wxss|png|jpg)$' 
} | ForEach-Object { 
    $totalSize += $_.Length 
}

Write-Host "小程序总大小: $([math]::Round($totalSize/1KB, 2)) KB"
Write-Host "主包限制: 2048 KB"

if ($totalSize -lt 2048KB) {
    Write-Host "✅ 符合要求！" -ForegroundColor Green
} else {
    Write-Host "❌ 仍然超出限制！" -ForegroundColor Red
}
```

---

## 🎯 最终目标

```
当前: 8.57 MB
目标: < 2 MB
压缩率: 77%

图片部分:
当前: ~8 MB
目标: < 1.5 MB
压缩率: 81%
```

---

## 💡 建议

1. **立即压缩所有图片**（使用 TinyPNG）
2. **考虑将英雄头像移到云存储**
3. **如果要用 3D 图，必须处理到 < 80KB**
4. **定期检查包大小**

---

**记住**: 小程序主包超过 2MB 无法发布！
