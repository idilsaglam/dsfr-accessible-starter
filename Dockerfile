FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"

# to install pnpm 
RUN corepack enable 

# change current directory to /app 
WORKDIR /app

COPY . .

FROM base AS build

# docker buildkit cache (cache pnpm install)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Final runtime image
# hadolint ignore=DL3007
FROM bitnami/nginx:latest

USER root
# Precreate Bitnami expected directories to avoid startup warnings/errors
RUN mkdir -p /opt/bitnami/nginx/conf/bitnami/certs /bitnami/nginx/conf/vhosts && \
    chown -R 1001:1001 /opt/bitnami/nginx /bitnami/nginx

RUN install_packages curl ca-certificates

USER 1001:1001

WORKDIR /app
COPY --from=build --chown=1001:1001 /app/dist ./
COPY --chown=1001:1001 ./nginx.conf  /opt/bitnami/nginx/conf/nginx.conf

# Expose the Bitnami HTTP port
EXPOSE 8080