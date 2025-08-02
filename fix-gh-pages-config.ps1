# Script pour corriger automatiquement la configuration GitHub Pages

Write-Host "🔧 Correction automatique de la configuration GitHub Pages" -ForegroundColor Green

# Obtenir le nom du repository
$remoteUrl = git config --get remote.origin.url
if ($remoteUrl -match "github\.com[:/]([^/]+)/([^.]+)") {
    $username = $matches[1]
    $reponame = $matches[2]
    Write-Host "📍 Repository détecté: $username/$reponame" -ForegroundColor Cyan
    
    # Lire la configuration angular.json
    $angularConfig = Get-Content "angular.json" -Raw | ConvertFrom-Json
    $currentBaseHref = $angularConfig.projects.'recours-ticketing'.architect.build.configurations.'github-pages'.baseHref
    
    Write-Host "📋 Base href actuel: $currentBaseHref" -ForegroundColor Yellow
    $expectedBaseHref = "/$reponame/"
    Write-Host "📋 Base href attendu: $expectedBaseHref" -ForegroundColor Yellow
    
    if ($currentBaseHref -ne $expectedBaseHref) {
        Write-Host "🔄 Correction du base href..." -ForegroundColor Yellow
        
        # Mettre à jour angular.json
        $angularConfig.projects.'recours-ticketing'.architect.build.configurations.'github-pages'.baseHref = $expectedBaseHref
        $angularConfig | ConvertTo-Json -Depth 10 | Set-Content "angular.json"
        
        Write-Host "✅ angular.json mis à jour avec baseHref: $expectedBaseHref" -ForegroundColor Green
        
        # Rebuild du projet
        Write-Host "📦 Rebuild avec la nouvelle configuration..." -ForegroundColor Yellow
        npm run build:github-pages
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build réussi avec la nouvelle configuration" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreur lors du rebuild" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✅ La configuration est déjà correcte" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🌐 Votre site sera disponible à:" -ForegroundColor Cyan
    Write-Host "   https://$username.github.io/$reponame/" -ForegroundColor White
    
} else {
    Write-Host "❌ Impossible de déterminer le nom du repository depuis l'URL: $remoteUrl" -ForegroundColor Red
}

Write-Host ""
Write-Host "▶️ Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Commitez les changements: git add . && git commit -m 'Fix GitHub Pages config'" -ForegroundColor White
Write-Host "2. Poussez vers main: git push origin main" -ForegroundColor White
Write-Host "3. Le déploiement automatique se fera via GitHub Actions" -ForegroundColor White
