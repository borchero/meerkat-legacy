#############
### ROLES ###
#############

resource "vault_kubernetes_auth_backend_role" "vpn" {
  backend   = var.vault_kubernetes_auth
  role_name = var.vault_role_vpn

  bound_service_account_names      = [var.kubernetes_sa_vpn]
  bound_service_account_namespaces = [var.kubernetes_namespace]

  token_ttl      = 3600
  token_policies = ["default", vault_policy.vpn.name]
}

resource "vault_kubernetes_auth_backend_role" "api" {
  backend   = var.vault_kubernetes_auth
  role_name = var.vault_role_api

  bound_service_account_names      = [var.kubernetes_sa_api]
  bound_service_account_namespaces = [var.kubernetes_namespace]

  token_ttl      = 3600
  token_policies = ["default", vault_policy.api.name]
}

################
### POLICIES ###
################

resource "vault_policy" "vpn" {
  name   = "${var.vault_policy_prefix}.vpn"
  policy = <<EOT
# Allow reading shared keys (DH params and TLS Auth)
path "${var.vault_kv_store}" {
  capabilities = ["read"]
}

# Allow reading the CRL
path "${var.vault_pki}/crl/pem" {
  capabilities = ["read"]
}

# Allow issuing server certificates
path "${var.vault_pki}/issue/server" {
  capabilities = ["read", "create", "update"]
}
EOT
}

resource "vault_policy" "api" {
  name   = "${var.vault_policy_prefix}.api"
  policy = <<EOT
# Allow reading shared TLS Auth
path "${var.vault_kv_store}/tls-auth" {
  capabilities = ["read"]
}

# Allow issuing client certificates
path "${var.vault_pki}/issue/client" {
  capabilities = ["read", "create", "update"]
}

# Allow revoking certificates
path "${var.vault_pki}/revoke" {
  capabilities = ["read", "create", "update"]
}

# Allow accessing the database with the configured role
path "${var.postgres_vault_path}/creds/${var.postgres_role}" {
  capabilities = ["read"]
}
EOT
}
