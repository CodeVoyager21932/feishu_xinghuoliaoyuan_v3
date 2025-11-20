# 星火小程序项目清理脚本 (PowerShell版本)
# 安全地将待删除文件移动到垃圾箱，保持目录结构以便恢复

# 设置编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 项目根目录
$ProjectRoot = $PSScriptRoot

# 创建带时间戳的垃圾箱目录
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$TrashBin = Join-Path $ProjectRoot "_trash_bin_$Timestamp"

# 待删除文件清单（零风险文件）
$FilesToDelete = @(
    # 僵尸页面文件（4个）
    "miniprogram/pages/card-learning/card-learning.js",
    "miniprogram/pages/card-learning/card-learning.wxml",
    "miniprogram/pages/knowledge-graph/knowledge-graph.js",
    "miniprogram/pages/knowledge-graph/knowledge-graph.wxml",
    
    # 未使用的工具文件（5个）
    "miniprogram/utils/cache.js",
    "miniprogram/utils/image.js",
    "miniprogram/utils/performance.js",
    "miniprogram/utils/request.js",
    "miniprogram/utils/validator.js",
    
    # 冗余数据文件（8个）
    "miniprogram/data/cards.json",
    "miniprogram/data/daily-quotes.json",
    "miniprogram/data/events.json",
    "miniprogram/data/events.js",
    "miniprogram/data/graph.json",
    "miniprogram/data/heroes.json",
    "miniprogram/data/quiz-questions.json",
    "miniprogram/data/radio-playlist.json",
    "miniprogram/data/relics.json",
    
    # 文档文件（3个）
    "miniprogram/images/README.md",
    "miniprogram/images/daily-sign-bg/README.md",
    "docs/CARD-SWIPE-WXS-OPTIMIZATION.md"
)

# 可选删除文件（低风险）
$OptionalFilesToDelete = @(
    "CLEANUP-CHECKLIST.md",
    "TESTING.md",
    "星火红色教育智能体与知识图谱小程序.md",
    "CODE-REVIEW.md",
    "PROGRESS.md"
)

# 空目录清单
$EmptyDirsToDelete = @(
    "miniprogram/images/daily-sign-bg"
)

# 格式化文件大小
function Format-FileSize {
    param([long]$Size)
    
    if ($Size -lt 1KB) { return "$Size B" }
    if ($Size -lt 1MB) { return "{0:N2} KB" -f ($Size / 1KB) }
    if ($Size -lt 1GB) { return "{0:N2} MB" -f ($Size / 1MB) }
    return "{0:N2} GB" -f ($Size / 1GB)
}

# 移动文件到垃圾箱
function Move-FileToTrash {
    param(
        [string]$FilePath,
        [string]$TrashBinPath
    )
    
    $SourcePath = Join-Path $ProjectRoot $FilePath
    
    # 检查文件是否存在
    if (-not (Test-Path $SourcePath)) {
        return @{
            Success = $false
            Size = 0
            Message = "文件不存在: $FilePath"
        }
    }
    
    # 获取文件大小
    $FileSize = (Get-Item $SourcePath).Length
    
    # 构建目标路径（保持目录结构）
    $TargetPath = Join-Path $TrashBinPath $FilePath
    $TargetDir = Split-Path $TargetPath -Parent
    
    # 创建目标目录
    if (-not (Test-Path $TargetDir)) {
        New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    }
    
    try {
        # 移动文件
        Move-Item -Path $SourcePath -Destination $TargetPath -Force
        return @{
            Success = $true
            Size = $FileSize
            Message = "✓ 已移动: $FilePath"
        }
    }
    catch {
        return @{
            Success = $false
            Size = 0
            Message = "✗ 移动失败: $FilePath - $($_.Exception.Message)"
        }
    }
}

# 删除空目录
function Remove-EmptyDirectory {
    param(
        [string]$DirPath,
        [string]$TrashBinPath
    )
    
    $SourcePath = Join-Path $ProjectRoot $DirPath
    
    # 检查目录是否存在
    if (-not (Test-Path $SourcePath)) {
        return @{
            Success = $false
            Message = "目录不存在: $DirPath"
        }
    }
    
    # 检查是否为目录
    if (-not (Test-Path $SourcePath -PathType Container)) {
        return @{
            Success = $false
            Message = "不是目录: $DirPath"
        }
    }
    
    # 检查是否为空
    $Items = Get-ChildItem $SourcePath
    if ($Items.Count -gt 0) {
        return @{
            Success = $false
            Message = "目录非空，跳过: $DirPath"
        }
    }
    
    try {
        # 移动空目录到垃圾箱
        $TargetPath = Join-Path $TrashBinPath $DirPath
        $TargetParent = Split-Path $TargetPath -Parent
        
        if (-not (Test-Path $TargetParent)) {
            New-Item -ItemType Directory -Path $TargetParent -Force | Out-Null
        }
        
        Move-Item -Path $SourcePath -Destination $TargetPath -Force
        return @{
            Success = $true
            Message = "✓ 已删除空目录: $DirPath"
        }
    }
    catch {
        return @{
            Success = $false
            Message = "✗ 删除失败: $DirPath - $($_.Exception.Message)"
        }
    }
}

# 主函数
function Main {
    Write-Host "=" * 70
    Write-Host "星火小程序项目清理脚本"
    Write-Host "=" * 70
    Write-Host ""
    Write-Host "项目根目录: $ProjectRoot"
    Write-Host "垃圾箱目录: $TrashBin"
    Write-Host ""
    Write-Host "待处理文件数: $($FilesToDelete.Count)"
    Write-Host "可选删除文件数: $($OptionalFilesToDelete.Count)"
    Write-Host "待检查空目录数: $($EmptyDirsToDelete.Count)"
    
    # 询问是否包含可选文件
    Write-Host ""
    Write-Host "=" * 70
    $IncludeOptional = Read-Host "是否包含可选删除文件？(y/N)"
    
    $FilesToProcess = $FilesToDelete
    if ($IncludeOptional -eq 'y' -or $IncludeOptional -eq 'Y') {
        $FilesToProcess = $FilesToDelete + $OptionalFilesToDelete
        Write-Host "✓ 将处理 $($FilesToProcess.Count) 个文件（包含可选文件）"
    }
    else {
        Write-Host "✓ 将处理 $($FilesToProcess.Count) 个文件（仅必删文件）"
    }
    
    # 确认执行
    Write-Host ""
    Write-Host "=" * 70
    $Confirm = Read-Host "确认执行清理操作？(y/N)"
    if ($Confirm -ne 'y' -and $Confirm -ne 'Y') {
        Write-Host ""
        Write-Host "✗ 操作已取消"
        return
    }
    
    # 创建垃圾箱目录
    New-Item -ItemType Directory -Path $TrashBin -Force | Out-Null
    Write-Host ""
    Write-Host "✓ 已创建垃圾箱目录: $(Split-Path $TrashBin -Leaf)"
    
    # 统计信息
    $SuccessCount = 0
    $FailedCount = 0
    $TotalSize = 0
    
    # 处理文件
    Write-Host ""
    Write-Host "=" * 70
    Write-Host "开始移动文件..."
    Write-Host "=" * 70
    
    foreach ($FilePath in $FilesToProcess) {
        $Result = Move-FileToTrash -FilePath $FilePath -TrashBinPath $TrashBin
        Write-Host $Result.Message
        
        if ($Result.Success) {
            $SuccessCount++
            $TotalSize += $Result.Size
        }
        else {
            $FailedCount++
        }
    }
    
    # 处理空目录
    Write-Host ""
    Write-Host "=" * 70
    Write-Host "检查并删除空目录..."
    Write-Host "=" * 70
    
    $DirSuccessCount = 0
    foreach ($DirPath in $EmptyDirsToDelete) {
        $Result = Remove-EmptyDirectory -DirPath $DirPath -TrashBinPath $TrashBin
        Write-Host $Result.Message
        if ($Result.Success) {
            $DirSuccessCount++
        }
    }
    
    # 打印统计结果
    Write-Host ""
    Write-Host "=" * 70
    Write-Host "清理完成！"
    Write-Host "=" * 70
    Write-Host ""
    Write-Host "📊 统计信息:"
    Write-Host "  ✓ 成功移动文件: $SuccessCount 个"
    Write-Host "  ✗ 失败/跳过: $FailedCount 个"
    Write-Host "  📁 删除空目录: $DirSuccessCount 个"
    Write-Host "  💾 释放空间: $(Format-FileSize $TotalSize)"
    Write-Host ""
    Write-Host "📦 垃圾箱位置: $TrashBin"
    Write-Host ""
    Write-Host "💡 提示:"
    Write-Host "  - 如需恢复文件，请从垃圾箱中手动复制回原位置"
    Write-Host "  - 确认无误后，可手动删除垃圾箱目录"
    Write-Host "  - 垃圾箱目录: $(Split-Path $TrashBin -Leaf)"
    
    # 创建恢复说明文件
    $RestoreGuide = Join-Path $TrashBin "README_RESTORE.md"
    $RestoreContent = @"
# 文件恢复指南

## 垃圾箱信息
- 创建时间: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- 文件数量: $SuccessCount
- 释放空间: $(Format-FileSize $TotalSize)

## 如何恢复文件

1. 找到需要恢复的文件
2. 将文件从此目录复制回项目根目录
3. 保持相对路径不变

例如：
- 垃圾箱中的文件: ``_trash_bin_$Timestamp/miniprogram/utils/cache.js``
- 恢复到: ``miniprogram/utils/cache.js``

## 已移动的文件清单

"@
    
    $Index = 1
    foreach ($FilePath in $FilesToProcess) {
        $SourcePath = Join-Path $ProjectRoot $FilePath
        if (-not (Test-Path $SourcePath)) {
            $RestoreContent += "$Index. $FilePath`n"
            $Index++
        }
    }
    
    if ($DirSuccessCount -gt 0) {
        $RestoreContent += "`n## 已删除的空目录`n`n"
        foreach ($DirPath in $EmptyDirsToDelete) {
            $RestoreContent += "- $DirPath`n"
        }
    }
    
    $RestoreContent | Out-File -FilePath $RestoreGuide -Encoding UTF8
    
    Write-Host ""
    Write-Host "✓ 已创建恢复指南: README_RESTORE.md"
    Write-Host ""
    Write-Host "=" * 70
}

# 执行主函数
try {
    Main
}
catch {
    Write-Host ""
    Write-Host "✗ 发生错误: $($_.Exception.Message)"
    Write-Host $_.ScriptStackTrace
}
