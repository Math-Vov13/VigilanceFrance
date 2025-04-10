# Système d'Authentification de VigilanceFrance

## Architecture avec Double Tokens

VigilanceFrance utilise un système d'authentification avec double tokens pour une sécurité renforcée:

1. **Token d'Authentification (Auth Token)**
   - Stocké dans un cookie HTTP-only
   - Envoyé automatiquement avec chaque requête HTTP
   - Inaccessible au JavaScript côté client (protection contre les attaques XSS)
   - Durée de vie courte (généralement 15-30 minutes)

2. **Token de Rafraîchissement (Refresh Token)**
   - Stocké dans le localStorage
   - Utilisé uniquement pour obtenir un nouveau token d'authentification
   - Durée de vie plus longue (généralement plusieurs jours)

## Flux d'Authentification

### Connexion

1. L'utilisateur s'authentifie via le formulaire de connexion (email/mot de passe)
2. Le serveur valide les identifiants et renvoie:
   - Un cookie HTTP-only contenant le token d'authentification
   - Un refresh token dans le corps de la réponse
3. Le frontend stocke le refresh token dans localStorage
4. L'utilisateur est considéré comme authentifié

### Vérification Automatique

Toutes les requêtes API incluent automatiquement le cookie d'authentification sans intervention du code JavaScript.

### Renouvellement de Token

1. Lorsqu'une requête API reçoit une réponse 401 (Unauthorized):
   - L'intercepteur Axios détecte l'erreur
   - Il appelle l'endpoint `/auth/refresh` avec le refresh token
   - Le serveur vérifie le refresh token et génère un nouveau auth token (cookie)
   - La requête originale est automatiquement réessayée avec le nouveau token

2. Si le refresh token est invalide:
   - L'utilisateur est déconnecté
   - Le refresh token est supprimé du localStorage
   - L'utilisateur est redirigé vers la page de connexion

### Déconnexion

1. L'utilisateur clique sur "Déconnexion"
2. Le frontend:
   - Appelle l'endpoint `/auth/logout`
   - Supprime le refresh token du localStorage
3. Le serveur:
   - Invalide les tokens côté serveur
   - Supprime le cookie d'authentification

## Implémentation Technique

### Côté Frontend

L'intercepteur Axios est configuré pour gérer le renouvellement automatique des tokens:

```typescript
// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si erreur 401 et nous avons un refresh token
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      const originalRequest = error.config;
      
      if (refreshToken && !originalRequest.url?.includes('/auth/refresh')) {
        try {
          // Demander un nouveau token d'authentification
          await apiClient.post('/auth/refresh');
          
          // Réessayer la requête originale
          return apiClient(originalRequest);
        } catch (error) {
          // Échec du refresh, déconnexion
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### Risques et Mitigations

1. **Vol du Refresh Token**
   - Le refresh token dans localStorage peut être vulnérable aux attaques XSS
   - Mitigation: Validation côté serveur, liste de révocation de tokens

2. **Expiration et Inactivité**
   - Expiration brève du token d'authentification (15-30 min)
   - Déconnexion après une longue période d'inactivité

3. **Transport sécurisé**
   - Tous les cookies sont configurés avec les flags `Secure` et `SameSite=Strict`
   - Communication exclusivement en HTTPS

## Configuration des Cookies

Le serveur doit configurer correctement les cookies d'authentification:

```javascript
// Exemple côté serveur (Express.js)
res.cookie('auth_token', token, {
  httpOnly: true,        // Inaccessible au JavaScript
  secure: true,          // Uniquement sur HTTPS
  sameSite: 'strict',    // Protection CSRF
  maxAge: 900000         // 15 minutes en millisecondes
});
```

## Développement Local

Pour le développement local, assurez-vous que:

1. Le serveur et le client sont sur le même domaine ou que CORS est correctement configuré pour les cookies
2. En environnement de développement, vous pouvez désactiver temporairement `secure: true` si vous n'utilisez pas HTTPS