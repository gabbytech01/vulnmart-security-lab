#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer
import json


PRODUCTS = [
    {"id": 1, "name": "Security Notebook", "price": 12.50},
    {"id": 2, "name": "Linux Lab Guide", "price": 18.00},
    {"id": 3, "name": "HTTP Practice Kit", "price": 25.00},
]


class VulnMartHandler(BaseHTTPRequestHandler ):
    def send_json(self, status_code, data):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/health":
            self.send_json(200, {"status": "ok", "service": "vulnmart-demo"})
            return

        if self.path == "/api/products":
            self.send_json(200, {"products": PRODUCTS})
            return

        if self.path == "/":
            body = b"VulnMart local server is running."
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        self.send_json(404, {"error": "Not found"})

    def log_message(self, format_string, *args):
        print(f"[request] {self.command} {self.path} - {args[1]}")


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8000), VulnMartHandler)
    print("Listening on http://127.0.0.1:8000" )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()

