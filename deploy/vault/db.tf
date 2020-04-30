resource "vault_database_secret_backend_role" "api" {
  name    = var.postgres_role
  backend = var.postgres_vault_path
  db_name = var.postgres_database

  creation_statements = [
    "CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';",
    "GRANT * ON ALL TABLES IN SCHEMA ${var.postgres_schema} TO \"{{name}}\";"
  ]

  default_ttl = 3600
  max_ttl     = 86400
}
