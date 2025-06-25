#!/bin/bash
# deployment/scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="/backups"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Database configuration
DB_HOST=${DB_HOST:-"db"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${POSTGRES_DB}
DB_USER=${POSTGRES_USER}

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Database backup
backup_database() {
    log_info "Starting database backup..."
    
    local backup_file="$BACKUP_DIR/database_backup_$TIMESTAMP.sql"
    
    # Create database dump
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > "$backup_file"; then
        # Compress the backup
        gzip "$backup_file"
        log_info "Database backup completed: ${backup_file}.gz"
        
        # Verify backup file
        if [[ -f "${backup_file}.gz" && -s "${backup_file}.gz" ]]; then
            log_info "Backup file verified successfully"
        else
            log_error "Backup file verification failed"
            return 1
        fi
    else
        log_error "Database backup failed"
        return 1
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log_info "Cleaning up backups older than $RETENTION_DAYS days..."
    
    # Remove database backups older than retention period
    find "$BACKUP_DIR" -name "database_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    # Remove any other backup files older than retention period
    find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    log_info "Cleanup completed"
}

# Backup application files (if needed)
backup_files() {
    log_info "Creating application files backup..."
    
    local backup_file="$BACKUP_DIR/files_backup_$TIMESTAMP.tar.gz"
    
    # Backup important application files
    tar -czf "$backup_file" \
        --exclude='*.log' \
        --exclude='__pycache__' \
        --exclude='node_modules' \
        --exclude='.git' \
        -C /app . 2>/dev/null || true
    
    if [[ -f "$backup_file" ]]; then
        log_info "Files backup completed: $backup_file"
    else
        log_warn "Files backup was not created"
    fi
}

# Create backup manifest
create_manifest() {
    local manifest_file="$BACKUP_DIR/backup_manifest_$TIMESTAMP.txt"
    
    cat > "$manifest_file" << EOF
SmartStudy AI+ Backup Manifest
==============================
Backup Date: $(date)
Database: $DB_NAME
Files included:
$(ls -la "$BACKUP_DIR"/*_$TIMESTAMP.*)

System Information:
- Hostname: $(hostname)
- OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)
- Docker Version: $(docker --version 2>/dev/null || echo "Not available")

Backup Statistics:
$(du -sh "$BACKUP_DIR"/*_$TIMESTAMP.* 2>/dev/null || echo "No backup files found")
EOF

    log_info "Backup manifest created: $manifest_file"
}

# Send backup notification (optional)
send_notification() {
    if [[ -n "${BACKUP_WEBHOOK_URL:-}" ]]; then
        local message="SmartStudy AI+ backup completed successfully at $(date)"
        curl -X POST "$BACKUP_WEBHOOK_URL" \
             -H "Content-Type: application/json" \
             -d "{\"text\":\"$message\"}" \
             2>/dev/null || log_warn "Failed to send backup notification"
    fi
}

# Health check for backup files
verify_backups() {
    log_info "Verifying backup integrity..."
    
    local backup_count=$(find "$BACKUP_DIR" -name "*_$TIMESTAMP.*" -type f | wc -l)
    
    if [[ $backup_count -gt 0 ]]; then
        log_info "Found $backup_count backup files for timestamp $TIMESTAMP"
        
        # Test database backup integrity
        local db_backup=$(find "$BACKUP_DIR" -name "database_backup_$TIMESTAMP.sql.gz" -type f)
        if [[ -n "$db_backup" ]]; then
            if gunzip -t "$db_backup" 2>/dev/null; then
                log_info "Database backup integrity verified"
            else
                log_error "Database backup integrity check failed"
                return 1
            fi
        fi
        
        return 0
    else
        log_error "No backup files found for timestamp $TIMESTAMP"
        return 1
    fi
}

# Restore database from backup
restore_database() {
    local backup_file="$1"
    
    if [[ -z "$backup_file" ]]; then
        log_error "Please provide backup file path"
        return 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi
    
    log_warn "This will restore the database from backup: $backup_file"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Restoring database from backup..."
        
        # Drop existing connections
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
             -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME';" 2>/dev/null || true
        
        # Drop and recreate database
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
             -c "DROP DATABASE IF EXISTS $DB_NAME;" \
             -c "CREATE DATABASE $DB_NAME;"
        
        # Restore from backup
        if [[ "$backup_file" == *.gz ]]; then
            gunzip -c "$backup_file" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"
        else
            psql