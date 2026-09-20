$puerto = 8000
$raiz = [IO.Path]::GetFullPath($PSScriptRoot)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$puerto/")
$listener.Start()
Write-Host "Servidor corriendo en http://localhost:$puerto (Ctrl+C para detener)"

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $ruta = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($ruta -eq "/") { $ruta = "/index.html" }

    $archivo = [IO.Path]::GetFullPath((Join-Path $raiz ($ruta -replace "/", "\")))

    if ($archivo.StartsWith($raiz) -and (Test-Path $archivo -PathType Leaf)) {
        $bytes = [IO.File]::ReadAllBytes($archivo)
        $tipo = switch ([IO.Path]::GetExtension($archivo).ToLower()) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "text/javascript; charset=utf-8" }
            ".json" { "application/json" }
            ".pdf"  { "application/pdf" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            ".ico"  { "image/x-icon" }
            default { "application/octet-stream" }
        }
        $ctx.Response.ContentType = $tipo
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
        $msg = [Text.Encoding]::UTF8.GetBytes("404 - No encontrado")
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.Close()
}
