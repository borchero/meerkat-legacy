#!/bin/sh

set -o errexit

CA_PATH=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt
JWT_PATH=/var/run/secrets/kubernetes.io/serviceaccount/token

# First, authenticate against Vault using Kubernetes
VAULT_TOKEN=$(
    curl \
        --cacert $CA_PATH \
        -d "{\"role\":\"$VAULT_ROLE\",\"jwt\":\"$(cat $JWT_PATH)\"}" \
        $VAULT_ADDR/v1/auth/kubernetes/login |
    jq -r .auth.client_token
)

# Then, rotate the CRL
curl \
    --cacert $CA_PATH \
    -H "X-Vault-Token: $VAULT_TOKEN" \
    $VAULT_ADDR/v1/$VAULT_PKI_PATH/crl/rotate
