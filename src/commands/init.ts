import fs from 'node:fs/promises';
import path from 'node:path';

interface InitOptions {
  dir: string;
  scope?: string;
}

export async function initCommand({ dir, scope }: InitOptions) {
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created folder: ${dir}`);

    const pkgJson = {
      name: scope ? `${scope}/tsconfig` : 'tsconfig',
      version: '1.0.0',
      private: true,
    };

    const pkgPath = path.join(dir, 'package.json');
    await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2));
    console.log(`Created ${pkgPath}`);

    const variants = {
      'base.json': {
        $schema: 'https://json.schemastore.org/tsconfig',
        compilerOptions: {
          target: 'ESNext',
          module: 'ESNext',
          strict: true,
        },
      },
      'node.json': {
        extends: './base.json',
        compilerOptions: {
          moduleResolution: 'node',
        },
      },
      'react.json': {
        extends: './base.json',
        compilerOptions: {
          jsx: 'react-jsx',
        },
      },
      'next.json': {
        extends: './react.json',
        compilerOptions: {
          moduleResolution: 'bundler',
        },
      },
    };

    for (const [filename, config] of Object.entries(variants)) {
      const filePath = path.join(dir, filename);
      await fs.writeFile(filePath, JSON.stringify(config, null, 2));
      console.log(`Created ${filePath}`);
    }
  } catch (err) {
    console.error('Error in initCommand:', err);
    throw err;
  }
}
