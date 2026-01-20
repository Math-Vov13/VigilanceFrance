# 🚀 Quick Start - Déploiement Kubernetes

## ⚡ Démarrage en 3 commandes

```bash
# 1. Démarrer Minikube (si pas déjà fait)
minikube start --cpus=4 --memory=8192 --driver=docker

# 2. Déployer l'application
cd /home/saphirdev/VigilanceFrance
./k8s/deploy.sh

# 3. Ouvrir l'application dans le navigateur
minikube service frontend-service -n vigilance-france
```

## 📋 Étapes détaillées

### Étape 1: Démarrer le cluster Minikube

```bash
minikube start --cpus=4 --memory=8192 --driver=docker
```

**Temps**: ~2 minutes

### Étape 2: Exécuter le script de déploiement

```bash
cd /home/saphirdev/VigilanceFrance
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

**Ce qui se passe:**
- ✅ Vérification des outils requis
- ✅ Activation des addons Minikube (ingress, metrics-server)
- ✅ Build de 6 images Docker
- ✅ Création du namespace `vigilance-france`
- ✅ Déploiement de MongoDB et Redis avec volumes persistants
- ✅ Déploiement de 4 microservices (auth, maps, mess, notifs)
- ✅ Déploiement de l'API Gateway
- ✅ Déploiement du Frontend React
- ✅ Configuration de l'Ingress

**Temps**: ~5-8 minutes

### Étape 3: Accéder à l'application

**Option A - Via Minikube service (RECOMMANDÉ):**
```bash
minikube service frontend-service -n vigilance-france
```
→ Ouvre automatiquement le navigateur

**Option B - Via NodePort:**
```bash
# Obtenir l'IP
minikube ip
# Exemple de sortie: 192.168.49.2

# Ouvrir dans le navigateur
http://192.168.49.2:30000
```

**Option C - Via Ingress:**
```bash
# Ajouter au fichier /etc/hosts
echo "$(minikube ip) vigilance-france.local" | sudo tee -a /etc/hosts

# Ouvrir dans le navigateur
http://vigilance-france.local
```

## 🔍 Vérifier le déploiement

### Voir tous les pods

```bash
kubectl get pods -n vigilance-france
```

**Attendu:** Tous les pods doivent être `Running` et `Ready 1/1` ou `2/2`

```
NAME                              READY   STATUS    RESTARTS   AGE
api-gateway-xxxxxxxxx-xxxxx       1/1     Running   0          2m
auth-service-xxxxxxxxx-xxxxx      1/1     Running   0          3m
auth-service-xxxxxxxxx-xxxxx      1/1     Running   0          3m
frontend-xxxxxxxxx-xxxxx          1/1     Running   0          1m
frontend-xxxxxxxxx-xxxxx          1/1     Running   0          1m
maps-service-xxxxxxxxx-xxxxx      1/1     Running   0          3m
maps-service-xxxxxxxxx-xxxxx      1/1     Running   0          3m
mess-service-xxxxxxxxx-xxxxx      1/1     Running   0          3m
mess-service-xxxxxxxxx-xxxxx      1/1     Running   0          3m
mongodb-xxxxxxxxx-xxxxx           1/1     Running   0          5m
notifs-service-xxxxxxxxx-xxxxx    1/1     Running   0          3m
redis-xxxxxxxxx-xxxxx             1/1     Running   0          5m
```

### Voir tous les services

```bash
kubectl get services -n vigilance-france
```

### Voir les logs d'un service

```bash
# Exemple: logs de l'API Gateway
kubectl logs -f deployment/api-gateway -n vigilance-france
```

## 📊 Dashboard Kubernetes

Pour une interface graphique:

```bash
minikube dashboard
```

→ Ouvre le dashboard dans le navigateur

## 🛑 Arrêter l'application

### Supprimer le déploiement (garder Minikube)

```bash
./k8s/cleanup.sh
```

### Arrêter Minikube complètement

```bash
minikube stop
```

### Supprimer Minikube complètement

```bash
minikube delete
```

## 🐛 Problèmes courants

### Problème: "minikube command not found"

**Solution:**
```bash
# Installer Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### Problème: "Images not found / ImagePullBackOff"

**Solution:**
```bash
# Utiliser le Docker daemon de Minikube
eval $(minikube docker-env)

# Re-build les images
./k8s/deploy.sh
```

### Problème: "Insufficient resources"

**Solution:**
```bash
# Arrêter Minikube
minikube stop

# Redémarrer avec plus de ressources
minikube start --cpus=6 --memory=12288 --driver=docker
```

### Problème: "Pods stuck in Pending state"

**Solution:**
```bash
# Vérifier les ressources du node
kubectl describe nodes

# Voir les événements
kubectl get events -n vigilance-france --sort-by='.lastTimestamp'

# Réduire les replicas si nécessaire
kubectl scale deployment auth-service --replicas=1 -n vigilance-france
```

## 📱 Tester l'application

1. **Accéder à la page d'accueil**: `http://<MINIKUBE_IP>:30000`
2. **S'inscrire**: Créer un nouveau compte
3. **Se connecter**: Tester l'authentification
4. **Voir la carte**: Accéder à `/map`
5. **Créer un incident**: Ajouter un incident sur la carte
6. **Tester les commentaires**: Ajouter un commentaire sur un incident

## 🎓 Pour le rendu du projet

### Preuves de fonctionnement Kubernetes

**Captures d'écran à prendre:**

1. **Sortie de `kubectl get pods -n vigilance-france`**
2. **Sortie de `kubectl get services -n vigilance-france`**
3. **Dashboard Minikube montrant les deployments**
4. **L'application fonctionnant dans le navigateur**
5. **Logs d'un microservice: `kubectl logs <pod> -n vigilance-france`**

**Commandes à documenter:**
```bash
# Structure du cluster
kubectl get all -n vigilance-france

# Détails d'un deployment
kubectl describe deployment auth-service -n vigilance-france

# Configuration des services
kubectl get configmap vigilance-config -n vigilance-france -o yaml

# Volumes persistants
kubectl get pv,pvc -n vigilance-france
```

## 📚 Documentation complète

Pour plus de détails, consultez: [k8s/README.md](./README.md)

## ✅ Checklist avant le rendu

- [ ] Minikube installé et fonctionnel
- [ ] Tous les pods sont `Running`
- [ ] Application accessible via le navigateur
- [ ] Captures d'écran prises
- [ ] README principal du projet mis à jour avec les instructions K8s
- [ ] Fichiers Kubernetes commités dans Git

---

**Bon courage pour votre projet! 🚀**
