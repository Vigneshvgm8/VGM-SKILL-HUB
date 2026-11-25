import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { ZipArchive } = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const adminDistDir = path.join(rootDir, 'dist-admin');
const frontendZip = path.join(rootDir, 'frontend-build.zip');
const adminZip = path.join(rootDir, 'adminweb-build.zip');

console.log('[PACKAGE] Packaging Frontend and Adminweb using archiver (POSIX forward slashes)...');

if (!fs.existsSync(distDir)) {
  console.error('[PACKAGE ERROR] dist/ folder not found. Run npm run build:frontend first.');
  process.exit(1);
}

if (!fs.existsSync(adminDistDir)) {
  console.error('[PACKAGE ERROR] dist-admin/ folder not found. Run npm run build:admin first.');
  process.exit(1);
}

// 1. Ensure .htaccess and _redirects are in both dist folders
const frontendHtaccess = path.join(rootDir, 'Frontend/public/.htaccess');
const adminHtaccess = path.join(rootDir, 'Adminweb/public/.htaccess');
const frontendRedirects = path.join(rootDir, 'Frontend/public/_redirects');
const adminRedirects = path.join(rootDir, 'Adminweb/public/_redirects');

if (fs.existsSync(frontendHtaccess)) {
  fs.copyFileSync(frontendHtaccess, path.join(distDir, '.htaccess'));
  console.log('[PACKAGE] Verified .htaccess in dist/');
}
if (fs.existsSync(adminHtaccess)) {
  fs.copyFileSync(adminHtaccess, path.join(adminDistDir, '.htaccess'));
  console.log('[PACKAGE] Verified .htaccess in dist-admin/');
}
if (fs.existsSync(frontendRedirects)) {
  fs.copyFileSync(frontendRedirects, path.join(distDir, '_redirects'));
  console.log('[PACKAGE] Verified _redirects in dist/');
}
if (fs.existsSync(adminRedirects)) {
  fs.copyFileSync(adminRedirects, path.join(adminDistDir, '_redirects'));
  console.log('[PACKAGE] Verified _redirects in dist-admin/');
}

function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    // Delete existing zip if present
    if (fs.existsSync(outPath)) {
      fs.unlinkSync(outPath);
    }

    const output = fs.createWriteStream(outPath);
    const archive = new ZipArchive({
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', () => {
      resolve();
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('[ZIP WARNING]', err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Recursively add directory contents with forward slashes
    archive.directory(sourceDir, false, (data) => {
      // Force POSIX forward slashes in all archive entries
      data.name = data.name.replace(/\\/g, '/');
      return data;
    });

    archive.finalize();
  });
}

async function run() {
  try {
    console.log('[PACKAGE] Compressing Frontend into frontend-build.zip...');
    await zipDirectory(distDir, frontendZip);

    console.log('[PACKAGE] Compressing Adminweb into adminweb-build.zip...');
    await zipDirectory(adminDistDir, adminZip);

    const fSize = (fs.statSync(frontendZip).size / (1024 * 1024)).toFixed(2);
    const aSize = (fs.statSync(adminZip).size / 1024).toFixed(1);

    console.log(`[PACKAGE SUCCESS] Standalone build archives created successfully:`);
    console.log(`  -> frontend-build.zip (${fSize} MB) -> ${frontendZip}`);
    console.log(`  -> adminweb-build.zip (${aSize} KB) -> ${adminZip}`);
  } catch (err) {
    console.error('[PACKAGE FAILED]', err);
    process.exit(1);
  }
}

run();
