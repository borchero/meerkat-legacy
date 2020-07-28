FROM alpine:3.10

RUN apk add --no-cache openvpn

COPY build/vpn/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

VOLUME ["/etc/openvpn"]
EXPOSE 1194/udp

ENTRYPOINT ["/docker-entrypoint.sh"]
