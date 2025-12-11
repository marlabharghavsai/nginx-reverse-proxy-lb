# Nginx Reverse Proxy & Load Balancer

## Overview
This project implements a **production-ready Nginx reverse proxy and load balancer** using **Docker and Docker Compose**.  
Nginx serves as a single, secure entry point for client traffic and distributes requests across multiple backend applications while providing **SSL/TLS termination, caching, rate limiting, health-based failover, structured logging, and custom error handling**.

This setup demonstrates real-world web infrastructure concepts used in scalable and resilient applications.

---

## Architecture Overview

Client requests enter through Nginx over HTTPS.  
Nginx terminates SSL, applies security and performance controls, and forwards traffic evenly to backend services.

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

## Features

###  Reverse Proxy & Load Balancing
- Acts as a reverse proxy for **3 backend application instances**
- Uses **round-robin load balancing**
- Backend services return a unique identifier to verify traffic distribution

###  Health-Aware Failover
- Uses `max_fails` and `fail_timeout` to detect unhealthy backends
- Automatically removes failed backends from rotation
- Reintroduces backends once they recover

###  Security
- SSL/TLS termination at the Nginx layer
- HTTP → HTTPS **301 redirect enforced**
- Rate limiting to protect against excessive requests (`429 Too Many Requests`)
- Secure headers enabled (XSS, frame protection, content type)

###  Performance
- Static asset caching (`css`, `js`, `png`, etc.)
- Reduced backend load through Nginx proxy cache
- Uses `X-Cache-Status` header to verify cache behavior

### User Experience
- Custom **404 (Not Found)** and **502 (Bad Gateway)** error pages

### Logging & Observability
- Separate access and error logs for proxied services
- Structured logging format (combined)

###  DevOps & Reproducibility
- Fully containerized using **Docker & Docker Compose**
- Modular Nginx configuration
- GitHub version control via SSH from Ubuntu server

---

## Technology Stack

| Component | Technology |
|---------|-----------|
| Reverse Proxy | Nginx |
| Backends | Node.js HTTP servers |
| Containerization | Docker |
| Orchestration | Docker Compose |
| SSL | Self-signed (Let’s Encrypt ready) |
| OS | Ubuntu Server |
| Version Control | Git + GitHub |



## Project Structure

project-root/
- nginx/
  -  nginx.conf
  -  load-balancer.conf
  - ssl.conf
  -  cache.conf
  -  error-pages/
     -  404.html
     -  502.html
- backend1/
   - server.js
- backend2/
   - server.js
- backend3/
   - server.js
- docker-compose.yml
- Dockerfile
- README.md


## 1. Setup Instructions (Run Project Locally)
### Prerequisites
- Docker installed
- Docker Compose installed
- Git installed


## 2. Clone the Repository
- git clone https://github.com/marlabharghavsai/nginx-reverse-proxy-lb
- cd nginx-reverse-proxy-lb


## 3. Start the Entire Environment
- docker compose up -d

### This launches:
- Nginx Reverse Proxy
- 3 Backend Node.js Servers
- SSL configuration
- Rate limiting
- Caching
- Health checks

## Check running containers:
- docker compose ps

## 4. Access the Application
- HTTP (Auto-Redirects to HTTPS)
- curl -v http://localhost/


## Testing All Core Features

### HTTPS & SSL
- curl -vk https://localhost/

### HTTP → HTTPS Redirect
- curl -v http://localhost/

### Load Balancing Test (Round-Robin)

Run requests: for i in {1..9}; do curl -sk https://localhost/ | grep Hello; done
Expected responses:
- Hello from backend-1
- Hello from backend-2
- Hello from backend-3

## Test static asset caching
- curl -skI https://localhost/static/style.css
- curl -skI https://localhost/static/style.css
 - Check headers:
   - expires
   - X-Cache-Status → first MISS, second HIT (ideally)

## Test rate limiting
- for i in {1..50}; do curl -sk -o /dev/null -w "%{http_code}\n" https://localhost/; done

## Test backend failure behaviour
- docker stop backend2
- for i in {1..10}; do curl -sk https://localhost/ | grep Hello; done

Bring it back: 
- docker start backend2

## Check Nginx logs
- docker exec -it nginx-proxy tail -n 20 /var/log/nginx/app_access.log
- docker exec -it nginx-proxy tail -n 20 /var/log/nginx/app_error.log
