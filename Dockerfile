FROM nginx:stable-alpine

LABEL org.opencontainers.image.source="https://github.com/roma-rin/portfolio"

# Explicit list on purpose: never copy the repo root, it holds .env and internal docs.
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY font/ /usr/share/nginx/html/font/
COPY img/ /usr/share/nginx/html/img/
