FROM alpine:3.10

RUN apk add --no-cache openvpn

VOLUME ["/etc/openvpn"]
EXPOSE 1194

ENTRYPOINT ["openvpn"]
