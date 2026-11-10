# ==============================================================================
# FanG Esports - Automated Firebase Backup Script
# Project ID: fang-58ac3
# ==============================================================================
param(
    [string]$TargetDir = "$PSScriptRoot\..\backups"
)

$ErrorActionPreference = "Stop"

$ApiKey = "AIzaSyCPU2CWMFL80L9B9vz4wQXm8WPqoK3GnE4"
$ProjectId = "fang-58ac3"
$BaseUrl = "https://firestore.googleapis.com/v1/projects/$ProjectId/databases/(default)/documents"

# Helper: Convert Firestore REST typed value to standard PowerShell Object/Value
function ConvertFrom-FirestoreValue($val) {
    if ($null -eq $val) { return $null }
    if ($val.stringValue -ne $null) { return $val.stringValue }
    if ($val.integerValue -ne $null) { return [int64]$val.integerValue }
    if ($val.doubleValue -ne $null) { return [double]$val.doubleValue }
    if ($val.booleanValue -ne $null) { return [bool]$val.booleanValue }
    if ($val.timestampValue -ne $null) { return $val.timestampValue }
    if ($val.nullValue -ne $null) { return $null }
    if ($val.arrayValue -ne $null) {
        $arr = @()
        if ($val.arrayValue.values) {
            foreach ($item in $val.arrayValue.values) {
                $arr += ,(ConvertFrom-FirestoreValue $item)
            }
        }
        return $arr
    }
    if ($val.mapValue -ne $null) {
        $map = [ordered]@{}
        if ($val.mapValue.fields) {
            foreach ($prop in $val.mapValue.fields.psobject.Properties) {
                $map[$prop.Name] = ConvertFrom-FirestoreValue $prop.Value
            }
        }
        return $map
    }
    return $val
}

function ConvertFrom-FirestoreDoc($doc) {
    $res = [ordered]@{}
    if ($doc.fields) {
        foreach ($prop in $doc.fields.psobject.Properties) {
            $res[$prop.Name] = ConvertFrom-FirestoreValue $prop.Value
        }
    }
    return $res
}

# Timestamp for the backup directory
$Timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$BackupRoot = [System.IO.Path]::GetFullPath($TargetDir)
$BackupFolder = Join-Path $BackupRoot "backup_$Timestamp"
$LatestFolder = Join-Path $BackupRoot "latest"

$RawFolder = Join-Path $BackupFolder "raw"
$CleanFolder = Join-Path $BackupFolder "clean"
$ExportsFolder = Join-Path $BackupFolder "exports"

New-Item -ItemType Directory -Path $RawFolder -Force | Out-Null
New-Item -ItemType Directory -Path $CleanFolder -Force | Out-Null
New-Item -ItemType Directory -Path $ExportsFolder -Force | Out-Null

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  FanG Firebase Firestore Backup Tool" -ForegroundColor Green
Write-Host "  Project ID : $ProjectId" -ForegroundColor Yellow
Write-Host "  Backup Time: $Timestamp" -ForegroundColor Yellow
Write-Host "  Destination: $BackupFolder" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Known collections and documents to fetch
$KnownCollections = @(
    "teams",
    "news",
    "bracket_matches",
    "videolivestream",
    "qr_scans",
    "QR_scans",
    "live_views",
    "site_analytics",
    "settings",
    "admin_users"
)

$AllCleanData = New-Object 'System.Collections.Generic.Dictionary[string, object]' ([System.StringComparer]::Ordinal)
$AllRawData = New-Object 'System.Collections.Generic.Dictionary[string, object]' ([System.StringComparer]::Ordinal)
$CollectionsSummary = New-Object 'System.Collections.Generic.Dictionary[string, object]' ([System.StringComparer]::Ordinal)
$Summary = [ordered]@{
    projectId = $ProjectId
    backupTimestamp = (Get-Date).ToString("o")
    backupFolder = $BackupFolder
    documentsCount = 0
    collections = $CollectionsSummary
}

foreach ($col in $KnownCollections) {
    Write-Host "`n[*] Scanning collection: [$col]..." -ForegroundColor White
    $listUrl = "$BaseUrl/$col`?pageSize=300&key=$ApiKey"
    try {
        $rawResponse = curl.exe -s $listUrl
        if ([string]::IsNullOrWhiteSpace($rawResponse)) {
            Write-Host "    Empty response from $col" -ForegroundColor DarkGray
            continue
        }
        $listData = $rawResponse | ConvertFrom-Json
        if ($listData.error) {
            Write-Host "    [!] Error fetching $col : $($listData.error.message)" -ForegroundColor Red
            continue
        }

        if (-not $listData.documents -or $listData.documents.Count -eq 0) {
            Write-Host "    [-] No documents found in [$col]." -ForegroundColor DarkGray
            continue
        }

        $docCount = $listData.documents.Count
        Write-Host "    [+] Found $docCount document(s) in [$col]." -ForegroundColor Green
        
        $AllCleanData[$col] = New-Object 'System.Collections.Generic.Dictionary[string, object]' ([System.StringComparer]::Ordinal)
        $AllRawData[$col] = New-Object 'System.Collections.Generic.Dictionary[string, object]' ([System.StringComparer]::Ordinal)
        $CollectionsSummary[$col] = [ordered]@{
            count = $docCount
            documents = @()
        }

        foreach ($doc in $listData.documents) {
            $docName = $doc.name
            $docId = $docName.Split('/')[-1]
            $fileName = "${col}_${docId}.json"

            # 1. Save raw document
            $rawDocJson = $doc | ConvertTo-Json -Depth 100
            $rawPath = Join-Path $RawFolder $fileName
            [System.IO.File]::WriteAllText($rawPath, $rawDocJson, [System.Text.Encoding]::UTF8)

            # 2. Save cleaned document
            $cleanDoc = ConvertFrom-FirestoreDoc $doc
            $cleanDocJson = $cleanDoc | ConvertTo-Json -Depth 100
            $cleanPath = Join-Path $CleanFolder $fileName
            [System.IO.File]::WriteAllText($cleanPath, $cleanDocJson, [System.Text.Encoding]::UTF8)

            $AllCleanData[$col][$docId] = $cleanDoc
            $AllRawData[$col][$docId] = $doc
            $Summary.documentsCount++
            $CollectionsSummary[$col].documents += $docId

            Write-Host "      -> Saved: $fileName" -ForegroundColor Gray

            # Special export: Export teams to CSV for spreadsheet viewing
            if ($col -eq "teams" -and $docId -eq "teams_list" -and $cleanDoc.items) {
                $csvRows = @()
                foreach ($t in $cleanDoc.items) {
                    $membersSummary = ""
                    $phonesSummary = ""
                    $ingamesSummary = ""
                    if ($t.membersList) {
                        $membersSummary = ($t.membersList | ForEach-Object { "$($_.role): $($_.name)" }) -join "; "
                        $phonesSummary = ($t.membersList | ForEach-Object { if ($_.phone) { "$($_.name) ($($_.phone))" } } | Where-Object { $_ }) -join "; "
                        $ingamesSummary = ($t.membersList | ForEach-Object { "$($_.role): $($_.ingame)" }) -join "; "
                    }
                    $csvRows += [PSCustomObject]@{
                        ID           = $t.id
                        Game         = $t.game
                        TeamName     = $t.name
                        School       = $t.school
                        Region       = $t.region
                        Status       = $t.status
                        Captain      = $t.captain
                        MembersCount = $t.membersCount
                        Members      = $membersSummary
                        InGameIDs    = $ingamesSummary
                        ContactPhones= $phonesSummary
                    }
                }
                $csvPath = Join-Path $ExportsFolder "teams_roster.csv"
                $csvRows | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
                Write-Host "      [+] Exported CSV: $($csvRows.Count) teams -> $csvPath" -ForegroundColor Cyan
            }
        }
    } catch {
        Write-Host "    [!] Exception fetching $col : $_" -ForegroundColor Red
    }
}

# 3. Save combined files
$combinedCleanPath = Join-Path $BackupFolder "all_data_clean.json"
$combinedCleanJson = $AllCleanData | ConvertTo-Json -Depth 100
[System.IO.File]::WriteAllText($combinedCleanPath, $combinedCleanJson, [System.Text.Encoding]::UTF8)

$combinedRawPath = Join-Path $BackupFolder "all_data_raw.json"
$combinedRawJson = $AllRawData | ConvertTo-Json -Depth 100
[System.IO.File]::WriteAllText($combinedRawPath, $combinedRawJson, [System.Text.Encoding]::UTF8)

# 4. Save metadata summary
$summaryPath = Join-Path $BackupFolder "backup_summary.json"
$summaryJson = $Summary | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($summaryPath, $summaryJson, [System.Text.Encoding]::UTF8)

# 5. Mirror to 'latest' folder for easy access
if (Test-Path $LatestFolder) {
    Remove-Item -Path $LatestFolder -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $LatestFolder -Force | Out-Null
Copy-Item -Path "$BackupFolder\*" -Destination $LatestFolder -Recurse -Force

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  BACKUP COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "  Total Documents Saved : $($Summary.documentsCount)" -ForegroundColor Yellow
Write-Host "  Timestamped Backup Dir: $BackupFolder" -ForegroundColor Gray
Write-Host "  Latest Symlink Dir    : $LatestFolder" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
