#!/bin/bash

# Helper script to run Prisma commands in Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker Compose is running
check_services() {
    if ! docker-compose ps | grep -q "postgres.*Up"; then
        print_error "PostgreSQL service is not running. Please start it first:"
        echo "  docker-compose up -d postgres"
        exit 1
    fi
}

# Function to wait for database to be ready
wait_for_db() {
    print_status "Waiting for database to be ready..."
    timeout=30
    counter=0
    
    while [ $counter -lt $timeout ]; do
        if docker-compose exec postgres pg_isready -U romeo -d romeo >/dev/null 2>&1; then
            print_status "Database is ready!"
            return 0
        fi
        counter=$((counter + 1))
        sleep 1
    done
    
    print_error "Database failed to become ready within ${timeout} seconds"
    exit 1
}

# Function to run Prisma commands
run_prisma_command() {
    local command=$1
    print_status "Running: prisma $command"
    docker-compose exec migrations pnpm run "db:$command"
}

# Function to run raw Prisma command
run_raw_prisma() {
    local command=$1
    print_status "Running: prisma $command"
    docker-compose exec migrations pnpm exec prisma $command
}

# Main script logic
case "$1" in
    "setup")
        print_status "Setting up database with Docker Compose..."
        docker-compose up -d postgres
        wait_for_db
        
        # Build and start migrations service
        print_status "Building migrations service..."
        docker-compose build migrations
        docker-compose up -d migrations
        
        print_status "Generating Prisma client..."
        run_prisma_command "generate"
        
        print_status "Pushing schema to database..."
        run_prisma_command "push"
        
        print_status "Database setup complete!"
        ;;
    
    "push")
        check_services
        docker-compose up -d migrations
        run_prisma_command "push"
        ;;
    
    "migrate")
        check_services
        docker-compose up -d migrations
        if [ -n "$2" ]; then
            run_raw_prisma "migrate dev --name $2"
        else
            run_prisma_command "migrate"
        fi
        ;;
    
    "generate")
        check_services
        docker-compose up -d migrations
        run_prisma_command "generate"
        ;;
    
    "studio")
        check_services
        docker-compose up -d migrations
        print_status "Starting Prisma Studio..."
        docker-compose exec migrations pnpm run db:studio
        ;;
    
    "reset")
        check_services
        docker-compose up -d migrations
        print_warning "This will reset your database. Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            run_raw_prisma "migrate reset --force"
        else
            print_status "Database reset cancelled"
        fi
        ;;
    
    "shell")
        check_services
        docker-compose up -d migrations
        print_status "Opening shell in migrations container..."
        docker-compose exec migrations /bin/sh
        ;;
    
    "psql")
        check_services
        print_status "Connecting to PostgreSQL..."
        docker-compose exec postgres psql -U romeo -d romeo
        ;;
    
    "logs")
        docker-compose logs -f migrations
        ;;
    
    "down")
        print_status "Stopping services..."
        docker-compose down
        ;;
    
    "worker")
        print_status "Starting worker service..."
        docker-compose up -d worker
        ;;
    
    "worker-logs")
        print_status "Showing worker service logs..."
        docker-compose logs -f worker
        ;;
    
    "worker-shell")
        check_services
        docker-compose up -d worker
        print_status "Opening shell in worker container..."
        docker-compose exec worker /bin/sh
        ;;
    
    "full-setup")
        print_status "Setting up complete Romeo system with Docker..."
        
        # Check if .env exists
        if [ ! -f ".env" ]; then
            print_error "No .env file found. Please copy docker.env to .env and configure your OpenAI API key:"
            echo "  cp docker.env .env"
            echo "  # Then edit .env with your OpenAI API key"
            exit 1
        fi
        
        # Start database
        docker-compose up -d postgres
        wait_for_db
        
        # Setup migrations
        print_status "Building migrations service..."
        docker-compose build migrations
        docker-compose up -d migrations
        
        print_status "Generating Prisma client..."
        run_prisma_command "generate"
        
        print_status "Pushing schema to database..."
        run_prisma_command "push"
        
        # Start worker
        print_status "Building and starting worker service..."
        docker-compose build worker
        docker-compose up -d worker
        
        print_status "Complete Romeo system setup finished!"
        print_status "Services available:"
        echo "  • Database: PostgreSQL on port 5432"
        echo "  • Worker API: http://localhost:3030"
        echo "  • Health check: curl http://localhost:3030/api/health"
        echo "  • Chat API: curl -X POST http://localhost:3030/api/chat -H \"Content-Type: application/json\" -d '{\"message\": \"Hello!\"}'"
        ;;
    
    "clean")
        print_warning "This will remove all containers and volumes. Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            docker-compose down -v
            docker-compose rm -f
        else
            print_status "Clean cancelled"
        fi
        ;;
    
    *)
        echo "Usage: $0 {setup|push|migrate|generate|studio|reset|shell|psql|logs|down|clean|worker|worker-logs|worker-shell|full-setup}"
        echo ""
        echo "Database Commands:"
        echo "  setup     - Set up database and run initial migration"
        echo "  push      - Push schema changes to database (db:push)"
        echo "  migrate   - Run database migrations (db:migrate)"
        echo "  generate  - Generate Prisma client (db:generate)"
        echo "  studio    - Open Prisma Studio"
        echo "  reset     - Reset database (WARNING: destructive)"
        echo "  shell     - Open shell in migrations container"
        echo "  psql      - Connect to PostgreSQL directly"
        echo "  logs      - Show migrations service logs"
        echo ""
        echo "Worker Commands:"
        echo "  worker        - Start worker service"
        echo "  worker-logs   - Show worker service logs"
        echo "  worker-shell  - Open shell in worker container"
        echo "  full-setup    - Complete Romeo system setup (database + worker)"
        echo ""
        echo "System Commands:"
        echo "  down      - Stop all services"
        echo "  clean     - Remove all containers and volumes"
        echo ""
        echo "Examples:"
        echo "  $0 full-setup               # Complete system setup"
        echo "  $0 setup                    # Database setup only"
        echo "  $0 worker                   # Start worker service"
        echo "  $0 push                     # Push schema changes"
        echo "  $0 migrate add-user-table   # Create named migration"
        exit 1
        ;;
esac 