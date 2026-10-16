# Hearth — 家居商城演示

一个面向海外消费者的极简家居选购 Web 应用：浏览商品 → 搜索/筛选/排序 → 商品详情 → 购物车 → 模拟结账。全英文 UI、USD 定价、内置模拟数据，桌面与移动端体验完整。

> Demo store — checkout is simulated and no payment is taken.

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Next.js 16.4.2（App Router，`cacheComponents` + Partial Prefetching） |
| UI | React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui（radix-nova） |
| 服务端状态 | TanStack Query v5（缓存/重试/`useSuspenseQuery` + Suspense 骨架） |
| 客户端状态 | Zustand v5 + `persist`（购物车，localStorage 持久化） |
| 反馈 | sonner（加购 toast） |
| 字体 | Fraunces（展示标题）+ Geist（正文/UI），`next/font` 自托管 |
| 包管理 | Bun 1.4.2 |

## 快速开始

```bash
bun install     # 安装依赖
bun dev         # 启动开发服务器 → http://localhost:3000
bun run build   # 生产构建（静态预渲染 + 类型检查）
bun start       # 启动生产服务
```

无任何环境变量要求；商品图片已随仓库提交（`public/products/`），运行时不依赖外部图床。

## 目录结构

```
app/
  layout.tsx              # 字体、metadata、Header/Footer/CartSheet/Toaster
  providers.tsx           # QueryClient Provider（浏览器单例 / 服务端每渲染新建）
  page.tsx                # 首页：Hero + Suspense > CatalogView
  products/[id]/page.tsx  # 详情：generateStaticParams + await params + notFound
  checkout/page.tsx       # 结账（表单 → 成功态）+ 空购物车守卫
  not-found.tsx           # 定制 404
  globals.css             # 主题 tokens（暖白/炭黑/陶土）+ 工具类 + 入场动画
components/
  layout/                 # header、footer、search-field、cart-button
  catalog/                # catalog-view、catalog-toolbar、product-card、骨架、移动吸底搜索
  product/                # detail 视图、qty-stepper、related-products、star-rating
  cart/                   # cart-sheet、cart-line、shipping-progress
  checkout/               # checkout-view（表单校验 + 成功态）
  query-error-boundary.tsx# 查询失败重试面板
lib/
  types.ts                # 领域类型 + 分类/排序常量
  products.ts             # 12 件商品（4 分类 × 3）静态数据
  api.ts                  # 模拟 API（300–600ms 延迟），可无缝替换真实 HTTP
  queries.ts              # TanStack Query 契约（queryKey/queryOptions）
  store/cart.ts           # Zustand + persist 购物车 store
  format.ts               # Intl USD 货币格式化
hooks/use-hydrated.ts     # 持久化状态的水合守卫
public/products/*.png     # AI 生成的统一暖白影棚风格商品图
docs/                     # PRD、交付说明与实测截图
```

## 关键设计

- **URL 是筛选的唯一事实来源**：`q` / `category` / `sort` 全部放在 searchParams，可分享、可前进后退；搜索框 300ms 防抖。
- **数据层可替换**：页面只依赖 `lib/queries.ts` 的契约；把 `lib/api.ts` 里的模拟函数换成 `fetch("/api/...")` 即可接真实后端。
- **Suspense 边界分层**：页面级骨架覆盖首屏；筛选变化时仅结果区落入结果级骨架，工具栏保持可交互。
- **水合安全**：购物车角标、抽屉、结账摘要均以 `useHydrated` 守卫，避免 localStorage 与 SSR 的不一致。
- **设计约定**：陶土色（`--clay`）仅用于"注意力信号"——促销价、Sale 徽标、购物车角标、免运费进度、焦点环。

## 文档

- [docs/PRD.md](docs/PRD.md) — 产品需求与范围
- [docs/交付说明.md](docs/交付说明.md) — 完成内容、实测场景、已知问题、取舍与录屏脚本
