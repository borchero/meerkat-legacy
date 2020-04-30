{{- define "vault.kv-value" -}}
{{"{{"}}- with secret "{{ . }}" {{"}}"}}
{{"{{"}} .Data.data.value {{"}}"}}
{{"{{"}}- end -{{"}}"}}
{{- end -}}

{{- define "vault.pki" -}}
{{"{{"}}- with secret "{{ .secret }}" "common_name={{ .cn }}" {{"}}"}}
{{"{{"}} .Data.{{ .out }} {{"}}"}}
{{"{{"}}- end -{{"}}"}}
{{- end -}}

{{- define "database.connection" -}}
{{"{{"}}- with secret "{{ .secret }}" {{"}}"}}
postgres://{{"{{"}} .Data.username {{"}}"}}:{{"{{"}} .Data.password {{"}}"}}@{{ .config.host }}:{{ .config.port }}/{{ .config.database }}?sslmode=disable
{{"{{"}}- end -{{"}}"}}
{{- end -}}

{{- define "vpn.port" -}}
{{- if eq .type "NodePort" -}}
{{ .nodePort }}
{{- else -}}
{{ .port }}
{{- end -}}
{{- end -}}
