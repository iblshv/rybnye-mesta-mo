#!/usr/bin/env bash
set -euo pipefail

PATH=/usr/bin:/bin
export PATH

release_id=${1:-}
expected_sha=${2:-}
expected_html_count=${3:-}

[[ "$release_id" =~ ^[A-Za-z0-9._-]+$ ]]
[[ "$expected_sha" =~ ^[a-f0-9]{64}$ ]]
[[ "$expected_html_count" =~ ^[0-9]+$ ]]

readonly deploy_base="/var/www/u3576558/data/www"
readonly live_dir="${deploy_base}/fishno.ru"
readonly release_dir="${deploy_base}/fishno.ru.release-${release_id}"
readonly archive="${deploy_base}/.fishno-release-${release_id}.tar.gz"
readonly backup_dir="${deploy_base}/fishno.ru.backup-$(date +%Y%m%d-%H%M%S)-${release_id}"

cleanup() {
  rm -f -- "$archive"
  if [[ -d "$release_dir" ]]; then
    rm -rf -- "$release_dir"
  fi
}
trap cleanup EXIT

test -d "$live_dir"
test -f "$archive"
test ! -e "$release_dir"
test ! -e "$backup_dir"

archive_size=$(stat -c '%s' "$archive")
(( archive_size > 0 && archive_size <= 104857600 ))

while IFS= read -r entry; do
  case "$entry" in
    ''|/*|..|../*|*/..|*/../*)
      printf 'Unsafe archive path: %s\n' "$entry" >&2
      exit 1
      ;;
  esac
done < <(tar -tzf "$archive")

if ! tar -tvzf "$archive" | awk '
  substr($1, 1, 1) != "-" && substr($1, 1, 1) != "d" { exit 1 }
'; then
  printf 'Archive may contain only regular files and directories.\n' >&2
  exit 1
fi

mkdir -- "$release_dir"
tar --no-same-owner --no-same-permissions -xzf "$archive" -C "$release_dir"

test -z "$(find "$release_dir" ! -type f ! -type d -print -quit)"
test -f "$release_dir/index.html"
test -f "$release_dir/robots.txt"
test -f "$release_dir/sitemap.xml"

actual_sha=$(sha256sum "$release_dir/index.html" | awk '{print $1}')
actual_html_count=$(find "$release_dir" -type f -name '*.html' | wc -l | tr -d ' ')
test "$actual_sha" = "$expected_sha"
test "$actual_html_count" = "$expected_html_count"

find "$release_dir" -type d -exec chmod 755 {} +
find "$release_dir" -type f -exec chmod 644 {} +

mv -- "$live_dir" "$backup_dir"
if ! mv -- "$release_dir" "$live_dir"; then
  mv -- "$backup_dir" "$live_dir"
  exit 1
fi

rm -f -- "$archive"
trap - EXIT
printf 'backup=%s\n' "$backup_dir"
