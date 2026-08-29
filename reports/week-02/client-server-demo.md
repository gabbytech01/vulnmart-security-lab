# Week 2 — Local Client-Server Demo

## Objective

The objective was to build a safe local HTTP server that demonstrates how a client sends requests to routes and how the server returns status codes, headers, and response bodies.

## Environment

The server was built with Python’s standard library and bound to `127.0.0.1:8000`. Binding to localhost kept the exercise inside the local lab environment.

## Endpoint test results

| Method | Endpoint | Status | Content type | Result |
|---|---|---:|---|---|
| GET | `/` | 200 | text/plain | Server status message returned. |
| GET | `/api/health` | 200 | application/json | Health status and service name returned. |
| GET | `/api/products` | 200 | application/json | Three fictional products returned as JSON. |
| GET | `/api/missing` | 404 | application/json | Structured not-found error returned. |

## Example response

The health endpoint returned:

```json
{"status": "ok", "service": "vulnmart-demo"}


Request and response observations
The client used the GET method to request each route. The server selected a response based on the request path. Successful routes returned HTTP 200, while an unknown route returned HTTP 404. The server also returned Content-Type and Content-Length headers so the client could interpret the response correctly.
Security observations
The server was intentionally bound to 127.0.0.1, reducing exposure during the exercise. Before deploying a real service, it would require authentication and authorization, input validation, structured logging, secure error handling, rate limiting, dependency management, and HTTPS through an appropriate production architecture.
The product data was fictional and contained no credentials, tokens, or sensitive information.
Conclusion
The demo shows the basic client-server relationship: a client sends an HTTP request, the server applies routing logic, and the server returns a response containing a status code, headers, and body. The project provides a foundation for later VulnMart API security testing.
