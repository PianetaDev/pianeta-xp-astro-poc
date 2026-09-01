import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const COLLECTIONS = ['work', 'lab', 'bulletin', 'services', 'careers', 'team'];

function isDraft(fileContents) {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return false;
  return /^draft:\s*true\s*$/m.test(match[1]);
}

export function getDraftPaths(contentRoot = join(__dirname, '..', 'src', 'content')) {
  const paths = new Set();
  for (const collection of COLLECTIONS) {
    const dir = join(contentRoot, collection);
    let files;
    try {
      files = readdirSync(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const contents = readFileSync(join(dir, file), 'utf-8');
      if (!isDraft(contents)) continue;
      const isEn = file.endsWith('.en.md');
      const slug = file.replace(/\.en\.md$/, '').replace(/\.md$/, '');
      paths.add(isEn ? `/en/${collection}/${slug}` : `/${collection}/${slug}`);
    }
  }
  return paths;
}
