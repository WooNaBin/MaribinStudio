const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const screenshotsDir = path.join(root, 'screenshots');
const outputPath = path.join(root, 'dc-screenshots.html');

const exts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => exts.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'en'));
}

const files = listImages(screenshotsDir);

const heading = '<section class="dc-section">\n' +
  '  <h2>스크린샷</h2>\n' +
  '  <p>스크린샷 폴더에 추가한 이미지가 자동으로 표시됩니다.</p>\n' +
  '  <div class="dc-shots">\n';

const footer = '  </div>\n</section>\n';

let body = '';
if (files.length === 0) {
  body = '    <p>아직 등록된 스크린샷이 없습니다. `screenshots/`에 이미지를 추가해 주세요.</p>\n';
} else {
  body = files
    .map((file, index) => {
      const label = String(index + 1).padStart(2, '0');
      const src = `screenshots/${file}`;
      const alt = `Dice Crusader screenshot ${label}`;
      return (
        '    <figure class="dc-shot">\n' +
        `      <img src="${src}" alt="${alt}">\n` +
        `      <span>${label}</span>\n` +
        '    </figure>\n'
      );
    })
    .join('');
}

fs.writeFileSync(outputPath, heading + body + footer, 'utf8');
console.log(`Generated ${path.relative(root, outputPath)} with ${files.length} screenshot(s).`);
