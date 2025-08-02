# Script PowerShell SIMPLE pour créer la branche gh-pages

Write-Host "🚀 Création de la branche gh-pages..." -ForegroundColor Green

# Build du projet
Write-Host "📦 Build du projet..." -ForegroundColor Yellow
npm run build:github-pages

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

# Préparation des fichiers
Write-Host "📋 Préparation des fichiers..." -ForegroundColor Yellow
Copy-Item "dist/recours-ticketing/browser/index.html" "dist/recours-ticketing/browser/404.html"
New-Item -Path "dist/recours-ticketing/browser/.nojekyll" -ItemType File -Force | Out-Null

# Sauvegarder la branche actuelle
$currentBranch = git branch --show-current
Write-Host "📍 Branche actuelle: $currentBranch" -ForegroundColor Cyan

# Configuration Git
git config user.name "GitHub Actions"
git config user.email "actions@github.com"

# Supprimer l'ancienne branche gh-pages locale si elle existe
Write-Host "🗑️ Nettoyage..." -ForegroundColor Yellow
git branch -D gh-pages 2>$null

# Créer la branche gh-pages
Write-Host "🆕 Création de la branche gh-pages..." -ForegroundColor Yellow
git checkout --orphan gh-pages

# Supprimer tous les fichiers du working directory
git rm -rf . 2>$null

# Copier les fichiers buildés
Write-Host "📂 Copie des fichiers..." -ForegroundColor Yellow
Copy-Item "dist/recours-ticketing/browser/*" -Destination "." -Recurse -Force
Copy-Item "dist/recours-ticketing/browser/.nojekyll" -Destination "." -Force -ErrorAction SilentlyContinue

# Ajouter et committer
Write-Host "💾 Commit..." -ForegroundColor Yellow
git add .
git commit -m "Initial GitHub Pages deployment"

# Push vers GitHub
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
git push -f origin gh-pages

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SUCCESS! Branche gh-pages créée!" -ForegroundColor Green
    
    # Obtenir l'URL du repository
    $remoteUrl = git config --get remote.origin.url
    if ($remoteUrl -match "github\.com[:/]([^/]+)/([^.]+)") {
        $username = $matches[1]
        $reponame = $matches[2]
        Write-Host ""
        Write-Host "🌐 Votre site sera disponible à:" -ForegroundColor Cyan
        Write-Host "   https://$username.github.io/$reponame/" -ForegroundColor White
        Write-Host ""
        Write-Host "⚙️ Configurez maintenant GitHub Pages:" -ForegroundColor Yellow
        Write-Host "   1. Allez dans Settings > Pages" -ForegroundColor White
        Write-Host "   2. Source: Deploy from a branch" -ForegroundColor White
        Write-Host "   3. Branch: gh-pages" -ForegroundColor White
        Write-Host "   4. Folder: / (root)" -ForegroundColor White
    }
} else {
    Write-Host "❌ Erreur lors du push" -ForegroundColor Red
}

# Retourner à la branche originale
Write-Host "🔄 Retour à la branche $currentBranch..." -ForegroundColor Yellow
git checkout $currentBranch

Write-Host "✨ Terminé!" -ForegroundColor Green
