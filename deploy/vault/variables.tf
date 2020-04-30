#############
### VAULT ###
#############

variable "vault_address" {
  type        = string
  default     = "http://localhost:8200"
  description = "The endpoint where Vault is reachable for obtaing CRLs."
}

variable "local_vault_address" {
  type        = string
  default     = "http://localhost:8200"
  description = "The endpoint where Vault is reachable from the client."
}

variable "vault_pki" {
  type        = string
  default     = "pki/meerkat"
  description = "The path for the Meerkat PKI."
}

variable "vault_kv_store" {
  type        = string
  default     = "kv/meerkat"
  description = "The path for the KV V2 engine used to store DH params and TLS auth."
}

variable "vault_kubernetes_auth" {
  type        = string
  default     = "kubernetes"
  description = "The path of the Kubernetes auth method for which to define Meerkat's roles."
}

variable "vault_role_vpn" {
  type        = string
  default     = "meerkat-vpn"
  description = "The name of the Kubernetes auth role for the Meerkat VPN component."
}

variable "vault_role_api" {
  type        = string
  default     = "meerkat-api"
  description = "The name of the Kubernetes auth role for the Meerkat API."
}

variable "vault_policy_prefix" {
  type        = string
  default     = "meerkat"
  description = "The prefix of the name of the policies created for Meerkat."
}

###########
### PKI ###
###########

variable "common_name" {
  type        = string
  description = "The common name to use for the CA."
}

variable "country" {
  type        = string
  default     = "DE"
  description = "The 2-letter country code to use for the CA."
}

variable "locality" {
  type        = string
  default     = "Munich"
  description = "The city of the organization issuing certificates."
}

variable "organization" {
  type        = string
  description = "The name of the organization issuing certificates."
}

variable "organization_unit" {
  type        = string
  default     = "IT"
  description = "The organization unit responsible for the CA."
}

##################
### KUBERNETES ###
##################

variable "kubernetes_sa_vpn" {
  type        = string
  default     = "meerkat-vpn"
  description = "The name of the service account for the Meerkat VPN component."
}

variable "kubernetes_sa_api" {
  type        = string
  default     = "meerkat-api"
  description = "The name of the service account for the Meerkat API component."
}

variable "kubernetes_namespace" {
  type        = string
  default     = "default"
  description = "The Kubernetes namespace into which Meerkat will be deployed."
}

################
### DATABASE ###
################

variable "postgres_vault_path" {
  type        = string
  default     = "postgres"
  description = "The path at which the Postgres instance configuration can be found."
}

variable "postgres_database" {
  type        = string
  default     = "meerkat"
  description = "The name of the database connection to use."
}

variable "postgres_role" {
  type        = string
  default     = "meerkat"
  description = "The name of the role to configure for getting database credentials."
}

variable "postgres_schema" {
  type        = string
  default     = "public"
  description = "The schema to use for Meerkat."
}
