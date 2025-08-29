import fs from 'node:fs/promises';
import path from 'node:path';

type AppType = 'backend' | 'websocket' | 'nextjs';

interface AppOptions {
  name: string;
  type: AppType;
}

const appTemplates: Record<AppType, {
  dependencies: string[];
  tsconfig: string;
  structure: string[];
}> = {
  backend: {
    dependencies: ['express', '@types/express', 'dotenv'],
    tsconfig: 'node.json',
    structure: ['src'],
  },
  websocket: {
    dependencies: ['ws', '@types/ws'],
    tsconfig: 'node.json',
    structure: ['src'],
  },
  nextjs: {
    dependencies: ['next', 'react', '@types/react'],
    tsconfig: 'next.json',
    structure: ['src', 'public'],
  },
};

export async function appCommand(options: AppOptions) {
  const { name, type } = options;

  if (!appTemplates[type]) {
    throw new Error(`Unknown app type: ${type}`);
  }

  const template = appTemplates[type];

  const appDir = path.join('apps', name);

  await fs.mkdir(appDir, { recursive: true });
  for (const subDir of template.structure) {
    await fs.mkdir(path.join(appDir, subDir), { recursive: true });
  }

  const pkgJson = {
    name: name,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
    },
    dependencies: {} as Record<string, string>,
  };

  template.dependencies.forEach(dep => {
    pkgJson.dependencies[dep] = '*';
  });

  await fs.writeFile(path.join(appDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

  const tsconfig = {
    extends: `../../packages/tsconfig/${template.tsconfig}`,
    compilerOptions: {
      rootDir: './src',
      outDir: './dist',
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  await fs.writeFile(path.join(appDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

  console.log(`App ${name} (${type}) created at ${appDir}`);
}
