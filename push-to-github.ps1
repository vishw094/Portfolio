# Run this script in PowerShell from D:\Resume to push your portfolio to GitHub
# Right-click and "Run with PowerShell" or run: powershell -ExecutionPolicy Bypass -File push-to-github.ps1

Set-Location $PSScriptRoot

# Set Git identity (required for first commit)
Write-Host "Setting Git identity..." -ForegroundColor Cyan
git config user.email "vishwvekariya@gmail.com"
git config user.name "Vishw Vekariya"

Write-Host "Adding files..." -ForegroundColor Cyan
git add .

Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "Portfolio website"

Write-Host "Renaming branch to main..." -ForegroundColor Cyan
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "`nDone! Your site will be at https://vishw094.github.io/Portfolio/ (after enabling Pages in repo Settings)" -ForegroundColor Green
