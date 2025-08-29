import fs from 'node:fs/promises';
import path from 'node:path';

export async function syncCommand() {
  console.log(' Scanning workspace for packages and apps...');
  
  // Scan packages/ folder
  await syncPackages();
  
  // Scan apps/ folder  
  await syncApps();
  
  console.log(' Workspace sync complete!');
}

async function syncPackages() {
  try {
    const packagesDir = 'packages';
    const dirs = await fs.readdir(packagesDir, { withFileTypes: true });
    
    for (const dir of dirs) {
      if (dir.isDirectory() && dir.name !== 'tsconfig') {
        const packagePath = path.join(packagesDir, dir.name);
        await ensureTsconfigExists(packagePath, 'base.json');
        console.log(` Synced package: ${dir.name}`);
      }
    }
  } catch (error) {
    console.log(' No packages folder found, skipping...');
  }
}

async function syncApps() {
  try {
    const appsDir = 'apps';
    const dirs = await fs.readdir(appsDir, { withFileTypes: true });
    
    for (const dir of dirs) {
      if (dir.isDirectory()) {
        const appPath = path.join(appsDir, dir.name);
        await ensureTsconfigExists(appPath, 'node.json');
        console.log(` Synced app: ${dir.name}`);
      }
    }
  } catch (error) {
    console.log(' No apps folder found, skipping...');
  }
}

async function ensureTsconfigExists(folderPath: string, configType: string) {
  const tsconfigPath = path.join(folderPath, 'tsconfig.json');
  
  try {
    await fs.access(tsconfigPath);
  } catch {
    const relativePath = folderPath.startsWith('packages/') 
      ? '../tsconfig/' 
      : '../../packages/tsconfig/';
      
    const tsconfig = {
      extends: `${relativePath}${configType}`,
      compilerOptions: {
        rootDir: './src',
        outDir: './dist',
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    };

    await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log(`   Created tsconfig.json`);
  }
}
