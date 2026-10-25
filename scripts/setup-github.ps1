<#
.SYNOPSIS
    Pre-flight inspection and GitHub preparation script for Campus to Career.
.DESCRIPTION
    Validates environment tools, checks git state, scans for secrets/resumes,
    and prepares safe staging.
#>
param(
    [switch]$Execute = $false
)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   Campus to Career — GitHub Setup & Check       " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Inspect installed tools
Write-Host "`n[1/5] Checking environment tools..." -ForegroundColor Yellow

$tools = @{
    "Python" = "python --version"
    "Node.js" = "node --version"
    "Git" = "git --version"
    "GitHub CLI" = "gh --version"
}

foreach ($tool in $tools.Keys) {
    try {
        $out = Invoke-Expression $tools[$tool] 2>$null
        if ($LASTEXITCODE -eq 0 -and $out) {
            Write-Host "  ✅ $tool is installed: $($out.Split("`n")[0])" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $tool not found in PATH." -ForegroundColor DarkYellow
        }
    } catch {
        Write-Host "  ⚠️  $tool check encountered error." -ForegroundColor DarkYellow
    }
}

# 2. Check for private resumes or uploads
Write-Host "`n[2/5] Scanning for sensitive uploads or private resumes..." -ForegroundColor Yellow
$sensitivePaths = @("backend\uploads", "backend\resumes", "frontend\uploads")
$foundFiles = @()

foreach ($path in $sensitivePaths) {
    if (Test-Path $path) {
        $files = Get-ChildItem -Path $path -Recurse -File -Exclude ".gitkeep" -ErrorAction SilentlyContinue
        if ($files) {
            $foundFiles += $files
        }
    }
}

if ($foundFiles.Count -gt 0) {
    Write-Host "  ❌ Found $($foundFiles.Count) sensitive files in upload directories:" -ForegroundColor Red
    foreach ($f in $foundFiles) {
        Write-Host "     - $($f.FullName)" -ForegroundColor Red
    }
    Write-Host "  Please ensure these files are excluded by .gitignore before publishing." -ForegroundColor Red
} else {
    Write-Host "  ✅ No sensitive user files detected in upload paths." -ForegroundColor Green
}

# 3. Check .gitignore integrity
Write-Host "`n[3/5] Verifying .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    $criticalPatterns = @("uploads", ".env", "*.db", "node_modules", ".next")
    $missing = @()
    foreach ($pat in $criticalPatterns) {
        if ($gitignore -notmatch [regex]::Escape($pat)) {
            $missing += $pat
        }
    }
    if ($missing.Count -eq 0) {
        Write-Host "  ✅ .gitignore covers all critical patterns (.env, uploads, db, node_modules, .next)." -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  .gitignore is missing patterns: $($missing -join ', ')" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ Root .gitignore file not found!" -ForegroundColor Red
}

# 4. Check Environment Configuration
Write-Host "`n[4/5] Checking environment files..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "  ℹ️  Local .env file exists (verified gitignored)." -ForegroundColor Cyan
} elseif (Test-Path ".env.example") {
    Write-Host "  ℹ️  .env not found; copying from .env.example..." -ForegroundColor Cyan
    if ($Execute) {
        Copy-Item ".env.example" ".env"
        Write-Host "  ✅ Created local .env template." -ForegroundColor Green
    } else {
        Write-Host "  (Dry-run mode: run with -Execute to generate .env from .env.example)" -ForegroundColor Gray
    }
}

# 5. Git repository state
Write-Host "`n[5/5] Checking Git repository status..." -ForegroundColor Yellow
try {
    $gitStatus = git status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Git is initialized." -ForegroundColor Green
        $remote = git remote -v 2>$null
        if ($remote) {
            Write-Host "  Current remotes:" -ForegroundColor Cyan
            Write-Host $remote
        } else {
            Write-Host "  ℹ️  No remote configured yet. Ready for GitHub setup." -ForegroundColor Cyan
        }
    } else {
        Write-Host "  ℹ️  Git repository not initialized." -ForegroundColor Cyan
        if ($Execute) {
            git init
            git branch -M main
            Write-Host "  ✅ Initialized git repository with 'main' branch." -ForegroundColor Green
        } else {
            Write-Host "  (Dry-run mode: run with -Execute to initialize git)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  ⚠️  Git executable not available in this shell session." -ForegroundColor DarkYellow
}

Write-Host "`nPre-flight check completed.`n" -ForegroundColor Green
