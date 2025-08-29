#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { appCommand } from './commands/app.js';
 import {syncCommand} from './commands/sync.js';

const program = new Command();

program
  .name('turbo-tsconfig-gen')
  .description('CLI tool to generate Turborepo TypeScript configs')
  .version('1.0.0');

program.command('init')
  .description('Initialize base tsconfig package')
  .option('--dir <path>', 'Target directory', 'packages/tsconfig')
  .option('--scope <scope>', 'Package scope')
  .action(async (options) => {
    try {
      await initCommand(options);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.command('app')
  .description('Create new app with scaffolding')
  .requiredOption('--name <name>', 'App name')
  .requiredOption('--type <type>', 'App type (backend , websocket , nextjs')
  .action(async (options) => {
    await appCommand(options);
  });
  
  program.command('sync')
  .description('Sync tsconfig files for existing folders')
  .action(async () => {
    try {
      await syncCommand();
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });




program.parseAsync(process.argv);
