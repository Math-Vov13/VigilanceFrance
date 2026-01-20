#!/bin/bash

# VigilanceFrance - Script de déploiement Kubernetes
# Auteur: Projet VigilanceFrance
# Description: Déploie l'application complète sur un cluster Kubernetes (Minikube)

set -e  # Arrête le script en cas d'erreur

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  VigilanceFrance - Déploiement K8s   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier que minikube est installé
if ! command -v minikube &> /dev/null; then
    echo -e "${RED}❌ Minikube n'est pas installé!${NC}"
    echo "Installez-le avec: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

# Vérifier que kubectl est installé
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl n'est pas installé!${NC}"
    echo "Installez-le avec: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

echo -e "${GREEN}✓ Outils requis détectés${NC}"
echo ""

# Démarrer Minikube si nécessaire
echo -e "${YELLOW}📦 Vérification de Minikube...${NC}"
if ! minikube status &> /dev/null; then
    echo -e "${YELLOW}🚀 Démarrage de Minikube...${NC}"
    minikube start --cpus=4 --memory=8192 --driver=docker
else
    echo -e "${GREEN}✓ Minikube est déjà démarré${NC}"
fi
echo ""

# Activer les addons nécessaires
echo -e "${YELLOW}🔌 Activation des addons Minikube...${NC}"
minikube addons enable ingress
minikube addons enable metrics-server
echo -e "${GREEN}✓ Addons activés${NC}"
echo ""

# Utiliser le Docker daemon de Minikube
echo -e "${YELLOW}🐳 Configuration de Docker pour Minikube...${NC}"
eval $(minikube docker-env)
echo -e "${GREEN}✓ Docker configuré${NC}"
echo ""

# Build des images Docker
echo -e "${YELLOW}🏗️  Construction des images Docker...${NC}"

echo "  → Building auth-service..."
docker build -t vigilance/auth-service:latest ./backend/microservices/auth-service

echo "  → Building maps-service..."
docker build -t vigilance/maps-service:latest ./backend/microservices/maps-service

echo "  → Building mess-service..."
docker build -t vigilance/mess-service:latest ./backend/microservices/messages-service

echo "  → Building notifs-service..."
docker build -t vigilance/notifs-service:latest ./backend/microservices/notifs-service

echo "  → Building api-gateway..."
docker build -t vigilance/api-gateway:latest ./backend/api-gateway

echo -e "${GREEN}✓ Images backend construites (frontend servira depuis votre machine)${NC}"
echo ""

# Déploiement Kubernetes
echo -e "${YELLOW}☸️  Déploiement sur Kubernetes...${NC}"

# 1. Namespace
echo "  → Création du namespace..."
kubectl apply -f k8s/base/namespace.yaml

# 2. ConfigMap et Secrets
echo "  → Application des ConfigMaps et Secrets..."
kubectl apply -f k8s/base/configmap.yaml
kubectl apply -f k8s/base/secrets.yaml

# 3. Volumes persistants
echo "  → Création des PersistentVolumes..."
kubectl apply -f k8s/databases/persistent-volumes.yaml

# 4. Bases de données
echo "  → Déploiement de MongoDB..."
kubectl apply -f k8s/databases/mongodb.yaml

echo "  → Déploiement de Redis..."
kubectl apply -f k8s/databases/redis.yaml

# Attendre que les bases de données soient prêtes
echo "  → Attente du démarrage des bases de données..."
kubectl wait --for=condition=ready pod -l app=mongodb -n vigilance-france --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis -n vigilance-france --timeout=120s

# 5. Microservices
echo "  → Déploiement des microservices..."
kubectl apply -f k8s/microservices/auth-service.yaml
kubectl apply -f k8s/microservices/maps-service.yaml
kubectl apply -f k8s/microservices/mess-service.yaml
kubectl apply -f k8s/microservices/notifs-service.yaml

# Attendre que les microservices soient prêts
echo "  → Attente du démarrage des microservices..."
kubectl wait --for=condition=ready pod -l app=auth-service -n vigilance-france --timeout=120s
kubectl wait --for=condition=ready pod -l app=maps-service -n vigilance-france --timeout=120s
kubectl wait --for=condition=ready pod -l app=mess-service -n vigilance-france --timeout=120s
kubectl wait --for=condition=ready pod -l app=notifs-service -n vigilance-france --timeout=120s

# 6. API Gateway
echo "  → Déploiement de l'API Gateway..."
kubectl apply -f k8s/microservices/api-gateway.yaml

kubectl wait --for=condition=ready pod -l app=api-gateway -n vigilance-france --timeout=120s

# 7. Frontend
echo "  → Déploiement du Frontend..."
kubectl apply -f k8s/frontend/frontend.yaml

kubectl wait --for=condition=ready pod -l app=frontend -n vigilance-france --timeout=120s

echo -e "${GREEN}✓ Déploiement terminé!${NC}"
echo ""

# Afficher les informations
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Application déployée avec succès!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}📊 État des pods:${NC}"
kubectl get pods -n vigilance-france
echo ""

echo -e "${YELLOW}🌐 Services:${NC}"
kubectl get services -n vigilance-france
echo ""

# Obtenir l'URL de l'application
MINIKUBE_IP=$(minikube ip)
echo -e "${GREEN}🎉 Application accessible à:${NC}"
echo -e "   ${BLUE}http://${MINIKUBE_IP}:30000${NC}"
echo ""

echo -e "${YELLOW}💡 Commandes utiles:${NC}"
echo "   • Voir les pods:        kubectl get pods -n vigilance-france"
echo "   • Voir les logs:        kubectl logs <pod-name> -n vigilance-france"
echo "   • Dashboard Minikube:   minikube dashboard"
echo "   • Accéder au frontend:  minikube service frontend-service -n vigilance-france"
echo ""

echo -e "${YELLOW}📝 Pour ajouter vigilance-france.local à /etc/hosts:${NC}"
echo "   echo \"${MINIKUBE_IP} vigilance-france.local\" | sudo tee -a /etc/hosts"
echo ""

echo -e "${GREEN}Bon développement! 🚀${NC}"
