# Deployment Guide

This directory contains all the necessary configuration files for deploying the Panda Quant platform.

## 📋 Prerequisites

- Docker and Docker Compose installed
- SSL certificates for your domain
- Domain name configured with DNS

## 🛠 Configuration Files

- `nginx.conf`: Nginx server configuration
- `Dockerfile`: Frontend build and deployment
- `Dockerfile.api`: Backend API deployment
- `docker-compose.yml`: Service orchestration
- `.env.example`: Environment variables template

## 🚀 Deployment Steps

1. **Prepare SSL Certificates**
   ```bash
   mkdir -p ssl
   # Place your SSL certificates in the ssl directory
   # your-domain.com.crt
   # your-domain.com.key
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Build and Start Services**
   ```bash
   docker-compose up -d --build
   ```

4. **Verify Deployment**
   ```bash
   # Check container status
   docker-compose ps

   # View logs
   docker-compose logs -f
   ```

## 🔧 Configuration Details

### Nginx Configuration
- Redirects HTTP to HTTPS
- Serves static files
- Proxies API requests
- SSL configuration

### Docker Configuration
- Multi-stage builds for optimization
- Volume mounts for persistence
- Environment variable injection
- Health checks

### Database
- PostgreSQL container
- Data persistence through volumes
- Automatic backup configuration

## 📊 Monitoring

- Container health checks
- Nginx access logs
- Application logs
- Database metrics

## 🔄 Maintenance

### Backup
```bash
# Backup database
docker-compose exec postgres pg_dump -U ${DB_USER} ${DB_NAME} > backup.sql

# Restore database
docker-compose exec -T postgres psql -U ${DB_USER} ${DB_NAME} < backup.sql
```

### Updates
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

## 🚨 Troubleshooting

### Common Issues

1. **SSL Certificate Errors**
   - Verify certificate paths in nginx.conf
   - Check certificate permissions
   - Ensure certificate chain is complete

2. **Database Connection Issues**
   - Verify environment variables
   - Check PostgreSQL logs
   - Ensure network connectivity

3. **Application Errors**
   - Check application logs
   - Verify environment variables
   - Ensure all services are running

### Debugging

```bash
# Enter container shell
docker-compose exec backend sh

# View Nginx configuration
docker-compose exec frontend nginx -T

# Check database connection
docker-compose exec postgres psql -U ${DB_USER} ${DB_NAME}
```

## 📚 Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) 