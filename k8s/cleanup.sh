#!/bin/bash

# VigilanceFrance - Script de nettoyage Kubernetes
# Supprime tous les composants déployés

set -e

# Couleurs
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}🗑️  Nettoyage du déploiement VigilanceFrance...${NC}"
echo ""

# Supprimer dans l'ordre inverse du déploiement
echo "→ Suppression du frontend..."
kubectl delete -f k8s/frontend/frontend.yaml --ignore-not-found=true

echo "→ Suppression de l'API Gateway..."
kubectl delete -f k8s/microservices/api-gateway.yaml --ignore-not-found=true

echo "→ Suppression des microservices..."
kubectl delete -f k8s/microservices/notifs-service.yaml --ignore-not-found=true
kubectl delete -f k8s/microservices/mess-service.yaml --ignore-not-found=true
kubectl delete -f k8s/microservices/maps-service.yaml --ignore-not-found=true
kubectl delete -f k8s/microservices/auth-service.yaml --ignore-not-found=true

echo "→ Suppression des bases de données..."
kubectl delete -f k8s/databases/redis.yaml --ignore-not-found=true
kubectl delete -f k8s/databases/mongodb.yaml --ignore-not-found=true

echo "→ Suppression des volumes persistants..."
kubectl delete -f k8s/databases/persistent-volumes.yaml --ignore-not-found=true

echo "→ Suppression des ConfigMaps et Secrets..."
kubectl delete -f k8s/base/secrets.yaml --ignore-not-found=true
kubectl delete -f k8s/base/configmap.yaml --ignore-not-found=true

echo "→ Suppression du namespace..."
kubectl delete -f k8s/base/namespace.yaml --ignore-not-found=true

echo ""
echo -e "${GREEN}✓ Nettoyage terminé!${NC}"
echo ""

read -p "Voulez-vous aussi arrêter Minikube? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🛑 Arrêt de Minikube...${NC}"
    minikube stop
    echo -e "${GREEN}✓ Minikube arrêté${NC}"
fi
