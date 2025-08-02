# Guide de Déploiement GitHub Pages

Ce guide explique comment déployer l'application **Recours Ticketing** sur GitHub Pages.

## Configuration Automatique

L'application est configurée pour se déployer automatiquement sur GitHub Pages via GitHub Actions.

### Étapes de Configuration

1. **Activez GitHub Pages dans votre repository :**
   - Allez dans `Settings` > `Pages`
   - Source : `Deploy from a branch`
   - Branch : `gh-pages`
   - Folder : `/ (root)`

2. **Permissions GitHub Actions :**
   - Allez dans `Settings` > `Actions` > `General`
   - Dans "Workflow permissions", sélectionnez "Read and write permissions"
   - Activez "Allow GitHub Actions to create and approve pull requests"

3. **Push vers la branche main :**
   ```bash
   git add .
   git commit -m "Configuration GitHub Pages"
   git push origin main
   ```

## Déploiement Manuel

Si vous préférez déployer manuellement :

```bash
# Build pour GitHub Pages
npm run build:github-pages

# Ou avec préparation du 404.html
npm run deploy:github-pages
```

Puis utilisez `gh-pages` CLI ou copiez manuellement le contenu de `dist/recours-ticketing/browser/` vers la branche `gh-pages`.

## Structure des Fichiers de Déploiement

### Configuration Angular (`angular.json`)
- Configuration `github-pages` avec `baseHref: "/recours-ticketing/"`
- Optimisations de production

### Workflow GitHub Actions (`.github/workflows/deploy.yml`)
- Build automatique sur push vers `main`
- Copie de `index.html` vers `404.html` pour le routing SPA
- Ajout du fichier `.nojekyll`
- Déploiement vers la branche `gh-pages`

### Gestion du Routing SPA
- Le fichier `404.html` est une copie d'`index.html`
- Permet le routing côté client pour Angular
- Gère les accès directs aux routes `/recours`, `/tickets`, etc.

## Vérification du Déploiement

Après le déploiement, l'application sera accessible à :
```
https://[votre-username].github.io/recours-ticketing/
```

### Points de Contrôle

1. **Build réussi :** Vérifiez les logs GitHub Actions
2. **Fichiers générés :** `dist/recours-ticketing/browser/` contient tous les assets
3. **404.html présent :** Pour le routing SPA
4. **Assets correctement référencés :** Avec le baseHref `/recours-ticketing/`

## Troubleshooting

### Erreurs communes

1. **404 sur les routes** : Vérifiez que `404.html` est bien copié depuis `index.html`
2. **Assets non trouvés** : Vérifiez le `baseHref` dans la configuration
3. **Permissions GitHub** : Activez les permissions d'écriture pour GitHub Actions

### Commandes de Debug

```bash
# Vérifier le build local
npm run build:github-pages
cd dist/recours-ticketing/browser
python -m http.server 8000  # ou votre serveur local préféré

# Puis naviguez vers http://localhost:8000
```

## Configuration Avancée

### Variables d'environnement
Pour des configurations spécifiques à GitHub Pages, modifiez :
- `src/environments/environment.prod.ts`
- Ajoutez des variables pour l'URL de base GitHub Pages

### CNAME personnalisé
Pour utiliser un domaine personnalisé :
1. Ajoutez un fichier `CNAME` dans `public/`
2. Configurez votre DNS
3. Modifiez le `baseHref` si nécessaire

## Sécurité

- L'application est statique (pas de secrets exposés)
- Authentification côté client uniquement (dev/demo)
- Pour la production, implémentez une authentification serveur réelle
