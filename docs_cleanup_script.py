#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
星火小程序文档清理脚本
安全地将待删除文档移动到垃圾箱，保持目录结构以便恢复
"""

import os
import shutil
from datetime import datetime
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(__file__).parent

# 创建带时间戳的垃圾箱目录
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
TRASH_BIN = PROJECT_ROOT / f"_docs_trash_bin_{TIMESTAMP}"

# 必删文档（零风险）
DOCS_TO_DELETE = [
    # images 目录的 README
    "miniprogram/images/README.md",
    "miniprogram/images/daily-sign-bg/README.md",
    
    # 过时的技术文档
    "docs/CARD-SWIPE-WXS-OPTIMIZATION.md",
]

# 可选删除文档（低风险）
OPTIONAL_DOCS_TO_DELETE = [
    # 被新版本替代
    "CLEANUP-CHECKLIST.md",
    
    # 重复文档
    "TESTING.md",  # 与 TESTING-GUIDE.md 重复
    "星火红色教育智能体与知识图谱小程序.md",  # 与 README.md 重复
    
    # 临时文档（可归档）
    "CODE-REVIEW.md",
    "PROGRESS.md",
    "PROJECT-SUMMARY.md",
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
        tuple: (是否成功, 文件大小, 消息)
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
    
    # 检查是否为目录
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


def analyze_documents():
    """分析项目中的所有文档"""
    print("\n" + "=" * 70)
    print("📚 文档分析")
    print("=" * 70)
    
    # 统计所有 MD 文件
    all_md_files = list(PROJECT_ROOT.rglob("*.md"))
    
    print(f"\n总文档数: {len(all_md_files)}")
    
    # 按目录分类
    root_docs = [f for f in all_md_files if f.parent == PROJECT_ROOT]
    docs_dir = [f for f in all_md_files if "docs" in str(f)]
    kiro_docs = [f for f in all_md_files if ".kiro" in str(f)]
    cloud_docs = [f for f in all_md_files if "cloud" in str(f)]
    miniprogram_docs = [f for f in all_md_files if "miniprogram" in str(f)]
    other_docs = [f for f in all_md_files if f not in root_docs + docs_dir + kiro_docs + cloud_docs + miniprogram_docs]
    
    print(f"\n按目录分类:")
    print(f"  根目录: {len(root_docs)} 个")
    print(f"  docs/: {len(docs_dir)} 个")
    print(f"  .kiro/: {len(kiro_docs)} 个")
    print(f"  cloud/: {len(cloud_docs)} 个")
    print(f"  miniprogram/: {len(miniprogram_docs)} 个")
    print(f"  其他: {len(other_docs)} 个")
    
    # 计算总大小
    total_size = sum(f.stat().st_size for f in all_md_files)
    print(f"\n文档总大小: {format_size(total_size)}")
    
    return all_md_files


def main():
    """主函数"""
    print("=" * 70)
    print("星火小程序文档清理脚本")
    print("=" * 70)
    print(f"\n项目根目录: {PROJECT_ROOT}")
    print(f"垃圾箱目录: {TRASH_BIN}")
    
    # 分析文档
    all_docs = analyze_documents()
    
    print(f"\n待删除文档数: {len(DOCS_TO_DELETE)}")
    print(f"可选删除文档数: {len(OPTIONAL_DOCS_TO_DELETE)}")
    print(f"待检查空目录数: {len(EMPTY_DIRS_TO_DELETE)}")
    
    # 显示待删除文档列表
    print("\n" + "=" * 70)
    print("📋 必删文档列表:")
    print("=" * 70)
    for doc in DOCS_TO_DELETE:
        print(f"  - {doc}")
    
    print("\n" + "=" * 70)
    print("📋 可选删除文档列表:")
    print("=" * 70)
    for doc in OPTIONAL_DOCS_TO_DELETE:
        print(f"  - {doc}")
    
    # 询问是否包含可选文件
    print("\n" + "=" * 70)
    include_optional = input("是否包含可选删除文档？(y/N): ").strip().lower()
    
    docs_to_process = DOCS_TO_DELETE.copy()
    if include_optional == 'y':
        docs_to_process.extend(OPTIONAL_DOCS_TO_DELETE)
        print(f"✓ 将处理 {len(docs_to_process)} 个文档（包含可选文档）")
    else:
        print(f"✓ 将处理 {len(docs_to_process)} 个文档（仅必删文档）")
    
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
    
    # 处理文档
    print("\n" + "=" * 70)
    print("开始移动文档...")
    print("=" * 70)
    
    for doc_path in docs_to_process:
        success, size, message = move_file_to_trash(doc_path, TRASH_BIN)
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
    print(f"  ✓ 成功移动文档: {success_count} 个")
    print(f"  ✗ 失败/跳过: {failed_count} 个")
    print(f"  📁 删除空目录: {dir_success_count} 个")
    print(f"  💾 释放空间: {format_size(total_size)}")
    print(f"\n📦 垃圾箱位置: {TRASH_BIN}")
    print(f"\n💡 提示:")
    print(f"  - 如需恢复文档，请从垃圾箱中手动复制回原位置")
    print(f"  - 确认无误后，可手动删除垃圾箱目录")
    print(f"  - 垃圾箱目录: {TRASH_BIN.name}")
    
    # 创建恢复说明文件
    restore_guide = TRASH_BIN / "README_RESTORE.md"
    with open(restore_guide, 'w', encoding='utf-8') as f:
        f.write(f"""# 文档恢复指南

## 垃圾箱信息
- 创建时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
- 文档数量: {success_count}
- 释放空间: {format_size(total_size)}

## 如何恢复文档

1. 找到需要恢复的文档
2. 将文档从此目录复制回项目根目录
3. 保持相对路径不变

例如：
- 垃圾箱中的文档: `_docs_trash_bin_{TIMESTAMP}/docs/CARD-SWIPE-WXS-OPTIMIZATION.md`
- 恢复到: `docs/CARD-SWIPE-WXS-OPTIMIZATION.md`

## 已移动的文档清单

""")
        for i, doc_path in enumerate(docs_to_process, 1):
            source = PROJECT_ROOT / doc_path
            if not source.exists():
                f.write(f"{i}. {doc_path}\n")
        
        if dir_success_count > 0:
            f.write(f"\n## 已删除的空目录\n\n")
            for dir_path in EMPTY_DIRS_TO_DELETE:
                f.write(f"- {dir_path}\n")
        
        f.write(f"\n## 文档分类说明\n\n")
        f.write(f"### 必删文档\n")
        f.write(f"这些文档是冗余或过时的，删除不会影响项目：\n\n")
        for doc in DOCS_TO_DELETE:
            f.write(f"- {doc}\n")
        
        if include_optional == 'y':
            f.write(f"\n### 可选删除文档\n")
            f.write(f"这些文档可能有归档价值，但与其他文档重复：\n\n")
            for doc in OPTIONAL_DOCS_TO_DELETE:
                f.write(f"- {doc}\n")
    
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
