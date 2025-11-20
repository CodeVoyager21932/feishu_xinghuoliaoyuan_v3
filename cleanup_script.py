#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
星火小程序项目清理脚本
安全地将待删除文件移动到垃圾箱，保持目录结构以便恢复
"""

import os
import shutil
from datetime import datetime
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(__file__).parent

# 创建带时间戳的垃圾箱目录
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
TRASH_BIN = PROJECT_ROOT / f"_trash_bin_{TIMESTAMP}"

# 待删除文件清单（零风险文件）
FILES_TO_DELETE = [
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
    "docs/CARD-SWIPE-WXS-OPTIMIZATION.md",
]

# 可选删除文件（低风险）
OPTIONAL_FILES_TO_DELETE = [
    "CLEANUP-CHECKLIST.md",
    "TESTING.md",
    "星火红色教育智能体与知识图谱小程序.md",
    "CODE-REVIEW.md",
    "PROGRESS.md",
]

# 空目录清单
EMPTY_DIRS_TO_DELETE = [
    "miniprogram/images/daily-sign-bg",
]


def format_size(size_bytes):
    """格式化文件大小"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def move_file_to_trash(file_path, trash_bin):
    """
    将文件移动到垃圾箱，保持目录结构
    
    Args:
        file_path: 相对于项目根目录的文件路径
        trash_bin: 垃圾箱根目录
    
    Returns:
        tuple: (是否成功, 文件大小)
    """
    source = PROJECT_ROOT / file_path
    
    # 检查文件是否存在
    if not source.exists():
        return False, 0, f"文件不存在: {file_path}"
    
    # 获取文件大小
    file_size = source.stat().st_size
    
    # 构建目标路径（保持目录结构）
    target = trash_bin / file_path
    
    # 创建目标目录
    target.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        # 移动文件
        shutil.move(str(source), str(target))
        return True, file_size, f"✓ 已移动: {file_path}"
    except Exception as e:
        return False, 0, f"✗ 移动失败: {file_path} - {str(e)}"


def remove_empty_dir(dir_path, trash_bin):
    """
    删除空目录（如果为空）
    
    Args:
        dir_path: 相对于项目根目录的目录路径
        trash_bin: 垃圾箱根目录
    
    Returns:
        tuple: (是否成功, 消息)
    """
    source = PROJECT_ROOT / dir_path
    
    # 检查目录是否存在
    if not source.exists():
        return False, f"目录不存在: {dir_path}"
    
    # 检查是否为空目录
    if not source.is_dir():
        return False, f"不是目录: {dir_path}"
    
    # 检查是否为空
    if list(source.iterdir()):
        return False, f"目录非空，跳过: {dir_path}"
    
    try:
        # 移动空目录到垃圾箱
        target = trash_bin / dir_path
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(source), str(target))
        return True, f"✓ 已删除空目录: {dir_path}"
    except Exception as e:
        return False, f"✗ 删除失败: {dir_path} - {str(e)}"


def main():
    """主函数"""
    print("=" * 70)
    print("星火小程序项目清理脚本")
    print("=" * 70)
    print(f"\n项目根目录: {PROJECT_ROOT}")
    print(f"垃圾箱目录: {TRASH_BIN}")
    print(f"\n待处理文件数: {len(FILES_TO_DELETE)}")
    print(f"可选删除文件数: {len(OPTIONAL_FILES_TO_DELETE)}")
    print(f"待检查空目录数: {len(EMPTY_DIRS_TO_DELETE)}")
    
    # 询问是否包含可选文件
    print("\n" + "=" * 70)
    include_optional = input("是否包含可选删除文件？(y/N): ").strip().lower()
    
    files_to_process = FILES_TO_DELETE.copy()
    if include_optional == 'y':
        files_to_process.extend(OPTIONAL_FILES_TO_DELETE)
        print(f"✓ 将处理 {len(files_to_process)} 个文件（包含可选文件）")
    else:
        print(f"✓ 将处理 {len(files_to_process)} 个文件（仅必删文件）")
    
    # 确认执行
    print("\n" + "=" * 70)
    confirm = input("确认执行清理操作？(y/N): ").strip().lower()
    if confirm != 'y':
        print("\n✗ 操作已取消")
        return
    
    # 创建垃圾箱目录
    TRASH_BIN.mkdir(parents=True, exist_ok=True)
    print(f"\n✓ 已创建垃圾箱目录: {TRASH_BIN.name}")
    
    # 统计信息
    success_count = 0
    failed_count = 0
    total_size = 0
    
    # 处理文件
    print("\n" + "=" * 70)
    print("开始移动文件...")
    print("=" * 70)
    
    for file_path in files_to_process:
        success, size, message = move_file_to_trash(file_path, TRASH_BIN)
        print(message)
        
        if success:
            success_count += 1
            total_size += size
        else:
            failed_count += 1
    
    # 处理空目录
    print("\n" + "=" * 70)
    print("检查并删除空目录...")
    print("=" * 70)
    
    dir_success_count = 0
    for dir_path in EMPTY_DIRS_TO_DELETE:
        success, message = remove_empty_dir(dir_path, TRASH_BIN)
        print(message)
        if success:
            dir_success_count += 1
    
    # 打印统计结果
    print("\n" + "=" * 70)
    print("清理完成！")
    print("=" * 70)
    print(f"\n📊 统计信息:")
    print(f"  ✓ 成功移动文件: {success_count} 个")
    print(f"  ✗ 失败/跳过: {failed_count} 个")
    print(f"  📁 删除空目录: {dir_success_count} 个")
    print(f"  💾 释放空间: {format_size(total_size)}")
    print(f"\n📦 垃圾箱位置: {TRASH_BIN}")
    print(f"\n💡 提示:")
    print(f"  - 如需恢复文件，请从垃圾箱中手动复制回原位置")
    print(f"  - 确认无误后，可手动删除垃圾箱目录")
    print(f"  - 垃圾箱目录: {TRASH_BIN.name}")
    
    # 创建恢复说明文件
    restore_guide = TRASH_BIN / "README_RESTORE.md"
    with open(restore_guide, 'w', encoding='utf-8') as f:
        f.write(f"""# 文件恢复指南

## 垃圾箱信息
- 创建时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
- 文件数量: {success_count}
- 释放空间: {format_size(total_size)}

## 如何恢复文件

1. 找到需要恢复的文件
2. 将文件从此目录复制回项目根目录
3. 保持相对路径不变

例如：
- 垃圾箱中的文件: `_trash_bin_{TIMESTAMP}/miniprogram/utils/cache.js`
- 恢复到: `miniprogram/utils/cache.js`

## 已移动的文件清单

""")
        for i, file_path in enumerate(files_to_process, 1):
            source = PROJECT_ROOT / file_path
            if not source.exists():
                f.write(f"{i}. {file_path}\n")
        
        if dir_success_count > 0:
            f.write(f"\n## 已删除的空目录\n\n")
            for dir_path in EMPTY_DIRS_TO_DELETE:
                f.write(f"- {dir_path}\n")
    
    print(f"\n✓ 已创建恢复指南: {restore_guide.name}")
    print("\n" + "=" * 70)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✗ 操作已被用户中断")
    except Exception as e:
        print(f"\n\n✗ 发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
