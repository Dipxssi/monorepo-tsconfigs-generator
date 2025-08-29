# turbo-tsconfig-gen

Automate TypeScript configuration in Turborepo monorepos

## Installation

```bash
npm install -g turbo-tsconfig-gen
```

## Quick Start

1. Initialize shared TypeScript configs:

```bash
turbo-tsconfig-gen init --scope @myorg
```

2. Create applications with proper configs:

```bash
turbo-tsconfig-gen app --name backend --type backend
turbo-tsconfig-gen app --name website --type nextjs
```

3. Auto-sync configs for existing folders:

```bash
mkdir -p packages/db/src
turbo-tsconfig-gen sync
```

## Commands

* **`init`** - Create shared tsconfig package with variants
* **`app`** - Scaffold new applications (backend, websocket, nextjs)
* **`sync`** - Auto-generate tsconfig.json for existing folders

## License

MIT
