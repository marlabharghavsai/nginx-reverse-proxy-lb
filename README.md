# Nginx Reverse Proxy & Load Balancer

## Overview
This project implements a **production-ready Nginx reverse proxy and load balancer** using **Docker and Docker Compose**.  
Nginx serves as a single, secure entry point for client traffic and distributes requests across multiple backend applications while providing **SSL/TLS termination, caching, rate limiting, health-based failover, structured logging, and custom error handling**.

This setup demonstrates real-world web infrastructure concepts used in scalable and resilient applications.

---

## Architecture Overview

Client requests enter through Nginx over HTTPS.  
Nginx terminates SSL, applies security and performance controls, and forwards traffic evenly to backend services.

```text
Client
   |
   | HTTPS (443)
   v
+-----------------------+
|        NGINX          |
| Reverse Proxy + LB    |
|                       |
| • SSL Termination     |
| • Load Balancing      |
| • Rate Limiting       |
| • Static Caching      |
| • Custom Errors       |
+-----------------------+
   |        |        |
   v        v        v
Backend-1  Backend-2  Backend-3
(Node.js HTTP Servers)
