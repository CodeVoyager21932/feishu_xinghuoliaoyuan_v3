#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
星火小程序自动清理脚本（无需交互）
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

# 可选删除文件（本次不删除，保留归档）
OPTIONAL_FILES = [
    "CLEANUP-CHECKLIST.md",
    "TESTING.md",
    "星火红色教育智能体与知识图谱小程序.md",
    "CODE-REVIEW.md",
    "PROGRESS.md",
]

# 空目录清单
EMPTY_DIRS = [
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
    """移动文件到垃圾箱"""
    source = PROJECT_ROOT / file_path
    
    if not source.exists():
        return False, 0, f"⊘ 文件不存在: {file_path}"
    
    file_size = source.stat().st_size
    target = trash_bin / file_path
    target.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        shutil.move(str(source), str(target))
        return True, file_size, f"✓ 已移动: {file_path}"
    except Exception as e:
        return False, 0, f"✗ 移动失败: {file_path} - {str(e)}"


def remove_empty_dir(dir_path, trash_bin):
    """删除空目录"""
    source = PROJECT_ROOT / dir_path
    
    if not source.exists():
        return False, f"⊘ 目录不存在: {dir_path}"
    
    if not source.is_dir():
        return False, f"✗ 不是目录: {dir_path}"
    
    if list(source.iterdir()):
        return False, f"⊘ 目录非空，跳过: {dir_path}"
    
    try:
        target = trash_bin / dir_path
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(source), str(target))
        return True, f"✓ 已删除空目录: {dir_path}"
    except Exception as e:
        return False, f"✗ 删除失败: {dir_path} - {str(e)}"


def main():
    """主函数"""
    print("=" * 70)
    print("星火小程序自动清理脚本")
    print("=" * 70)
    print(f"\n项目根目录: {PROJECT_ROOT}")
    print(f"垃圾箱目录: {TRASH_BIN.name}")
    print(f"\n待处理文件数: {len(FILES_TO_DELETE)}")
    print(f"可选文件数（本次保留）: {len(OPTIONAL_FILES)}")
    
    # 创建垃圾箱目录
    TRASH_BIN.mkdir(parents=True, exist_ok=True)
    print(f"\n✓ 已创建垃圾箱目录")
    
    # 统计信息
    success_count = 0
    failed_count = 0
    skipped_count = 0
    total_size = 0
    
    # 处理文件
    print("\n" + "=" * 70)
    print("开始移动文件...")
    print("=" * 70)
    
    for file_path in FILES_TO_DELETE:
        success, size, message = move_file_to_trash(file_path, TRASH_BIN)
        print(message)
        
        if success:
            success_count += 1
            total_size += size
        elif "不存在" in message:
            skipped_count += 1
        else:
            failed_count += 1
    
    # 处理空目录
    print("\n" + "=" * 70)
    print("检查并删除空目录...")
    print("=" * 70)
    
    dir_success_count = 0
    for dir_path in EMPTY_DIRS:
        success, message = remove_empty_dir(dir_path, TRASH_BIN)
        print(message)
        if success:
            dir_success_count += 1
    
    # 打印统计结果
    print("\n" + "=" * 70)
    print("清理完成！")
    print("=" * 70)
    print(f"\n📊 统计信息:")
    print(f"  ✓ 成功移动: {success_count} 个")
    print(f"  ⊘ 跳过（不存在）: {skipped_count} 个")
    print(f"  ✗ 失败: {failed_count} 个")
    print(f"  📁 删除空目录: {dir_success_count} 个")
    print(f"  💾 释放空间: {format_size(total_size)}")
    print(f"\n📦 垃圾箱位置: {TRASH_BIN}")
    
    # 创建恢复说明文件
    restore_guide = TRASH_BIN / "README_RESTORE.md"
    with open(restore_guide, 'w', encoding='utf-8') as f:
        f.write(f"""# 文件恢复指南

## 垃圾箱信息
- 创建时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
- 成功移动: {success_count} 个文件
- 释放空间: {format_size(total_size)}

## 如何恢复文件

将文件从此目录复制回项目根目录，保持相对路径不变。

## 已移动的文件清单

""")
        for i, file_path in enumerate(FILES_TO_DELETE, 1):
            source = PROJECT_ROOT / file_path
            if not source.exists():
                f.write(f"{i}. {file_path}\n")
        
        if dir_success_count > 0:
            f.write(f"\n## 已删除的空目录\n\n")
            for dir_path in EMPTY_DIRS:
                f.write(f"- {dir_path}\n")
        
        f.write(f"\n## 保留的可选文件\n\n")
        f.write(f"以下文件未删除，可手动归档：\n\n")
        for file_path in OPTIONAL_FILES:
            f.write(f"- {file_path}\n")
    
    print(f"\n✓ 已创建恢复指南: README_RESTORE.md")
    print("\n💡 提示:")
    print(f"  - 垃圾箱目录: {TRASH_BIN.name}")
    print(f"  - 如需恢复，从垃圾箱复制回原位置")
    print(f"  - 确认无误后，可手动删除垃圾箱")
    print("\n" + "=" * 70)
    
    return success_count, skipped_count, failed_count, total_size


if __name__ == "__main__":
    try:
        success, skipped, failed, size = main()
        exit(0 if failed == 0 else 1)
    except Exception as e:
        print(f"\n\n✗ 发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
        exit(1)
