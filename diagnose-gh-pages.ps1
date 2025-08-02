# Script de diagnostic pour GitHub Pages

Write-Host "🔍 Diagnostic GitHub Pages" -ForegroundColor Green

# Build du projet
Write-Host "📦 Build du projet..." -ForegroundColor Yellow
npm run build:github-pages

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

# Vérifier la structure de build
Write-Host "📂 Structure de build:" -ForegroundColor Yellow
Get-ChildItem -Path "dist" -Recurse | Select-Object FullName

# Vérifier le contenu d'index.html
$buildDir = "dist/recours-ticketing/browser"
if (Test-Path "$buildDir/index.html") {
    Write-Host "📋 Contenu du base href dans index.html:" -ForegroundColor Yellow
    Select-String -Path "$buildDir/index.html" -Pattern "base href" | ForEach-Object { $_.Line }
    
    Write-Host "📋 Taille des fichiers principaux:" -ForegroundColor Yellow
    Get-ChildItem -Path $buildDir -Filter "*.html", "*.js", "*.css" | Select-Object Name, @{Name="Size";Expression={"{0:N0} bytes" -f $_.Length}}
} else {
    Write-Host "❌ index.html introuvable dans $buildDir" -ForegroundColor Red
}

# Vérifier l'URL du repository
$remoteUrl = git config --get remote.origin.url
if ($remoteUrl -match "github\.com[:/]([^/]+)/([^.]+)") {
    $username = $matches[1]
    $reponame = $matches[2]
    Write-Host ""
    Write-Host "🌐 Informations GitHub Pages:" -ForegroundColor Cyan
    Write-Host "   Repository: $username/$reponame" -ForegroundColor White
    Write-Host "   URL attendue: https://$username.github.io/$reponame/" -ForegroundColor White
    Write-Host "   Base href configuré: /recours-ticketing/" -ForegroundColor White
    
    if ($reponame -ne "recours-ticketing") {
        Write-Host "⚠️  ATTENTION: Le nom du repository ($reponame) ne correspond pas au base href (/recours-ticketing/)" -ForegroundColor Yellow
        Write-Host "   Vous devriez utiliser: /$reponame/" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📋 Vérifications à faire:" -ForegroundColor Cyan
Write-Host "1. ✅ Repository GitHub: Settings > Pages > Source: Deploy from a branch" -ForegroundColor White
Write-Host "2. ✅ Branch: gh-pages" -ForegroundColor White
Write-Host "3. ✅ Folder: / (root)" -ForegroundColor White
Write-Host "4. ✅ La branche gh-pages existe et contient les fichiers" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Si vous avez toujours un 404:" -ForegroundColor Yellow
Write-Host "- Vérifiez que le repository est public" -ForegroundColor White
Write-Host "- Attendez quelques minutes après le déploiement" -ForegroundColor White
Write-Host "- Vérifiez l'URL: https://[username].github.io/[repository-name]/" -ForegroundColor White
