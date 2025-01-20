export async function onRequest(context) {

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${context.env.ACCOUNT_ID}/gateway/certificates`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context.env.APITOKEN}`
        }
    });

    const cert = await res.json()
    
    const in_use = cert.result.filter(cert => cert.id == context.env.ROOT_CA_CERT_ID);

    /*
    {
      in_use: false,
      id: 'xxx',
      certificate: '-----BEGIN CERTIFICATE-----\n' +
        'xxxn' +
        ...
        '-----END CERTIFICATE-----\n',
      issuer_org: 'Cloudflare, Inc.',
      issuer_raw: 'CN=Gateway CA - Cloudflare Managed G1 xxx,OU=www.cloudflare.com,O=Cloudflare\\, Inc.,L=San Francisco,ST=California,C=US',
      fingerprint: 'xxx',
      binding_status: 'available',
      qs_pack_id: '00000000-0000-0000-0000-000000000000',
      type: 'gateway_managed',
      updated_at: '0001-01-01T00:00:00Z',
      uploaded_on: '0001-01-01T00:00:00Z',
      created_at: '2025-01-16T03:11:03.381992Z',
      expires_on: '2055-01-09T03:06:00Z'
    }
    */

    return new Response(in_use[0].certificate, {
        headers: {
            "Content-Type": "application/x-x509-ca-cert",
            "Content-Disposition": `attachment; filename="${in_use[0].id}.pem"`,
        }
    })
  }