#!/usr/bin/env bash
set -euo pipefail

: "${FISHNO_SSH_PRIVATE_KEY:?FISHNO_SSH_PRIVATE_KEY is required}"

ssh_host="server17.hosting.reg.ru"
ssh_user="u3576558"
ssh_port="${FISHNO_SSH_PORT:-22}"
remote_base="/var/www/u3576558/data/www"
release_id="${GITHUB_SHA:-manual-$(date -u +%Y%m%d%H%M%S)}"
release_id="${release_id//[^a-zA-Z0-9._-]/-}"
remote_archive="${remote_base}/.fishno-release-${release_id}.tar.gz"
local_archive="${RUNNER_TEMP:-/tmp}/fishno-release-${release_id}.tar.gz"
key_file="${RUNNER_TEMP:-/tmp}/fishno-deploy-key"

test -f out/index.html
test -f out/robots.txt
test -f out/sitemap.xml

local_index_sha="$(sha256sum out/index.html | awk '{print $1}')"
local_html_count="$(find out -type f -name '*.html' | wc -l | tr -d ' ')"

tar -C out -czf "$local_archive" .
install -m 600 /dev/null "$key_file"
printf '%s\n' "$FISHNO_SSH_PRIVATE_KEY" > "$key_file"
install -m 700 -d ~/.ssh
ssh-keyscan -p "$ssh_port" "$ssh_host" >> ~/.ssh/known_hosts

ssh_args=(-i "$key_file" -p "$ssh_port")
scp_args=(-O -i "$key_file" -P "$ssh_port")

scp "${scp_args[@]}" "$local_archive" "${ssh_user}@${ssh_host}:${remote_archive}"

ssh "${ssh_args[@]}" "${ssh_user}@${ssh_host}" \
  "fishno-deploy $release_id $local_index_sha $local_html_count"

public_index_sha="$(curl --fail --silent --show-error --retry 5 --retry-delay 3 https://fishno.ru/ | sha256sum | awk '{print $1}')"
test "$public_index_sha" = "$local_index_sha"
curl --fail --silent --show-error --retry 5 --retry-delay 3 https://fishno.ru/robots.txt --output /dev/null
curl --fail --silent --show-error --retry 5 --retry-delay 3 https://fishno.ru/sitemap.xml --output /dev/null

rm -f "$local_archive" "$key_file"
printf 'fishno.ru deployed and verified\n'
