# Genera un respaldo SQL desde la base de datos SQLite usada por Laravel.
# Ejecuta este script desde la raíz del repositorio o directamente desde PowerShell.

$source = Join-Path $PSScriptRoot 'database.sqlite'
$dest = Join-Path $PSScriptRoot 'dump.sql'

if (-not (Test-Path $source)) {
    Write-Error "No se encontró el archivo de base de datos: $source"
    exit 1
}

Write-Host "Generando dump SQL desde: $source"

# Requiere sqlite3 en PATH. Si no está instalado, instala SQLite o usa el comando manual.
& sqlite3 $source ".dump" > $dest

if ($LASTEXITCODE -eq 0) {
    Write-Host "Respaldo creado en: $dest"
} else {
    Write-Error "Error al generar el dump. Verifica que sqlite3 esté instalado y en PATH."
    exit $LASTEXITCODE
}
