# Start AgroGuardian web and warn if :3000 is already taken (common Docker conflict).
$ErrorActionPreference = "SilentlyContinue"

function Get-PortOwner([int]$Port) {
  $conn = Get-NetTCPConnection -LocalPort $Port -State Listen | Select-Object -First 1
  if (-not $conn) { return $null }
  $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $($conn.OwningProcess)"
  return [pscustomobject]@{
    Pid = $conn.OwningProcess
    Name = $proc.Name
    CommandLine = $proc.CommandLine
  }
}

$owner = Get-PortOwner 3000
if ($owner) {
  Write-Host ""
  Write-Host "WARNING: Port 3000 is already in use by PID $($owner.Pid) ($($owner.Name))." -ForegroundColor Yellow
  Write-Host "Next.js will fall back to another port (often 3001)." -ForegroundColor Yellow
  Write-Host "If you open http://localhost:3000 you are NOT seeing AgroGuardian." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "  Fix options:" -ForegroundColor Cyan
  Write-Host "  1) Open the URL Next prints (e.g. http://localhost:3001)"
  Write-Host "  2) Free the port, e.g. if Docker: docker stop feminicidios-web"
  Write-Host "  3) Or run: npm run stop   (only stops AgroGuardian node/python processes)"
  Write-Host ""
  if ($owner.CommandLine) {
    Write-Host "  Process: $($owner.CommandLine.Substring(0, [Math]::Min(160, $owner.CommandLine.Length)))" -ForegroundColor DarkGray
    Write-Host ""
  }
}

Set-Location (Join-Path $PSScriptRoot "..\web")
npm run dev
