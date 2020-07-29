# Meerkat

![Docker Image Version](https://img.shields.io/docker/v/borchero/meerkat-api?sort=semver)

Meerkat provides a cloud-native OpenVPN deployment that is tightly integrated with
[Vault](https://www.vaultproject.io/) to securely provision client certificates.

Compared to existing solutions, Meerkat has the following advantages:

- Certificates (especially the CA root certificate) are managed securely and cannot be
  accessed easily.
- Users can be managed via an HTTP API and certificates can be created/revoked dynamically.
  This also allows for easily adding a GUI in the future.
- Meerkat can be deployed fully automatically on Kubernetes, i.e. no manual steps are
  required.

**_The HTTP API is currently very minimal and not suited for any serious production environments._**

## Deployment

Deploying Meerkat consists of multiple steps to ensure a high level of security. Furthermore, the
following components must be installed on the cluster prior to this installation:

- [Postgres](https://www.postgresql.org/): Database used for user management. This component is
  required.
- [Vault](https://www.vaultproject.io/): PKI for the OpenVPN server. This component is required
  (including the agent injector). Optionally, it may be used to provide database credentials.
  Though recommended, this is up to the user.
- [Traefik](https://containo.us/traefik/): Router which e.g. sets up basic authentication for the
  API. This component is optional and any resources depending on it are disabled by default.
- [Switchboard](https://github.com/borchero/switchboard/): Kubernetes controller to set DNS records
  on the Google Cloud Platform. This component is optional and any resources depending on it are
  disabled by default.

### Preparing Vault

Meerkat extensively uses Vault and its configuration is therefore provided as Terraform module.
To add the Meerkat configuration, run the manual setup steps explained
[here](https://github.com/borchero/terraform-vault-meerkat#prerequisites). Subsequently, you may
add the following to your Terraform files configuring Vault:

```terraform
module "meerkat" {
  source  = "borchero/meerkat/vault"
  version = "<version>"

  pki_common_name  = "vpn.example.com"
  pki_organization = "Example Corp"
}
```

Additional configuration options are documented
[here](https://registry.terraform.io/modules/borchero/meerkat/vault?tab=inputs).

### Deploying Meerkat

Using [Helm](https://helm.sh/), Meerkat itself can be deployed as follows. Make sure that you set
the values according to your prior steps.

```
helm repo add borchero https://charts.borchero.com
helm install meerkat borchero/meerkat
```

The Helm chart is currently mostly undocumented and does not provide a lot of customization points
but focuses on most common use cases at the moment.

## Roadmap

Major building blocks that may be added in the future:

* Additional documentation
* A more robust API
* GUI for user management
