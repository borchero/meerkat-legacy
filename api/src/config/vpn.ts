export default () => ({
    vpn: {
        device: process.env.VPN_DEVICE || 'tun',
        host: process.env.VPN_HOST || 'localhost',
        port: process.env.VPN_PORT || '1194',
        protocol: process.env.VPN_PROTOCOL || 'udp',
        auth: process.env.VPN_AUTH || 'SHA384',
        cipher: process.env.VPN_CIPHER || 'AES-256-GCM',
    },
});
