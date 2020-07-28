{{- define "vault.kv-value" -}}
{{ $kvPath := .root.Values.vault.paths.kv }}
vault.hashicorp.com/agent-inject-secret-{{ .name }}: {{ $kvPath }}/{{ .name }}
vault.hashicorp.com/agent-inject-template-{{ .name }}: |
    {{"{{"}}- with secret "{{ $kvPath }}/{{ .name }}" {{"}}"}}
    {{"{{"}} .Data.data.value {{"}}"}}
    {{"{{"}}- end -{{"}}"}}
{{- end -}}

{{- define "vault.pki-cert" -}}
{{- $pkiPath := printf "%s/issue/server" .root.Values.vault.paths.pki -}}
{{ $cn := printf "%s.%s" .root.Values.dns.subdomains.vpn (required "dns.domain is required" .root.Values.dns.domain) }}
vault.hashicorp.com/agent-inject-secret-{{ .name }}: {{ $pkiPath }}
vault.hashicorp.com/agent-inject-template-{{ .name }}: |
    {{"{{"}}- with secret "{{ $pkiPath }}" "common_name={{ $cn }}" {{"}}"}}
    {{"{{"}} .Data.{{ .name }} {{"}}"}}
    {{"{{"}}- end -{{"}}"}}
{{- end -}}

{{- define "vault.database" -}}
{{ $database := required "path to Vault database credentials required" .Values.postgres.credentials.vaultPath }}
vault.hashicorp.com/agent-inject-secret-db-credentials: {{ $database }}
vault.hashicorp.com/agent-inject-template-db-credentials: |
    {{"{{"}}- with secret "{{ $database }}" {{"}}"}}
    postgres://{{"{{"}} .Data.username {{"}}"}}:{{"{{"}} .Data.password {{"}}"}}@{{ required "database host required" .Values.postgres.host }}:{{ .Values.postgres.port }}/{{ .Values.postgres.database }}
    {{"{{"}}- end -{{"}}"}}
{{- end -}}

{{- define "vpn.port" -}}
{{- if eq .type "NodePort" -}}
{{ .nodePort }}
{{- else -}}
{{ .port }}
{{- end -}}
{{- end -}}
