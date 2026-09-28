# Autional 服务状态

**域名**：[status.autional.cn](https://status.autional.cn)
**技术栈**：Vite + React 19 + TypeScript + Tailwind CSS
**仓库**：[github.com/autional-cn/status](https://github.com/autional-cn/status)

各微服务的实时可用性与历史事件。

## 开发

```bash
pnpm install
pnpm dev      # http://localhost:13106
pnpm build    # 构建产物：apps/status-page/dist/
pnpm test     # Vitest 单元测试
```

## 部署

推送至 `main` 分支后由 Vercel 自动部署。
