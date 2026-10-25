<#
.SYNOPSIS
    Safe GitHub publishing script for Campus to Career.
.DESCRIPTION
    Validates staged files, verifies secret exclusion, requests explicit confirmation,
    and publishes to GitHub using GitHub CLI or git remotes. Never force-pushes.
#>
param(
    [switch]$DryRun = $false,
    [string]$RepoName = "campus-to-career",
    [string]$Branch = "main",
    [switch]$Force = $false
)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   Campus to Career — Safe GitHub Publisher      " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Pre-publish secret scan on staged / working tree files
Write-Host "`n[1/4] Scanning for potential secrets..." -ForegroundColor Yellow

$secretPatterns = @(
    "PRIVATE KEY",
    "BEGIN RSA PRIVATE",
    "password\s*=\s*['`"][^'`"]{8,}['`"]",
    "secret_key\s*=\s*['`"][^'`"]{16,}['`"]"
)

$flaggedFiles = @()
$trackedFiles = git status --porcelain 2>$null

if ($trackedFiles) {
    foreach ($line in $trackedFiles) {
        $file = $line.Substring(3).Trim()
        if (Test-Path $file -PathType Leaf) {
            # Skip checking binaries
            if ($file -match "\.(png|jpg|ico|pdf|db|whl|exe)$") { continue }
            $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
            if ($content) {
                foreach ($pattern in $secretPatterns) {
                    if ($content -match $pattern -and $file -notmatch "\.example") {
                        $flaggedFiles += "$file (matched: $pattern)"
                    }
                }
            }
        }
    }
}

if ($flaggedFiles.Count -gt 0) {
    Write-Host "  ❌ Potential secrets detected in the following files:" -ForegroundColor Red
    foreach ($item in $flaggedFiles) {
        Write-Host "     - $item" -ForegroundColor Red
    }
    Write-Host "  Publishing aborted for security. Remove or gitignore these secrets first." -ForegroundColor Red
    exit 1
} else {
    Write-Host "  ✅ Secret scan passed: No hardcoded credentials detected." -ForegroundColor Green
}

# 2. Preview Staged Changes
Write-Host "`n[2/4] Inspecting files to be committed..." -ForegroundColor Yellow
$status = git status -s 2>$null
if (-not $status) {
    Write-Host "  ℹ️  Working tree is clean. Nothing new to commit." -ForegroundColor Cyan
} else {
    Write-Host "  Changes detected:" -ForegroundColor Cyan
    Write-Host $status
}

if ($DryRun) {
    Write-Host "`n[DRY RUN COMPLETE] No remote operations were executed." -ForegroundColor Green
    exit 0
}

# 3. Explicit User Confirmation Prompt
Write-Host "`n[3/4] Requesting confirmation..." -ForegroundColor Yellow
Write-Host "  Target Repository: $RepoName" -ForegroundColor Cyan
Write-Host "  Target Branch:     $Branch" -ForegroundColor Cyan
Write-Host "  Visibility:        Public (Hacktoberfest Open Source)" -ForegroundColor Cyan

if (-not $Force) {
    $confirmation = Read-Host "`nDo you want to proceed with committing and publishing to GitHub? (yes/no)"
    if ($confirmation -ne "yes" -and $confirmation -ne "y") {
        Write-Host "Publishing cancelled by user." -ForegroundColor Yellow
        exit 0
    }
}

# 4. Commit and Push
Write-Host "`n[4/4] Executing Git operations..." -ForegroundColor Yellow

git add .
$commitMsg = "feat: initial open-source release of Campus to Career platform"
git commit -m $commitMsg

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    # Attempt gh repo create
    Write-Host "Creating repository on GitHub using GitHub CLI..." -ForegroundColor Cyan
    gh repo create $RepoName --public --source=. --remote=origin --push
} else {
    Write-Host "Pushing to remote 'origin' branch '$Branch'..." -ForegroundColor Cyan
    git push -u origin $Branch
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Campus to Career successfully published to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Git push encountered an issue. Please verify remote URL and authentication." -ForegroundColor Red
}
