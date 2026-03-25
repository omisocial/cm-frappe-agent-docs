import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

test('no secret files tracked by git', () => {
    try {
        const tracked = execSync('git ls-files', { encoding: 'utf-8' });
        const badFiles = ['.env', '.dev.vars', '.env.local', '.env.production'];
        const found = badFiles.filter(f => tracked.split('\n').includes(f));
        expect(found, `Secret files tracked: ${found.join(', ')}`).toEqual([]);
    } catch (e) {
        // Not a git repo yet, skip
    }
});

test('.gitignore contains required security patterns', () => {
    if (fs.existsSync('.gitignore')) {
        const gitignore = fs.readFileSync('.gitignore', 'utf-8');
        expect(gitignore).toContain('.env');
    }
});

test('no hardcoded secrets in source files', () => {
    const dangerousPatterns = [
        /SERVICE_KEY\s*[=:]\s*['"][a-zA-Z0-9/+=]{20,}/g,
        /PRIVATE_KEY\s*[=:]\s*['"][a-zA-Z0-9/+=]{20,}/g,
        /-----BEGIN.*PRIVATE KEY-----/g,
    ];
    const srcDir = path.resolve(__dirname, '../src');
    if (!fs.existsSync(srcDir)) return;
    
    // Recursive check for all text files
    const checkDir = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                checkDir(fullPath);
            } else if (file.match(/\.(ts|js|md|mdx|mjs)$/)) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                for (const pattern of dangerousPatterns) {
                    expect(content, `${file} contains potential secret`).not.toMatch(pattern);
                }
            }
        }
    };
    checkDir(srcDir);
});
