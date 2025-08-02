# Script PowerShell pour déployer sur GitHub Pages

Write-Host "🚀 Déploiement GitHub Pages pour recours-ticketing" -ForegroundColor Green

# Vérifier que nous sommes sur la branche main
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "❌ Vous devez être sur la branche main" -ForegroundColor Red
    exit 1
}

# Build de l'application
Write-Host "📦 Building l'application..." -ForegroundColor Yellow
npm run build:github-pages

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

# Copier index.html vers 404.html pour le SPA routing
Write-Host "📋 Copie index.html vers 404.html..." -ForegroundColor Yellow
Copy-Item "dist/recours-ticketing/browser/index.html" "dist/recours-ticketing/browser/404.html"

# Ajouter .nojekyll
Write-Host "📝 Ajout du fichier .nojekyll..." -ForegroundColor Yellow
New-Item -Path "dist/recours-ticketing/browser/.nojekyll" -ItemType File -Force

# Vérifier si la branche gh-pages existe
Write-Host "🔍 Vérification de la branche gh-pages..." -ForegroundColor Yellow
$branchExists = git show-ref --verify --quiet refs/heads/gh-pages
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ La branche gh-pages existe déjà" -ForegroundColor Green
    git checkout gh-pages
    git pull origin gh-pages
} else {
    Write-Host "🆕 Création de la branche gh-pages..." -ForegroundColor Yellow
    git checkout --orphan gh-pages
    git rm -rf .
}

# Copier les fichiers de build
Write-Host "📂 Copie des fichiers de build..." -ForegroundColor Yellow
Copy-Item "dist/recours-ticketing/browser/*" -Destination "." -Recurse -Force

# Commit et push
Write-Host "💾 Commit et push..." -ForegroundColor Yellow
git add .
$commitMessage = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage
git push origin gh-pages

# Retourner sur main
git checkout main

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green

# Extraire l'URL du repository
$remoteUrl = git config --get remote.origin.url
if ($remoteUrl -match "github\.com[:/]([^/]+)/([^.]+)") {
    $username = $matches[1]
    $reponame = $matches[2]
    Write-Host "🌐 Votre application sera disponible à :" -ForegroundColor Cyan
    Write-Host "   https://$username.github.io/$reponame/" -ForegroundColor Cyan
}
