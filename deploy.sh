#!/bin/bash

# Script pour créer manuellement la branche gh-pages et déployer l'application

echo "🚀 Déploiement GitHub Pages pour recours-ticketing"

# Vérifier que nous sommes sur la branche main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Vous devez être sur la branche main"
    exit 1
fi

# Build de l'application
echo "📦 Building l'application..."
npm run build:github-pages

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

# Copier index.html vers 404.html pour le SPA routing
echo "📋 Copie index.html vers 404.html..."
cp dist/recours-ticketing/browser/index.html dist/recours-ticketing/browser/404.html

# Ajouter .nojekyll
echo "📝 Ajout du fichier .nojekyll..."
touch dist/recours-ticketing/browser/.nojekyll

# Vérifier si la branche gh-pages existe
echo "🔍 Vérification de la branche gh-pages..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "✅ La branche gh-pages existe déjà"
    git checkout gh-pages
    git pull origin gh-pages
else
    echo "🆕 Création de la branche gh-pages..."
    git checkout --orphan gh-pages
    git rm -rf .
fi

# Copier les fichiers de build
echo "📂 Copie des fichiers de build..."
cp -r dist/recours-ticketing/browser/* .

# Commit et push
echo "💾 Commit et push..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin gh-pages

# Retourner sur main
git checkout main

echo "✅ Déploiement terminé!"
echo "🌐 Votre application sera disponible à :"
echo "   https://$(git config --get remote.origin.url | sed 's/.*github\.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"
