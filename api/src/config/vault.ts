import * as fs from 'fs';

export default () => {
    const scheme = process.env.VAULT_SCHEME || 'http';
    const host = process.env.VAULT_HOST || 'localhost';
    const port = process.env.VAULT_PORT || '8200';

    const tokenFile = process.env.VAULT_TOKEN_FILE;
    const token = fs.readFileSync(tokenFile);

    const caFile = process.env.VAULT_CA_CRT_FILE;
    var ca = "";
    if (caFile) {
        ca = fs.readFileSync(caFile).toString().trim();
    }

    return {
        vault: {
            version: 'v1',
            endpoint: `${scheme}://${host}:${port}`,
            token: token.toString().trim(),
            pki: process.env.VAULT_PKI,
            tlsAuth: process.env.VAULT_TLS_AUTH,
            ca: ca
        },
    };
};
