# RecoursTicketing

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### GitHub Pages Deployment

#### Déploiement Automatique
Le projet est configuré pour se déployer automatiquement sur GitHub Pages via GitHub Actions.

#### Déploiement Manuel

**Option 1: Scripts de déploiement**
```bash
# Linux/macOS
chmod +x deploy.sh
./deploy.sh

# Windows PowerShell
.\deploy.ps1
```

**Option 2: Commandes npm**
```bash
# Build pour GitHub Pages
npm run build:github-pages

# Build et préparation complète
npm run deploy:github-pages
```

**Option 3: Workflow manuel**
Allez dans l'onglet "Actions" de votre repository GitHub et déclenchez le workflow "Deploy to GitHub Pages (Alternative)".

#### Configuration GitHub Pages

1. **Activez GitHub Pages :**
   - Allez dans Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "gh-pages" (sera créée automatiquement)
   - Folder: "/ (root)"

2. **Permissions GitHub Actions :**
   - Settings → Actions → General
   - "Read and write permissions"
   - "Allow GitHub Actions to create and approve pull requests"

3. **Push vers main ou déclenchez manuellement :**
   ```bash
   git add .
   git commit -m "Configuration GitHub Pages"
   git push origin main
   ```

L'application sera disponible à: `https://yourusername.github.io/recours-ticketing/`

**Note**: Si la branche `gh-pages` n'est pas créée automatiquement, utilisez le workflow manuel ou les scripts de déploiement.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
