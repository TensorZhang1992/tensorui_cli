# @tensor-ui/core 打包流程文档

## 概述

将任意设计系统源码（shadcn/ui 风格）编译为私有 npm 包 `@tensor-ui/core`，用于 tensor_ui_cli 的 scaffold 分发。

**输入**：一个完整的 Next.js + shadcn/ui 设计系统项目  
**输出**：`tensor-ui-core-0.1.0.tgz`（编译后的组件包，无 TSX 源码）

---

## 前置条件

- Node.js >= 18
- 设计系统源码结构：

```
<design-system>/
├── app/
│   ├── globals.css       ← CSS 变量 + Tailwind
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               ← shadcn/ui 组件 (*.tsx)
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   └── utils.ts          ← cn() 工具函数
├── package.json
└── AGENT.md              ← 设计规则（可选）
```

---

## Step 1: 初始化 packages/core 目录

```bash
cd /path/to/tensor_ui_cli
mkdir -p packages/core/src/{components/ui,lib}
mkdir -p packages/core/scripts
```

## Step 2: 复制源文件

```bash
SOURCE="/path/to/design-system"

# 组件
cp "$SOURCE/components/ui/"*.tsx packages/core/src/components/ui/
cp "$SOURCE/components/ui/"*.ts packages/core/src/components/ui/ 2>/dev/null

# theme-provider & theme-toggle
cp "$SOURCE/components/theme-provider.tsx" packages/core/src/components/
cp "$SOURCE/components/theme-toggle.tsx" packages/core/src/components/

# lib/utils
cp "$SOURCE/lib/utils.ts" packages/core/src/lib/

# globals.css
cp "$SOURCE/app/globals.css" packages/core/src/globals.css
```

## Step 3: 改写 import 路径

组件内部使用 `@/components/ui/X`、`@/lib/utils`、`@/hooks/X` 等路径别名，需要改为相对路径：

```bash
cd packages/core/src

# components/ui/ 内的文件
find components/ui/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s|from '@/lib/utils'|from '../../lib/utils'|g" \
  -e "s|from \"@/lib/utils\"|from \"../../lib/utils\"|g" \
  -e "s|from '@/components/ui/\([^']*\)'|from './\1'|g" \
  -e "s|from \"@/components/ui/\([^\"]*\)\"|from \"./\1\"|g" \
  -e "s|from '@/hooks/\([^']*\)'|from './\1'|g" \
  -e "s|from \"@/hooks/\([^\"]*\)\"|from \"./\1\"|g" \
  {} \;

# components/theme-*.tsx 内的文件
sed -i '' \
  -e "s|from '@/lib/utils'|from '../lib/utils'|g" \
  -e "s|from '@/components/ui/\([^']*\)'|from './ui/\1'|g" \
  components/theme-provider.tsx components/theme-toggle.tsx

# 验证
grep -r "from '@/" components/ lib/ && echo "ERROR: 还有未改写的路径!" || echo "✓ 全部改写完成"
```

## Step 4: 生成 index.ts（统一导出）

```bash
cd packages/core/src

# 自动生成 index.ts
{
  echo "export * from './lib/utils'"
  echo ""
  for f in components/ui/*.tsx components/ui/*.ts; do
    [ -f "$f" ] || continue
    name=$(basename "$f" | sed 's/\.\(tsx\|ts\)$//')
    echo "export * from './components/ui/$name'"
  done
  echo ""
  echo "export * from './components/theme-provider'"
  echo "export * from './components/theme-toggle'"
} > index.ts
```

> **注意**：如果多个组件导出同名（如 `Toaster`），需要手动处理重名：
> ```ts
> export { Toaster as SonnerToaster } from './components/ui/sonner'
> export { Toaster } from './components/ui/toaster'
> ```

## Step 5: 配置文件

### `packages/core/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### `packages/core/tsup.config.ts`

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/lib/utils.ts',
    'src/components/ui/*.tsx',
    'src/components/ui/*.ts',
    'src/components/theme-provider.tsx',
    'src/components/theme-toggle.tsx',
  ],
  format: ['esm'],
  dts: true,
  bundle: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.jsxImportSource = 'react'
  },
  onSuccess: 'node scripts/postbuild.cjs',
})
```

### `packages/core/scripts/postbuild.cjs`

```js
const fs = require('fs')

fs.copyFileSync('src/globals.css', 'dist/globals.css')

// index.js 和 utils.js 不需要 "use client"（barrel 文件 + 纯工具函数）
for (const f of ['dist/index.js', 'dist/lib/utils.js']) {
  let c = fs.readFileSync(f, 'utf8')
  c = c.replace(/^"use client";\n?/, '')
  fs.writeFileSync(f, c)
}

console.log('Post-build done')
```

### `packages/core/package.json`

```json
{
  "name": "@tensor-ui/core",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./globals.css": "./dist/globals.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "pack:tgz": "npm run build && npm pack"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-alert-dialog": "1.1.4",
    "@radix-ui/react-aspect-ratio": "1.1.1",
    "@radix-ui/react-avatar": "1.1.2",
    "@radix-ui/react-checkbox": "1.1.3",
    "@radix-ui/react-collapsible": "1.1.2",
    "@radix-ui/react-context-menu": "2.2.4",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-hover-card": "1.1.4",
    "@radix-ui/react-label": "2.1.1",
    "@radix-ui/react-menubar": "1.1.4",
    "@radix-ui/react-navigation-menu": "1.2.3",
    "@radix-ui/react-popover": "1.1.4",
    "@radix-ui/react-progress": "1.1.1",
    "@radix-ui/react-radio-group": "1.2.2",
    "@radix-ui/react-scroll-area": "1.2.2",
    "@radix-ui/react-select": "2.1.4",
    "@radix-ui/react-separator": "1.1.1",
    "@radix-ui/react-slider": "1.2.2",
    "@radix-ui/react-slot": "1.1.1",
    "@radix-ui/react-switch": "1.1.2",
    "@radix-ui/react-tabs": "1.1.2",
    "@radix-ui/react-toast": "1.2.4",
    "@radix-ui/react-toggle": "1.1.1",
    "@radix-ui/react-toggle-group": "1.1.1",
    "@radix-ui/react-tooltip": "1.1.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "embla-carousel-react": "8.5.1",
    "input-otp": "1.4.1",
    "lucide-react": "^0.454.0",
    "react-day-picker": "9.8.0",
    "react-hook-form": "^7.60.0",
    "react-resizable-panels": "^2.1.7",
    "sonner": "^1.7.4",
    "tailwind-merge": "^3.3.1",
    "vaul": "^1.1.2"
  },
  "peerDependencies": {
    "next-themes": "^0.4.0",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "recharts": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tsup": "^8.0.0",
    "typescript": "^5"
  }
}
```

> **注意**：`dependencies` 里的包版本要和设计系统源的 `package.json` 保持一致。不同设计系统可能用不同版本的 Radix 等库。

## Step 6: 安装依赖并构建

```bash
cd packages/core
npm install
npm run build
npm pack
```

产出 `tensor-ui-core-0.1.0.tgz`。

## Step 7: 部署到 CLI

```bash
cp packages/core/tensor-ui-core-0.1.0.tgz assets/
```

---

## CLI scaffold 逻辑要点

scaffold 时 CLI 自动执行：

1. **跳过** `components/` 和 `lib/` 目录（不复制源码）
2. **复制** .tgz 到项目 → `npm install ./tensor-ui-core-0.1.0.tgz`
3. **改写 import**：`@/components/ui/X` → `@tensor-ui/core`
4. **注入 Tailwind 扫描**：在 `globals.css` 头部加 `@source "../node_modules/@tensor-ui/core/dist";`

---

## 批量处理脚本（一键打包）

```bash
#!/bin/bash
# build-core.sh <design-system-path>
# 用法: ./build-core.sh /path/to/My-design-system

set -e

SOURCE="$1"
CORE_DIR="packages/core"

if [ -z "$SOURCE" ] || [ ! -d "$SOURCE/components/ui" ]; then
  echo "Usage: $0 <design-system-path>"
  echo "  The path must contain components/ui/ directory"
  exit 1
fi

echo "=== 清理旧文件 ==="
rm -rf "$CORE_DIR/src/components/ui/"*
rm -f "$CORE_DIR/src/components/theme-provider.tsx"
rm -f "$CORE_DIR/src/components/theme-toggle.tsx"
rm -f "$CORE_DIR/src/lib/utils.ts"
rm -f "$CORE_DIR/src/globals.css"

echo "=== 复制源文件 ==="
cp "$SOURCE/components/ui/"*.tsx "$CORE_DIR/src/components/ui/"
cp "$SOURCE/components/ui/"*.ts "$CORE_DIR/src/components/ui/" 2>/dev/null || true
cp "$SOURCE/components/theme-provider.tsx" "$CORE_DIR/src/components/" 2>/dev/null || true
cp "$SOURCE/components/theme-toggle.tsx" "$CORE_DIR/src/components/" 2>/dev/null || true
cp "$SOURCE/lib/utils.ts" "$CORE_DIR/src/lib/"
cp "$SOURCE/app/globals.css" "$CORE_DIR/src/globals.css"

echo "=== 改写 import 路径 ==="
cd "$CORE_DIR/src"

find components/ui/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s|from '@/lib/utils'|from '../../lib/utils'|g" \
  -e "s|from \"@/lib/utils\"|from \"../../lib/utils\"|g" \
  -e "s|from '@/components/ui/\([^']*\)'|from './\1'|g" \
  -e "s|from \"@/components/ui/\([^\"]*\)\"|from \"./\1\"|g" \
  -e "s|from '@/hooks/\([^']*\)'|from './\1'|g" \
  -e "s|from \"@/hooks/\([^\"]*\)\"|from \"./\1\"|g" \
  {} \;

if [ -f components/theme-provider.tsx ]; then
  sed -i '' \
    -e "s|from '@/lib/utils'|from '../lib/utils'|g" \
    -e "s|from '@/components/ui/\([^']*\)'|from './ui/\1'|g" \
    components/theme-provider.tsx
fi

if [ -f components/theme-toggle.tsx ]; then
  sed -i '' \
    -e "s|from '@/lib/utils'|from '../lib/utils'|g" \
    -e "s|from '@/components/ui/\([^']*\)'|from './ui/\1'|g" \
    components/theme-toggle.tsx
fi

# 验证
if grep -r "from '@/" components/ lib/ 2>/dev/null; then
  echo "WARNING: 还有未改写的 @/ 路径"
fi

echo "=== 生成 index.ts ==="
{
  echo "export * from './lib/utils'"
  echo ""
  for f in components/ui/*.tsx components/ui/*.ts; do
    [ -f "$f" ] || continue
    name=$(basename "$f" | sed 's/\.\(tsx\|ts\)$//')
    echo "export * from './components/ui/$name'"
  done
  echo ""
  [ -f components/theme-provider.tsx ] && echo "export * from './components/theme-provider'"
  [ -f components/theme-toggle.tsx ] && echo "export * from './components/theme-toggle'"
} > index.ts

cd ../..

echo "=== 构建 ==="
npm run build

echo "=== 打包 ==="
rm -f tensor-ui-core-0.1.0.tgz
npm pack

echo "=== 部署到 assets ==="
cp tensor-ui-core-0.1.0.tgz ../../assets/

echo ""
echo "✓ 完成！产物: assets/tensor-ui-core-0.1.0.tgz"
echo "  运行 'cd ../.. && npx tsup' 重建 CLI"
```

---

## 注意事项

1. **导出冲突**：如果多个组件导出同名 symbol（如 `Toaster`），需要手动在 `index.ts` 里用 `export { X as Y }` 重命名

2. **依赖版本**：不同设计系统可能依赖不同版本的 Radix UI 等库，需要更新 `package.json` 中的 `dependencies`

3. **Tailwind v4**：scaffold 后必须在 `globals.css` 加 `@source "../node_modules/@tensor-ui/core/dist";`，否则组件样式丢失

4. **Linux 兼容**：`sed -i ''` 是 macOS 写法，Linux 上改为 `sed -i`

5. **hooks 文件**：某些设计系统把 hooks 放在 `hooks/` 目录而非 `components/ui/`，需要额外复制：
   ```bash
   cp "$SOURCE/hooks/"*.ts "$CORE_DIR/src/components/ui/" 2>/dev/null || true
   ```
