# goapp-crud Frontend

This repository contains the **Node.js (React + Vite)** frontend for the [goapp-crud](https://github.com/paulovigne/goapp) application. It serves a web interface that interacts with the Go backend API.

You can find a built image [here](https://hub.docker.com/r/paulovigne/frontend-goapp).

## 🌐 Overview

- **Frontend Stack**: React + Vite
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **Dockerized**: Yes (Alpine-based image)
- **Kubernetes Ready**: Yes
- **Port**: `8080`
- **API Base Path**: `/api`

## 📁 File Structure (Kubernetes Manifests)

### `cm-frontend-vars.yaml` – ConfigMap

This file injects runtime configuration to the frontend app via an `env.js` file:

```yaml
window.ENV = {
  API_URL: '/api',
};
```

It is mounted at `/usr/share/nginx/html/env.js` inside the container.

---

### `deploy-frontend.yaml` – Deployment

Defines the frontend Deployment with:

- **Image**: `paulovigne/frontend-goapp:v1`
- **Replicas**: 1
- **Non-root User**: UID/GID `101`
- **Mounted ConfigMap**: `frontend-vars`
- **Health Checks**:
  - **Liveness**: `GET /`
  - **Readiness**: `GET /`

---

### `svc-frontend.yaml` – Service

Exposes the frontend via a Kubernetes `ClusterIP` service on port `8080`.

```yaml
port: 8080
targetPort: tcp-frontend
```

---

### `ing-frontend.yaml` – Ingress

Defines routing rules for the frontend and backend services:

```yaml
Host: goapp.<LB_IPADDR>.sslip.io

Paths:
  /api      → goapp backend service
  /         → frontend service
```

> Replace `<LB_IPADDR>` with your cluster's LoadBalancer IP.

---

## 🚀 Running Locally

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## 🐳 Docker

This app is containerized using a multi-stage build with a lightweight non-root Alpine image.

### Example Dockerfile highlights

- Uses `node` base image for build
- Uses `nginx` or minimal HTTP server for serving static files
- Exposes port `8080`
- Sets user to `101` (non-root)

---

## 🧪 Health Probes

Kubernetes performs the following checks:

- **Readiness Probe**: `GET /` after 5s, every 10s
- **Liveness Probe**: `GET /` after 5s, every 10s

---

## 🔐 Security

- Runs as non-root (`101`)
- `allowPrivilegeEscalation: false`
- Option to set `readOnlyRootFilesystem: true`