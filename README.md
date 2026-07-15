# @attestto/tls-audit

Web TLS/SSL certificate classifier: issuer CA, free-vs-paid, DV/OV/EV
validation tier, organization-validated, expiry. Built on `@attestto/x509-core`.

- Browser-safe classifier: `import { classifyCert } from "@attestto/tls-audit"`
- Node-only live fetch + audit: `import { fetchLiveCert, auditHost } from "@attestto/tls-audit/node"`

The live fetcher intentionally captures invalid/expired certs (it is an
auditor, not a client); it reads the served cert read-only and reports the
real trust state in `servedChainAuthorized`.

## License

Apache-2.0
