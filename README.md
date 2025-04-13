# VigilanceFrance

Une plateforme collaborative pour suivre et signaler les incidents partout en France.
Ce projet est inspiré du 3ème projet du module Node.js et aspire à la notion de contribution dans la signalisation des dangers et à l'apport d'informations.


## Équipe & Rôles
- ACHOUCHI Rayane - Frontend & Design
- VOVARD Mathéo - Backend, BDD & Microservices
- MARQUES DINIS Joao Gabriel - Backend, Messages Microservice

## Caractéristiques

- Carte interactive des incidents avec Google Maps
- Système d'authentification
- Ajout et suivi d'incidents en temps réel
- Filtrage des incidents par type et sévérité
- Commentaires et discussions autour des incidents

## Technologies

- React
- TypeScript
- Vite.js
- Tailwind CSS
- Shadcn/UI
- Google Maps Platform
- React Router
- TypeScript
- Socket.io
- ExpressJS
- 

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/Math-Vov13/VigilanceFrance
cd vigilance-france
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```
Puis modifiez le fichier `.env` pour ajouter votre clé API Google Maps.

4. Démarrez le serveur de développement :
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## Structure du projet

- `src/components` : Composants réutilisables
- `src/pages` : Pages principales de l'application
- `src/context` : Contextes React pour la gestion d'état global
- `src/hooks` : Hooks React personnalisés
- `src/lib` : Fonctions utilitaires
- `src/types` : Types TypeScript

## Obtenir une clé API Google Maps

1. Créez un compte sur [Google Cloud Platform](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API Maps JavaScript
4. Créez une clé API avec les restrictions appropriées
5. Ajoutez cette clé dans votre fichier `.env`

## Déploiement

Pour construire l'application pour la production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist`.

## Licence

Ce projet est sous licence MIT.
