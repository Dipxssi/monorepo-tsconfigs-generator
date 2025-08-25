import { describe, it, expect, beforeAll } from "vitest";
import { execa } from "execa";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const cliPath = path.resolve('./bin/cli.js')

async function makeTempDir(prefix = 'ttg-') {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  return tmp;
}

describe('init command', () => {
  let cwd;
  beforeAll(async () => {
    cwd = await makeTempDir();
  });

  it('creates a shared tsconfig package with variants', async () => {
    const res = await execa('node', [cliPath, 'init', '--scope', '@acme', '--dir', 'packages/tsconfig'], {
      cwd,
      reject: false
    });
    expect(res.exitCode).toBe(0);

    const dir = path.join(cwd, 'packages/tsconfig');
    const files = await fs.readdir(dir);

    expect(files).toContain('package.json');
    expect(files).toContain('base.json');
    expect(files).toContain('node.json');
    expect(files).toContain('react.json');
    expect(files).toContain('next.json');

    const pkg = JSON.parse(await fs.readFile(path.join(dir, 'package.json'), 'utf8'));
    expect(pkg.name).toBe('@acme/tsconfig');

  })

})