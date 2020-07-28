# Meerkat

![Docker Image Version](https://img.shields.io/docker/v/borchero/meerkat-api?sort=semver)

Meerkat provides a cloud-native OpenVPN deployment as well as a simplistic API. This repository
includes tools to deploy Meerkat on Kubernetes. Meerkat is tightly integrated with
[Vault](https://www.vaultproject.io/) to securely manage certificates.

**_The API is currently very minimal and not suited for any serious production environments._**

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

Optionally, Meerkat can also be configured to receive database credentials from Vault. The
corresponding configuration is, however, not included in the Terraform module.

### Deploying Meerkat

Using [Helm](https://helm.sh/), Meerkat itself can eventually be deployed as follows. Make sure
that you set the values according to your prior steps.

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
