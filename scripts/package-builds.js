import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const adminDistDir = path.join(rootDir, 'dist-admin');
const frontendZip = path.join(rootDir, 'frontend-build.zip');
const adminZip = path.join(rootDir, 'adminweb-build.zip');

console.log('[PACKAGE] Packaging Frontend and Adminweb build files into individual zip files...');

if (!fs.existsSync(distDir)) {
  console.error('[PACKAGE ERROR] dist/ folder not found. Run npm run build:frontend first.');
  process.exit(1);
}

if (!fs.existsSync(adminDistDir)) {
  console.error('[PACKAGE ERROR] dist-admin/ folder not found. Run npm run build:admin first.');
  process.exit(1);
}

const isWindows = process.platform === 'win32';

try {
  if (isWindows) {
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${distDir}/*' -DestinationPath '${frontendZip}' -Force"`, { stdio: 'inherit' });
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${adminDistDir}/*' -DestinationPath '${adminZip}' -Force"`, { stdio: 'inherit' });
  } else {
    execSync(`cd "${distDir}" && zip -r "${frontendZip}" ./*`, { stdio: 'inherit' });
    execSync(`cd "${adminDistDir}" && zip -r "${adminZip}" ./*`, { stdio: 'inherit' });
  }

  const fSize = (fs.statSync(frontendZip).size / (1024 * 1024)).toFixed(2);
  const aSize = (fs.statSync(adminZip).size / 1024).toFixed(1);

  console.log(`[PACKAGE SUCCESS] Standalone build files created:`);
  console.log(`  -> frontend-build.zip (${fSize} MB) -> ${frontendZip}`);
  console.log(`  -> adminweb-build.zip (${aSize} KB) -> ${adminZip}`);
} catch (err) {
  console.error('[PACKAGE FAILED]', err.message);
  process.exit(1);
}
