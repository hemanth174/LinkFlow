New-Item -ItemType Directory -Force "landing\downloads" | Out-Null
npm run create:icon
npm run build:desktop
if ($LASTEXITCODE -ne 0) {
  throw "The desktop installer build failed. See the electron-builder error above."
}
$installer = Get-ChildItem ".\dist\*.exe", "..\dist\*.exe" -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -notlike "*uninstaller*" } |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1
if (-not $installer) {
  throw "No Windows installer was created in dist."
}
Copy-Item $installer.FullName "landing\downloads\LinkFlow-Setup.exe" -Force
Write-Host "Installer copied to landing\downloads\LinkFlow-Setup.exe"
