###########
### PKI ###
###########

resource "vault_mount" "pki" {
  type = "pki"
  path = var.vault_pki

  default_lease_ttl_seconds = 63072000  # 2 years
  max_lease_ttl_seconds     = 315360000 # 10 years
}

resource "vault_pki_secret_backend_root_cert" "pki" {
  backend = vault_mount.pki.path

  type               = "internal"
  common_name        = var.common_name
  ttl                = "315360000" # 10 years
  format             = "pem"
  private_key_format = "der"
  key_type           = "rsa"
  key_bits           = 4096

  exclude_cn_from_sans = false

  country      = var.country
  locality     = var.locality
  organization = var.organization
  ou           = var.organization_unit
}

resource "vault_pki_secret_backend_config_urls" "pki" {
  backend = vault_mount.pki.path

  issuing_certificates = [
    "${var.vault_address}/v1/pki/meerkat/ca"
  ]
  crl_distribution_points = [
    "${var.vault_address}/v1/pki/meerkat/crl"
  ]
}

#############
### ROLES ###
#############

resource "vault_pki_secret_backend_role" "server" {
  backend = vault_mount.pki.path

  name     = "server"
  key_type = "rsa"
  key_bits = 2048
  ttl      = 63072000 # 2 years
  max_ttl  = 63072000 # 2 years

  require_cn         = true
  allow_any_name     = true
  allow_localhost    = false
  allow_bare_domains = false
  enforce_hostnames  = false
  allow_ip_sans      = false
  allow_glob_domains = false

  server_flag           = true
  client_flag           = false
  code_signing_flag     = false
  email_protection_flag = false
  key_usage = [
    "digitalSignature",
    "keyAgreement",
    "keyEncipherment"
  ]
  ext_key_usage = [
    "TLS Web Server Authentication"
  ]

  country      = [var.country]
  locality     = [var.locality]
  organization = [var.organization]
}

resource "vault_pki_secret_backend_role" "client" {
  backend = vault_mount.pki.path

  name     = "client"
  key_type = "rsa"
  key_bits = 2048
  ttl      = 63072000 # 2 years
  max_ttl  = 63072000 # 2 years

  require_cn         = true
  allow_any_name     = true
  allow_localhost    = false
  allow_bare_domains = false
  enforce_hostnames  = false
  allow_ip_sans      = false
  allow_glob_domains = false

  server_flag           = false
  client_flag           = true
  code_signing_flag     = false
  email_protection_flag = false
  key_usage = [
    "digitalSignature",
    "keyAgreement",
    "keyEncipherment"
  ]
  ext_key_usage = [
    "TLS Web Client Authentication"
  ]

  country      = [var.country]
  locality     = [var.locality]
  organization = [var.organization]
}
