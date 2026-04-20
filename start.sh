#!/usr/bin/env bash
# ============================================================
#  Job Portal — Start All Services
#  Works in: Git Bash, WSL, or any bash on Windows
# ============================================================

set -e

# ── Colors ──────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ── Paths (Windows-style for Git Bash) ──────────────────────
JAVA_HOME="/c/Program Files/Java/jdk-17"
MAVEN_HOME="$HOME/.m2/apache-maven-3.9.6"
MONGODB_BIN="/c/Program Files/MongoDB/Server/8.2/bin"
MONGODB_CFG="C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.cfg"

# Project directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Add to PATH
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$MAVEN_HOME/bin:$MONGODB_BIN:$PATH"

echo ""
echo -e "${BOLD}${CYAN}============================================${NC}"
echo -e "${BOLD}${CYAN}   JOB PORTAL — Starting All Services      ${NC}"
echo -e "${BOLD}${CYAN}============================================${NC}"
echo ""

# ── Step 1: MongoDB ─────────────────────────────────────────
echo -e "${YELLOW}[1/3] Checking MongoDB...${NC}"

if netstat -ano 2>/dev/null | grep -q ":27017.*LISTENING"; then
    echo -e "${GREEN}  ✓ MongoDB already running on port 27017${NC}"
else
    echo -e "  Starting MongoDB..."
    "$MONGODB_BIN/mongod.exe" --config "$MONGODB_CFG" &
    sleep 3
    echo -e "${GREEN}  ✓ MongoDB started${NC}"
fi

# ── Step 2: Backend ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[2/3] Starting Spring Boot Backend...${NC}"

# Kill any process already on 8080
PID_8080=$(netstat -ano 2>/dev/null | grep ":8080.*LISTENING" | awk '{print $5}' | head -1)
if [ -n "$PID_8080" ]; then
    echo -e "  Port 8080 in use (PID $PID_8080) — killing it..."
    taskkill //PID "$PID_8080" //F 2>/dev/null || true
    sleep 2
fi

cd "$SCRIPT_DIR"
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8080" &
BACKEND_PID=$!
echo -e "${GREEN}  ✓ Backend starting (PID $BACKEND_PID)...${NC}"
echo -e "  Waiting for backend to be ready..."

# Wait until port 8080 is listening (max 60 seconds)
for i in $(seq 1 30); do
    if netstat -ano 2>/dev/null | grep -q ":8080.*LISTENING"; then
        echo -e "${GREEN}  ✓ Backend is UP at http://localhost:8080/api${NC}"
        break
    fi
    printf "  Waiting... (%ds)\r" "$((i * 2))"
    sleep 2
done

# ── Step 3: Frontend ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/3] Starting React Frontend...${NC}"

# Kill any process already on 3000
PID_3000=$(netstat -ano 2>/dev/null | grep ":3000.*LISTENING" | awk '{print $5}' | head -1)
if [ -n "$PID_3000" ]; then
    echo -e "  Port 3000 in use (PID $PID_3000) — killing it..."
    taskkill //PID "$PID_3000" //F 2>/dev/null || true
    sleep 1
fi

cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}  ✓ Frontend starting (PID $FRONTEND_PID)...${NC}"

sleep 3

# ── Summary ─────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}============================================${NC}"
echo -e "${BOLD}${GREEN}   All Services Running!                   ${NC}"
echo -e "${BOLD}${GREEN}============================================${NC}"
echo ""
echo -e "  ${CYAN}MongoDB  ${NC}: localhost:27017"
echo -e "  ${CYAN}Backend  ${NC}: http://localhost:8080/api"
echo -e "  ${CYAN}Frontend ${NC}: http://localhost:3000"
echo ""
echo -e "  ${YELLOW}Demo Accounts:${NC}"
echo -e "  Student  : student@example.com  / Student@123"
echo -e "  Employer : employer@techcorp.com / Employer@123"
echo -e "  Admin    : admin@jobportal.com   / Admin@123"
echo ""
echo -e "  Press ${RED}Ctrl+C${NC} to stop all services"
echo ""

# Keep script alive — wait for both background processes
wait $BACKEND_PID $FRONTEND_PID
