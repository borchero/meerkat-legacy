# Meerkat

![Docker Image Version](https://img.shields.io/docker/v/borchero/meerkat)

Meerkat provides a cloud-native OpenVPN deployment as well as a simplistic API. This repository
includes tools to deploy Meerkat on Kubernetes. Meerkat is tightly integrated with
[Vault](https://www.vaultproject.io/) to securely manage certificates.

## Deployment

Deploying Meerkat consists of multiple steps to ensure a high level of security. Furthermore, the
following components must be installed on the cluster prior to this installation:

- [Postgres](https://www.postgresql.org/): Database used for user management. This component is
  required.
- [Vault](https://www.vaultproject.io/): PKI for the OpenVPN server and provider of database
  credentials as well as shared secrets. This component is required (including the agent injector).
- [Traefik](https://containo.us/traefik/): Router which e.g. sets up basic authentication for the
  API. This component is optional and any resources depending on it are disabled by default.
- [Switchboard](https://github.com/borchero/switchboard/): Kubernetes controller to set DNS records
  on the Google Cloud Platform. This component is optional and any resources depending on it are
  disabled by default.

### Generating Shared Secrets

OpenVPN requires Diffie-Hellman parameters as well as a shared key to prevent DoS attacks. We need
to generate these two keys manually and can subsequently store them in Vault to be accessed at a
later point. Make sure, you have the latest version of the CLI tools used here installed. Running
these commands typically takes a few minutes.

```bash
openssl dhparam -out dh.pem 2048
openvpn --genkey --secret ta.key
```

Subsequently, the files can be added to a Vault KV store. You will need to reuse the parameters
used here later when deploying Meerkat.

```bash
export KV_STORE=kv/meerkat
# If you do not have a usable KV v2 store, run the following:
vault secrets enable -version=2 -path ${KV_STORE} kv
# Then, add the generated secrets
cat dh.pem | vault kv put ${KV_STORE}/dh-params value=-
cat ta.key | vault kv put ${KV_STORE}/tls-auth value=-
```

### Preparing Vault

Meerkat uses Vault for establishing a PKI. For this purpose, the `deploy/vault` folder contains a
set of Terraform configuration files that should be applied to your Vault instance prior to
deploying Meerkat itself. Configuration parameters are exposed as variables.

Besides establishing the PKI, this configuration does the following:

- It sets up a Kubernetes role for Meerkat
- It sets up a Postgres role for Meerkat's API

It is assumed that Kubernetes authentication and a connection for the Postgres database have
already been configured.

### Deploying Meerkat

Using [Helm](https://helm.sh/), Meerkat itself can eventually be deployed as follows. Make sure
that you set the values according to your prior steps.

```
helm repo add borchero https://charts.borchero.com
helm install meerkat borchero/meerkat
```

## Roadmap

In the future, a GUI for user management will be added.
