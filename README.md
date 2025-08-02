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

To build for GitHub Pages deployment:

```bash
npm run build:github-pages
```

To build and prepare for GitHub Pages (with 404.html):

```bash
npm run deploy:github-pages
```

The project is configured to automatically deploy to GitHub Pages when you push to the `main` branch via GitHub Actions.

#### Manual GitHub Pages Setup

1. Go to your repository Settings
2. Navigate to Pages section
3. Select "Deploy from a branch"
4. Choose "gh-pages" branch
5. Select "/ (root)" folder
6. Save

The application will be available at: `https://yourusername.github.io/recours-ticketing/`

**Note**: The 404.html file is automatically generated to handle client-side routing in Angular.

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
