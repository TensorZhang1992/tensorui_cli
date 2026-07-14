<div align="center">

# TensorUI CLI

**Design System AI Terminal — Generate beautiful pages with design constraints**

[English](#english) · [中文](#中文)

[![npm](https://img.shields.io/npm/v/@tensorzhang/tensorui)](https://www.npmjs.com/package/@tensorzhang/tensorui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

<a id="english"></a>

## What is TensorUI CLI?

TensorUI CLI is an AI-powered terminal tool that generates UI pages following your design system constraints. It uses the [Claude Agent SDK](https://github.com/anthropics/claude-code) under the hood and integrates with an MCP (Model Context Protocol) design system server — so the AI always follows your brand tokens, layout rules, and component API.

### Features

- **Design-constrained generation** — AI follows your AGENT.md design rules, not generic patterns
- **MCP design system server** — brand colors, typography, spacing, and component specs are injected via MCP tools
- **Session resume** — pick up where you left off with `--continue` or `--resume <id>`
- **Provider-agnostic** — works with Anthropic, DeepSeek, or any Anthropic-compatible API
- **Interactive terminal UI** — built with [Ink](https://github.com/vadimdemedes/ink) for a smooth CLI experience

### Quick Start

```bash
# Install globally
npm install -g @tensorzhang/tensorui

# Set up your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Clone a design system and start generating
tensorui
/clone https://your-tensorui-instance.com/api/projects/xxx/download

# Now just type naturally
❯ Create a pricing page with 3-column comparison
❯ Add a dashboard with user growth chart
```

### Configuration

Create a `.env` file in the same directory as the CLI (or the project directory):

```env
# Required
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

You can also pass options via CLI flags:

```bash
tensorui --api-key sk-ant-... --model claude-sonnet-4-20250514
tensorui --continue          # Resume last session
tensorui --resume <id>       # Resume specific session
```

### Commands

| Command | Description |
|---------|-------------|
| `/clone <url>` | Clone a design system from a URL |
| `/model [name]` | Show or switch the current model |
| `/config [key val]` | View or update configuration |
| `/resume` | List and select a recent session |
| `/help` | Show help message |

### How It Works

1. **Export** a design system from [TensorUI Studio](https://tensorui.cn) to your project library
2. **Copy** the project download URL from the project library
3. **Clone** it locally with `/clone <url>` — this extracts the design tokens, component rules, and AGENT.md
4. **Generate** pages by typing natural language — the AI reads your design system via MCP and follows all constraints

---

<a id="中文"></a>

## TensorUI CLI 是什么？

TensorUI CLI 是一个 AI 驱动的终端工具，根据你的设计系统约束生成 UI 页面。底层使用 [Claude Agent SDK](https://github.com/anthropics/claude-code)，并集成了 MCP（模型上下文协议）设计系统服务器 — AI 始终遵循你的品牌色彩、排版规则和组件 API。

### 特性

- **设计约束生成** — AI 遵循 AGENT.md 设计规则，而非通用模式
- **MCP 设计系统服务器** — 品牌色、字体、间距和组件规范通过 MCP 工具注入
- **会话恢复** — 使用 `--continue` 或 `--resume <id>` 继续上次的工作
- **多供应商支持** — 兼容 Anthropic、DeepSeek 或任何 Anthropic 兼容 API
- **交互式终端界面** — 基于 [Ink](https://github.com/vadimdemedes/ink) 构建

### 快速开始

```bash
# 全局安装
npm install -g @tensorzhang/tensorui

# 配置 API 密钥
cp .env.example .env
# 编辑 .env，填入你的 ANTHROPIC_API_KEY

# 克隆设计系统并开始生成
tensorui
/clone https://your-tensorui-instance.com/api/projects/xxx/download

# 用自然语言描述你想要的页面
❯ 创建一个定价页面，三栏对比
❯ 给 dashboard 加一个用户增长折线图
```

### 配置

在 CLI 所在目录或项目目录创建 `.env` 文件：

```env
# 必填
ANTHROPIC_API_KEY=sk-ant-api03-...

# 选填
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

也可以通过命令行参数传入：

```bash
tensorui --api-key sk-ant-... --model claude-sonnet-4-20250514
tensorui --continue          # 恢复上次会话
tensorui --resume <id>       # 恢复指定会话
```

### 命令

| 命令 | 说明 |
|------|------|
| `/clone <url>` | 从 URL 克隆设计系统 |
| `/model [name]` | 查看或切换当前模型 |
| `/config [key val]` | 查看或更新配置 |
| `/resume` | 列出并选择最近的会话 |
| `/help` | 显示帮助信息 |

### 工作流程

1. 在 [TensorUI Studio](https://tensorui.cn) 中**导出**设计系统到项目库
2. 从项目库**复制**项目下载链接
3. 使用 `/clone <url>` **克隆**到本地 — 会解压设计令牌、组件规则和 AGENT.md
4. 输入自然语言**生成**页面 — AI 通过 MCP 读取你的设计系统并遵循所有约束

---

## Community / 社区

- [Telegram](https://t.me/tensorui)
- [Discord](https://discord.gg/tensorui)
- [X (Twitter)](https://x.com/tensorui)

## License / 许可证

[MIT](LICENSE)
