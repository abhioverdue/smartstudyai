

set -e

echo "🚀 Starting SmartStudy AI+ deployment..."

# Configuration
PROJECT_NAME="smartstudy-ai"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    command -v docker >/dev/null 2>&1 || { 
        log_error "Docker is required but not installed. Aborting."
        exit 1
    }
    
    command -v docker-compose >/dev/null 2>&1 || { 
        log_error "Docker Compose is required but not installed. Aborting."
        exit 1
    }
    
    log_info "Dependencies check passed ✅"
}

# Check environment file
check_env_file() {
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Environment file $ENV_FILE not found!"
        log_info "Creating template environment file..."
        create_env_template
        log_warn "Please edit $ENV_FILE with your configuration and run the script again."
        exit 1
    fi
    
    # Load environment variables
    source "$ENV_FILE"
    
    # Validate required variables
    required_vars=("POSTGRES_DB" "POSTGRES_USER" "POSTGRES_PASSWORD" "SECRET_KEY" "OPENAI_API_KEY")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            log_error "Required environment variable $var is not set in $ENV_FILE"
            exit 1
        fi
    done
    
    log_info "Environment file validation passed ✅"
}

# Create environment template
create_env_template() {
    cat > "$ENV_FILE" << EOF
# Database Configuration
POSTGRES_DB=smartstudy
POSTGRES_USER=smartstudy_user
POSTGRES_PASSWORD=change_this_secure_password

# Application Security
SECRET_KEY=change_this_to_a_random_secret_key
OPENAI_API_KEY=your_openai_api_key_here

# Network Configuration
ALLOWED_HOSTS=["http://localhost:3000","https://yourdomain.com"]

# Optional: SSL Configuration
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem

# Backup Configuration
BACKUP_RETENTION_DAYS=7
EOF
}

# Create required directories
create_directories() {
    log_info "Creating required directories..."
    
    directories=(
        "./logs"
        "./backups"
        "./nginx/ssl"
        "./data/postgres"
        "./data/redis"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        log_info "Created directory: $dir"
    done
}

# Generate SSL certificate (self-signed for development)
generate_ssl_cert() {
    if [[ ! -f "./nginx/ssl/cert.pem" ]] || [[ ! -f "./nginx/ssl/key.pem" ]]; then
        log_info "Generating self-signed SSL certificate..."
        
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ./nginx/ssl/key.pem \
            -out ./nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        
        log_info "SSL certificate generated ✅"
        log_warn "Using self-signed certificate. Replace with proper SSL certificate for production!"
    fi
}

# Backup existing data
backup_data() {
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_info "Creating backup before deployment..."
        docker-compose -f "$COMPOSE_FILE" exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "./backups/backup_$(date +%Y%m%d_%H%M%S).sql"
        log_info "Backup created ✅"
    fi
}

# Pull latest images
pull_images() {
    log_info "Pulling latest Docker images..."
    docker-compose -f "$COMPOSE_FILE" pull
    log_info "Images pulled ✅"
}

# Build custom images
build_images() {
    log_info "Building custom images..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    log_info "Images built ✅"
}

# Deploy application
deploy() {
    log_info "Deploying application..."
    
    # Start services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Run database migrations
    log_info "Running database migrations..."
    docker-compose -f "$COMPOSE_FILE" run --rm migration
    
    log_info "Deployment completed ✅"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Check if containers are running
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_error "Some containers are not running!"
        docker-compose -f "$COMPOSE_FILE" ps
        return 1
    fi
    
    # Check API health endpoint
    sleep 10
    if curl -f http://localhost/health >/dev/null 2>&1; then
        log_info "Health check passed ✅"
    else
        log_error "Health check failed!"
        return 1
    fi
}

# Show status
show_status() {
    log_info "Deployment Status:"
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    log_info "🎉 SmartStudy AI+ is now running!"
    log_info "API: http://localhost/api/v1"
    log_info "Health Check: http://localhost/health"
    echo ""
    log_info "Logs: docker-compose -f $COMPOSE_FILE logs -f"
    log_info "Stop: docker-compose -f $COMPOSE_FILE down"
}

# Cleanup on failure
cleanup() {
    log_error "Deployment failed! Cleaning up..."
    docker-compose -f "$COMPOSE_FILE" down
    exit 1
}

# Main deployment process
main() {
    log_info "SmartStudy AI+ Deployment Script"
    echo "================================="
    
    # Trap errors
    trap cleanup ERR
    
    # Pre-deployment checks
    check_root
    check_dependencies
    check_env_file
    create_directories
    generate_ssl_cert
    
    # Deployment process
    backup_data
    pull_images
    build_images
    deploy
    
    # Post-deployment
    health_check
    show_status
    
    log_info "🎉 Deployment completed successfully!"
}

# Handle command line arguments
case "${1:-}" in
    "backup")
        backup_data
        ;;
    "health")
        health_check
        ;;
    "status")
        show_status
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" logs -f "${2:-}"
        ;;
    "down")
        log_info "Stopping SmartStudy AI+..."
        docker-compose -f "$COMPOSE_FILE" down
        ;;
    "restart")
        log_info "Restarting SmartStudy AI+..."
        docker-compose -f "$COMPOSE_FILE" restart
        ;;
    *)
        main
        ;;
esac