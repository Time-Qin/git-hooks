import { execSync } from 'child_process'

export function getStagedDiff() {
  return execSync(
    // 'git diff --cached --diff-filter=ACM',
    "git diff --cached -- '*.ts' '*.js'",
    { encoding: 'utf-8' }
  )
}