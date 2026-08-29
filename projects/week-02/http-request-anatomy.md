# Week 2 — HTTP Request Anatomy

## Target

| Item | Observation |
|---|---|
| Domain | offshieldsecurity.org |
| DNS resolver | 172.31.144.1 |
| IPv4 addresses | 185.199.109.153, 185.199.108.153, 185.199.111.153, 185.199.110.153 |
| Scheme | HTTPS |
| Application protocol | HTTP/2 |
| Server | GitHub.com |
| Response status | 200 OK |

## DNS observations

The domain resolved to four IPv4 addresses. The DNS response was marked non-authoritative, meaning the answer came from the configured recursive resolver rather than directly from the authoritative nameserver. Multiple addresses can support availability and distribution of traffic.

## HTTP response observations

The HEAD request returned `HTTP/2 200`, showing that the server successfully handled the request. The response identified the server as GitHub.com and reported an HTML content type with a content length of 14,712 bytes at the time of testing.

Observed headers included `content-type`, `last-modified`, `etag`, `cache-control`, `expires`, `vary`, and `access-control-allow-origin`. Headers reveal how content is served, cached, identified, and shared across origins. They should be reviewed carefully because server and platform headers can expose implementation details.

## TLS observations

The verbose request completed a TLS 1.3 handshake using `TLS_AES_128_GCM_SHA256` with X25519 key exchange. The certificate matched `offshieldsecurity.org`, was issued by Let’s Encrypt, and was successfully verified by the local certificate store. The certificate used an RSA 2048-bit public key.

## Request flow

The observed flow was:

```text
Domain name
    ↓
DNS resolver
    ↓
IPv4 address
    ↓
TCP connection to port 443
    ↓
TLS 1.3 handshake
    ↓
HTTP/2 request
    ↓
GitHub Pages response

Security observations

The site was accessed over HTTPS, the certificate matched the hostname, and certificate verification succeeded. The response also disclosed that the site is served through GitHub infrastructure. The access-control-allow-origin: * header should be reviewed in the context of the site’s actual content and whether cross-origin access is required.
The request used a GET method in the verbose trace, while the HEAD request retrieved response headers without requesting the full response body. No authentication tokens or private data were collected.
Limitations
This was a passive, low-impact observation of a domain controlled by the project owner. It was not a vulnerability scan, exploitation attempt, or comprehensive security assessment.

Questions for further study
How do DNS records affect application availability and trust?
What is the difference between HTTP/1.1 and HTTP/2?
Which security headers should a production web application set?
How do cache-control and ETag values affect sensitive responses?
