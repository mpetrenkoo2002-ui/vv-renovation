const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const git = (...args) => cp.execFileSync('git', args, {cwd: root, encoding: 'utf8'});
const oldPhone = /778[-. ()]*266[-. ]*7999|647[-. ()]*834[-. ]*8017/;
const oldTel = '(?:\\+17782667999|\\+16478348017)';
const anchor = `<a\\b[^>]*\\bhref=["']tel:${oldTel}["'][^>]*>[\\s\\S]*?<\\/a>`;
function transform(source, file) {
  let result = source;
  if (file.endsWith('.html')) {
    // Collapse the two old adjacent call links into one, retaining its markup.
    result = result.replace(new RegExp(`(${anchor})\\s*${anchor}`, 'g'), '$1');
    result = result.replace(/(<div class="num">)(?:647-834-8017|778-266-7999)(<\/div>)\s*<div class="num">(?:647-834-8017|778-266-7999)<\/div>/g, '$1(778) 358-4010$2');
    result = result.replace(/js\/concrete-content\.js(?:\?v=[^"']*)?/g, 'js/concrete-content.js?v=20261101-phone');
  }
  for (const old of ['+17782667999', '+16478348017']) result = result.replaceAll(old, '+17783584010');
  for (const old of ['+1-778-266-7999', '+1-647-834-8017']) result = result.replaceAll(old, '+1-778-358-4010');
  for (const old of ['778-266-7999', '647-834-8017']) result = result.replaceAll(old, '(778) 358-4010');
  return result;
}
const files = [
  ...fs.readdirSync(root).filter(f => f.endsWith('.html')),
  ...['js', 'data'].flatMap(dir => fs.readdirSync(path.join(root, dir)).filter(f => /\.(js|json)$/.test(f)).map(f => `${dir}/${f}`)),
  'tests/lead-tracking.test.cjs'
];
const tracked = new Set(git('ls-files', '-z').split('\0'));
const report = [];
for (const file of files) {
  const original = fs.readFileSync(path.join(root, file), 'utf8');
  const updated = transform(original, file);
  if (original === updated) continue;
  if (oldPhone.test(updated)) throw Error(`Unconverted old number in ${file}`);
  if (process.argv.includes('--write')) {
    const backup = path.join(__dirname, 'before', file);
    if (fs.existsSync(backup)) throw Error(`Backup already exists: ${file}`);
    fs.mkdirSync(path.dirname(backup), {recursive: true});
    fs.writeFileSync(backup, original);
    fs.writeFileSync(path.join(root, file), updated);
  }
  report.push({file, tracked:tracked.has(file), oldCallLinks:(original.match(/href="tel:/g)||[]).length, newCallLinks:(updated.match(/href="tel:/g)||[]).length});
}
if (process.argv.includes('--stage')) {
  if (git('diff', '--cached', '--name-only').trim()) throw Error('Index must be empty before isolated staging');
  for (const file of files.filter(f => tracked.has(f))) {
    const original = git('show', `HEAD:${file}`);
    const updated = transform(original, file);
    if (original === updated) continue;
    const hash = cp.execFileSync('git', ['hash-object', '-w', '--stdin'], {cwd:root, input:updated, encoding:'utf8'}).trim();
    git('update-index', '--cacheinfo', `100644,${hash},${file}`);
  }
}
console.log(JSON.stringify(report, null, 2));
