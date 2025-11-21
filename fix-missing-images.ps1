# 修复缺失图片的 PowerShell 脚本

Write-Host "=== 小程序图片修复工具 ===" -ForegroundColor Cyan
Write-Host ""

$imagesDir = "miniprogram/images"

# 检查 images 目录是否存在
if (-not (Test-Path $imagesDir)) {
    Write-Host "错误: 找不到 images 目录" -ForegroundColor Red
    exit 1
}

Write-Host "检查缺失的图片..." -ForegroundColor Yellow
Write-Host ""

# 缺失的图片列表
$missingImages = @(
    @{
        Path = "$imagesDir/empty-state.png"
        Name = "empty-state.png"
        Description = "空状态图标"
        Fallback = "$imagesDir/default-avatar.png"
    },
    @{
        Path = "$imagesDir/xinghuo-avatar.png"
        Name = "xinghuo-avatar.png"
        Description = "AI头像"
        Fallback = "$imagesDir/default-avatar.png"
    }
)

$needsFix = $false

foreach ($image in $missingImages) {
    if (-not (Test-Path $image.Path)) {
        Write-Host "❌ 缺失: $($image.Name) - $($image.Description)" -ForegroundColor Red
        $needsFix = $true
    } else {
        Write-Host "✅ 存在: $($image.Name)" -ForegroundColor Green
    }
}

Write-Host ""

if (-not $needsFix) {
    Write-Host "所有图片都已存在！" -ForegroundColor Green
    exit 0
}

Write-Host "是否使用默认头像作为临时占位图？(Y/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "开始创建占位图片..." -ForegroundColor Cyan
    
    foreach ($image in $missingImages) {
        if (-not (Test-Path $image.Path)) {
            if (Test-Path $image.Fallback) {
                Copy-Item $image.Fallback $image.Path
                Write-Host "✅ 已创建: $($image.Name)" -ForegroundColor Green
            } else {
                Write-Host "⚠️  无法创建 $($image.Name): 找不到备用图片" -ForegroundColor Yellow
            }
        }
    }
    
    Write-Host ""
    Write-Host "完成！请记得后续替换为实际图片。" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "已取消。请手动添加以下图片：" -ForegroundColor Yellow
    foreach ($image in $missingImages) {
        if (-not (Test-Path $image.Path)) {
            Write-Host "  - $($image.Path)" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "提示: 查看 IMAGE-GUIDE.md 了解详细的图片添加指南" -ForegroundColor Cyan
