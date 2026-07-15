import tls from 'node:tls'

export interface LiveCert {
  leafDer: Uint8Array
  chainDer: Uint8Array[]
  tlsVersion: string | null
  servedChainAuthorized: boolean
}

/**
 * Fetch the certificate served by host:port over TLS.
 *
 * SECURITY: rejectUnauthorized is false BY DESIGN — an auditor must capture
 * invalid/expired/self-signed certs, not reject them. This is not a client
 * trusting the server: the socket is read-only (we read the peer cert then
 * end() immediately and never write application data), and the real trust
 * state is returned in `servedChainAuthorized` so callers never treat an
 * unverified cert as trusted.
 */
export function fetchLiveCert(host: string, port = 443, timeoutMs = 6000): Promise<LiveCert> {
  return new Promise<LiveCert>((resolve, reject) => {
    const socket = tls.connect(
      { host, port, servername: host, rejectUnauthorized: false, timeout: timeoutMs },
      () => {
        try {
          const leaf = socket.getPeerCertificate(true)
          if (!leaf || !leaf.raw) {
            socket.destroy()
            return reject(new Error('no peer certificate'))
          }
          const chain: Uint8Array[] = []
          const seen = new Set<string>()
          let cur: tls.DetailedPeerCertificate | undefined = leaf
          while (cur && cur.raw && !seen.has(cur.fingerprint256)) {
            seen.add(cur.fingerprint256)
            chain.push(new Uint8Array(cur.raw))
            cur = cur.issuerCertificate && cur.issuerCertificate !== cur ? cur.issuerCertificate : undefined
          }
          const result: LiveCert = {
            leafDer: new Uint8Array(leaf.raw),
            chainDer: chain,
            tlsVersion: socket.getProtocol(),
            servedChainAuthorized: socket.authorized,
          }
          socket.end()
          resolve(result)
        } catch (e) {
          socket.destroy()
          reject(e as Error)
        }
      },
    )
    socket.on('error', reject)
    socket.on('timeout', () => {
      socket.destroy()
      reject(new Error(`TLS timeout: ${host}:${port}`))
    })
  })
}
