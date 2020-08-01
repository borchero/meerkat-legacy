FROM alpine:3.12

RUN apk update \
    && apk add --no-cache curl jq

COPY build/cron/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
