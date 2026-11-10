# ==============================================================================
# FanG Esports - Firebase Restore Script
# Restores Firestore documents from a backup directory
# Project ID: fang-58ac3
# ==============================================================================
param(
    [string]$SourceFolder = "$PSScriptRoot\..\backups\latest\raw",
    [string]$SpecificDoc = "",
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$ApiKey = "AIzaSyCPU2CWMFL80L9B9vz4wQXm8WPqoK3GnE4"
$ProjectId = "fang-58ac3"
$BaseUrl = "https://firestore.googleapis.com/v1/projects/$ProjectId/databases/(default)/documents"

if (-not (Test-Path $SourceFolder)) {
    Write-Error "Source folder does not exist: $SourceFolder"
    exit 1
}

$rawFiles = Get-ChildItem -Path $SourceFolder -Filter "*.json"
if ($rawFiles.Count -eq 0) {
    Write-Error "No raw JSON backup files found in: $SourceFolder"
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  FanG Firebase Firestore Restore Tool" -ForegroundColor Yellow
Write-Host "  Project ID    : $ProjectId" -ForegroundColor Yellow
Write-Host "  Source Folder : $SourceFolder" -ForegroundColor Gray
Write-Host "  Files found   : $($rawFiles.Count)" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $Force) {
    Write-Host "[!] CANH BAO: Thao tac nay se ghi de du lieu hien tai tren Firebase!" -ForegroundColor Red
    $confirm = Read-Host "Ban co chac chan muon tiep tuc restore? (Nhap 'YES' de xac nhan)"
    if ($confirm -ne "YES") {
        Write-Host "Huy bo thao tac restore." -ForegroundColor Yellow
        exit 0
    }
}

foreach ($file in $rawFiles) {
    # File naming convention: {collection}_{documentId}.json
    $baseName = $file.BaseName
    $firstUnderscore = $baseName.IndexOf('_')
    if ($firstUnderscore -le 0) {
        continue
    }

    $col = $baseName.Substring(0, $firstUnderscore)
    $docId = $baseName.Substring($firstUnderscore + 1)

    if ($SpecificDoc -and $baseName -ne $SpecificDoc -and $docId -ne $SpecificDoc) {
        continue
    }

    Write-Host "[*] Restoring document: [$col/$docId] from $($file.Name)..." -ForegroundColor White

    $docRawJson = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $docObj = $docRawJson | ConvertFrom-Json

    if (-not $docObj.fields) {
        Write-Host "    [-] Skipping: no fields in document." -ForegroundColor DarkGray
        continue
    }

    $payload = [ordered]@{
        fields = $docObj.fields
    } | ConvertTo-Json -Depth 100

    $tempPayloadFile = [System.IO.Path]::GetTempFileName()
    try {
        [System.IO.File]::WriteAllText($tempPayloadFile, $payload, [System.Text.Encoding]::UTF8)

        $targetUrl = "$BaseUrl/$col/$docId`?key=$ApiKey"
        $patchRes = curl.exe -s -X PATCH $targetUrl `
            -H "Content-Type: application/json" `
            --data-binary "@$tempPayloadFile"

        $patchParsed = $patchRes | ConvertFrom-Json
        if ($patchParsed.error) {
            Write-Host "    [!] Error restoring [$col/$docId]: $($patchParsed.error.message)" -ForegroundColor Red
        } else {
            Write-Host "    [+] Restored [$col/$docId] successfully!" -ForegroundColor Green
        }
    } finally {
        if (Test-Path $tempPayloadFile) {
            Remove-Item $tempPayloadFile -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "`nRestore process finished." -ForegroundColor Cyan

