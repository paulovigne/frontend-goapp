# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY public/env.js /usr/share/nginx/html/env.js

# Become non-root
RUN chown -R nginx:nginx \
      /usr/share/nginx/html \
      /var/cache/nginx \
      /var/log/nginx \
      /etc/nginx

RUN chmod 644 /etc/nginx/nginx.conf && \
    chmod 644 /etc/nginx/conf.d/default.conf && \
    chmod 644 /usr/share/nginx/html/env.js

RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
