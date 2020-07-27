export default () => {
    const host = process.env.VAULT_HOST || 'localhost';
    const port = process.env.VAULT_PORT || '8200';
    return {
        vault: {
            version: 'v1',
            endpoint: `${host}:${port}`,
            token: process.env.VAULT_TOKEN,
            role: process.env.VAULT_ROLE,
            pki: process.env.VAULT_PKI || 'meerkat/pki',
            ta: process.env.VAULT_TLS_AUTH || 'meerkat/kv/data/tls-auth',
        },
    };
};
