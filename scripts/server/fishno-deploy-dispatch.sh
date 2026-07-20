#!/bin/sh
set -eu

readonly deploy_base="/var/www/u3576558/data/www"
readonly deploy_command="/var/www/u3576558/data/.ssh/fishno-deploy-release"
original_command=${SSH_ORIGINAL_COMMAND:-}

deny() {
  printf 'This key is restricted to Fishno production deployments.\n' >&2
  exit 126
}

case "$original_command" in
  "scp -t ${deploy_base}/.fishno-release-"*".tar.gz")
    set -- $original_command
    [ "$#" -eq 3 ] || deny
    [ "$1" = "scp" ] || deny
    [ "$2" = "-t" ] || deny

    target=$3
    archive_name=${target##*/}
    release_id=${archive_name#.fishno-release-}
    release_id=${release_id%.tar.gz}

    [ "$target" = "${deploy_base}/.fishno-release-${release_id}.tar.gz" ] || deny
    case "$release_id" in
      ''|*[!A-Za-z0-9._-]*) deny ;;
    esac

    exec /usr/bin/scp -t "$target"
    ;;
  fishno-deploy\ *)
    set -- $original_command
    [ "$#" -eq 4 ] || deny
    [ "$1" = "fishno-deploy" ] || deny
    exec "$deploy_command" "$2" "$3" "$4"
    ;;
  *)
    deny
    ;;
esac
