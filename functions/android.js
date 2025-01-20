export async function onRequest(context) {

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${context.env.ACCOUNT_ID}/gateway/certificates`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context.env.APITOKEN}`
        }
    });

    const cert = await res.json()
    
    const in_use = cert.result.filter(cert => cert.id == context.env.ROOT_CA_CERT_ID);
    
    return new Response(in_use[0].certificate, {
        headers: {
            "Content-Type": "application/x-x509-ca-cert",
            "Content-Disposition": `attachment; filename="${in_use[0].id}.crt"`,
        }
    })
  }