#!/bin/sh

set -o errexit

iptables \
    -t nat \
    -A POSTROUTING \
    -s 192.168.255.0/255.255.255.0 \
    -o eth0 \
    -j MASQUERADE

mkdir -p /dev/net
if [ ! -c /dev/net/tun ]; then
    mknod /dev/net/tun c 10 200
fi

# Exec to receive termination signals
exec openvpn --config $@
