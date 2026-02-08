#!/bin/bash

echo "========================================"
echo "🐴 马年新春贺卡生成器 - 初始化脚本"
echo "========================================"
echo ""

# 检查 Node.js
echo "[1/4] 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装：https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js 已安装: $(node --version)"
echo ""

# 安装依赖
echo "[2/4] 安装项目依赖..."
echo "这可能需要几分钟，请耐心等待..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败，请检查网络连接"
    exit 1
fi
echo "✅ 依赖安装完成"
echo ""

# 配置环境变量
echo "[3/4] 配置环境变量..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ 已创建 .env.local 文件"
    echo "⚠️  请编辑 .env.local 文件，填入你的阿里云百炼 API Key"
    echo "获取地址：https://bailian.console.aliyun.com/"
else
    echo "✅ .env.local 文件已存在"
fi
echo ""

# 启动提示
echo "[4/4] 准备完成！"
echo ""
echo "========================================"
echo "📝 下一步操作："
echo "========================================"
echo "1. 编辑 .env.local 文件，填入你的 DASHSCOPE_API_KEY"
echo "2. 运行 npm run dev 启动开发服务器"
echo "3. 打开浏览器访问 http://localhost:3000"
echo ""
echo "💡 提示："
echo "- API Key 获取：https://bailian.console.aliyun.com/"
echo "- 详细文档：README.md"
echo "- 快速开始：QUICK_START.md"
echo "========================================"
echo ""
