# Fishno production deployment

This repository's production is `https://fishno.ru`, hosted on REG.RU. Do not treat GitHub Pages as production and do not invent a different deployment target.

Use the established deployment contract:

- SSH host: `server17.hosting.reg.ru`
- SSH user: `u3576558`
- live directory: `/var/www/u3576558/data/www/fishno.ru`
- build with an empty `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL=https://fishno.ru`
- upload a complete release to a temporary sibling directory
- verify `index.html`, `robots.txt`, `sitemap.xml`, file count, and the `index.html` SHA-256 before switching
- rename the current live directory to a timestamped backup, then rename the verified release directory to `fishno.ru`
- set directories to `755` and files to `644`
- verify the public domain and key routes after switching
- keep the previous release available for rollback

Never commit passwords or private keys. GitHub Actions must use a dedicated deploy key stored as `FISHNO_SSH_PRIVATE_KEY`.
Store that secret in the protected GitHub environment named `production`, not as a repository-wide secret. The matching server key must use a forced command that permits only the fixed Fishno archive upload and release switch; it must not permit an interactive shell, forwarding, or arbitrary remote commands.
