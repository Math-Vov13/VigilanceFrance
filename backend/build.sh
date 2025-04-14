#!/bin/bash

# File used to build each container
#> Mathéo Vovard

# Very basic file... (no need to add complex things)

# COLORS
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check cmd success state
check_success() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR while running this command : $1${NC}"
        exit 1
    else
        echo -e "${GREEN}Built Successfully : $1${NC}"
    fi
}

echo -e "${YELLOW}Building Backend...${NC}"
echo ''

## API GATEWAY
echo -e "${YELLOW}Api Gateway :${NC}"
cd ./api-gateway || { echo -e "${RED}ERROR : Folder 'api-gateway' not found!${NC}"; exit 1; }
pwd
npm run build
check_success "Api Gateway"

cd ../microservices || { echo -e "${RED}ERROR : Folder 'microservices' not found!${NC}"; exit 1; }

## Auth Service
echo -e "${YELLOW}Auth Service :${NC}"
cd ./auth-service || { echo -e "${RED}ERROR : Folder 'auth-service' not found!${NC}"; exit 1; }
pwd
npm run build
check_success "Auth Service"
cd ..

## Maps Service
echo -e "${YELLOW}Maps Service :${NC}"
cd ./maps-service || { echo -e "${RED}ERROR : Folder 'maps-service' not found!${NC}"; exit 1; }
pwd
npm run build
check_success "Maps Service"
cd ..

## Messages Service
echo -e "${YELLOW}Messages Service :${NC}"
cd ./messages-service || { echo -e "${RED}ERROR : Folder 'messages-service' not found!${NC}"; exit 1; }
pwd
npm run build
check_success "Messages Service"
cd ..

## Notifs Service
echo -e "${YELLOW}Notifs Service :${NC}"
cd ./notifs-service || { echo -e "${RED}ERROR : Folder 'notifs-service' not found!${NC}"; exit 1; }
pwd
npm run build
check_success "Notifs Service"
cd ..

## END
echo -e "${GREEN}All Processes finished!${NC}"
echo '';
echo "ENJOY !!!!";

exit 0