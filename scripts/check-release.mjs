import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const check = (condition, message) => { if (!condition) throw new Error(message); };
const parse = value => {
  check(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value), `Invalid release version: ${value}`);
  return value.split('.').map(Number);
};
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const [major, minor, patch] = parse(version);
const tag = `v${version}`;
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
check(lock.version === version && lock.packages[''].version === version, 'package-lock.json has a different version.');
const html = readFileSync('src/index.html', 'utf8');
for (const asset of ['styles.css', 'app.js']) {
  check(html.includes(`./${asset}?v=${version}`), `Update the version of ${asset} in src/index.html.`);
}
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const heading = `## [${version}]`;
check(changelog.split('\n').find(line => line.startsWith('## ['))?.trim() === heading, 'The newest changelog entry must match package.json.');
const notes = changelog.slice(changelog.indexOf(heading) + heading.length).split(/\r?\n## /)[0].trim();
check(notes.length > 0, `Add release notes for ${tag} to CHANGELOG.md.`);

const tags = git('tag', '--list', 'v*', '--sort=-version:refname').split('\n').filter(Boolean);
const head = git('rev-parse', 'HEAD');
if (tags.includes(tag)) {
  check(git('rev-list', '-n', '1', tag) === head, `${tag} already belongs to a different commit. Bump the version.`);
} else {
  const previousTag = tags.find(value => /^v\d+\.\d+\.\d+$/.test(value));
  const baseIndex = process.argv.indexOf('--base');
  // Several commits may prepare one release before its first successful publication.
  const previousVersionCommit = !previousTag && baseIndex < 0
    ? git('log', '--format=%H', '--', 'package.json').split('\n')
      .find(ref => JSON.parse(git('show', `${ref}:package.json`)).version !== version)
    : null;
  const base = baseIndex >= 0 ? process.argv[baseIndex + 1] : previousTag || previousVersionCommit;
  check(Boolean(base), 'A previous version or an explicit --base Git ref is required.');
  if (previousTag && base === previousTag) git('merge-base', '--is-ancestor', previousTag, 'HEAD');
  const previousVersion = JSON.parse(git('show', `${base}:package.json`)).version;
  const [oldMajor, oldMinor, oldPatch] = parse(previousVersion);
  check(
    (major === oldMajor && minor === oldMinor && patch === oldPatch + 1) ||
    (major === oldMajor && minor === oldMinor + 1 && patch === 0) ||
    (major === oldMajor + 1 && minor === 0 && patch === 0),
    `${version} must be the next patch, minor or major after ${previousVersion}.`
  );
  console.log(`Version: ${previousVersion} -> ${version}`);
}
mkdirSync('.release', { recursive: true });
writeFileSync('.release/notes.md', `${notes}\n`);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `tag=${tag}\n`);
console.log(`Release ready: ${tag}`);
