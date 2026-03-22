import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const now = new Date();
const dateSlug = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const pubDate = `${dateSlug}T12:00:00`;

const filename = `${dateSlug}.mdx`;
const dir = 'src/content/blog';
const file = path.join(dir, filename);

if (fs.existsSync(file)) {
	console.error(`❌ Already exists: ${file}`);
	process.exit(1);
}

const content = `---
pubDate: ${pubDate}
---
`;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(file, content);
console.log(`✅ Created ${file}`);
execSync(`code ${file}`);
