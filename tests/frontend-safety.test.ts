import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

test('index.md does not contain catastrophic syntax corruption', () => {
    // 1. Read the raw file
    const content = fs.readFileSync(path.resolve(__dirname, '../docs/index.md'), 'utf-8');
    
    // 2. Syntax Validation (Check for broken template literals)
    expect(content).not.toMatch(/=\s*'[^']*\$\{t\(/);
    
    // 3. Delimiter consistency
    expect(content).not.toMatch(/t\('[^']*\`/);
    expect(content).not.toMatch(/t\(\`[^']*'\)/);
    
    // 4. HTML structure integrity
    expect(content).not.toMatch(/<\s+[a-zA-Z]/); // e.g., "< div"
    expect(content).not.toMatch(/<\/\s+[a-zA-Z]/); // e.g., "</ div"
    expect(content).not.toMatch(/--\s+>/); // e.g., "text-- >"
});
