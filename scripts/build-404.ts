/** Static hosts serve /404.html with HTTP 404 for unknown URLs (brief 5.1: 404 status). */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { DIST } from './lib/site';

const source = join(DIST, '404/index.html');
if (!existsSync(source)) throw new Error('Prerendered /404 page missing');
copyFileSync(source, join(DIST, '404.html'));
console.log('404.html written');
