# 马年新春贺卡 - 快速启动指南

## 第一次运行

### 1. 安装依赖
cd spring-card
npm install

### 2. 配置环境变量
复制 .env.example 为 .env.local，并填入你的阿里云百炼 API Key：

```
DASHSCOPE_API_KEY=sk-your-api-key-here
```

获取地址：https://bailian.console.aliyun.com/

### 3. 启动开发服务器
npm run dev

### 4. 打开浏览器
访问 http://localhost:3000

---

## 常用命令

- `npm run dev` - 启动开发服务器（热重载）
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 代码检查

---

## 快速测试

1. 打开网站
2. 点击"一键生成贺词"
3. 等待 2-5 秒，贺词生成完成
4. 点击"生成贺卡长图（9:16）"
5. 等待 10-20 秒，贺卡生成完成
6. 点击"保存到相册"或"长按图片保存"

---

## 故障排查

### 问题：npm install 失败
解决：
- 尝试使用淘宝镜像：`npm install --registry=https://registry.npmmirror.com`
- 或使用 yarn/pnpm

### 问题：API 调用失败
检查：
1. `.env.local` 是否配置正确
2. DASHSCOPE_API_KEY 是否有效
3. 是否有网络连接
4. 查看控制台错误信息

### 问题：图片生成很慢
说明：
- AI 图片生成需要 10-20 秒，这是正常的
- 如果超过 30 秒，可能是网络问题或 API 限流

---

## 下一步

- 📖 阅读完整文档：README.md
- 🎨 自定义样式：修改 styles/globals.css
- 🤖 调整 AI 提示词：修改 lib/bailian.ts
- 🚀 部署到线上：参考 README.md 部署指南

祝您使用愉快！🐴✨
