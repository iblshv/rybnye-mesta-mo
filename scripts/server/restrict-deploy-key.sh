#!/usr/bin/env bash
set -euo pipefail

public_key_file=${1:?Public key file is required}
identity_file=${2:?Current SSH identity file is required}
ssh_host=${3:-server17.hosting.reg.ru}
ssh_user=${4:-u3576558}

public_key=$(tr -d '\r\n' < "$public_key_file")
case "$public_key" in
  "ssh-ed25519 "*" fishno-github-actions") ;;
  *)
    printf 'Unexpected deploy public key.\n' >&2
    exit 1
    ;;
esac

restricted_key="command=\"/var/www/u3576558/data/.ssh/fishno-deploy-dispatch\",no-agent-forwarding,no-port-forwarding,no-X11-forwarding,no-pty ${public_key}"

printf '%s\n' "$restricted_key" | ssh \
  -i "$identity_file" \
  -o BatchMode=yes \
  -o StrictHostKeyChecking=yes \
  "${ssh_user}@${ssh_host}" \
  'set -eu
   IFS= read -r replacement
   cd /var/www/u3576558/data/.ssh
   count=$(grep -c " fishno-github-actions$" authorized_keys || true)
   test "$count" -eq 1
   awk -v replacement="$replacement" '\''
     / fishno-github-actions$/ { print replacement; found=1; next }
     { print }
     END { if (!found) exit 2 }
   '\'' authorized_keys > authorized_keys.new
   chmod 600 authorized_keys.new
   mv authorized_keys.new authorized_keys'

printf 'Deploy key restricted.\n'
