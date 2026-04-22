
# Script de Sincronizacao Automatica para o Projeto Leia Neves
# Monitora mudancas e realiza Git Commit/Push automaticamente

$IntervaloSegundos = 30
$RemoteName = "origin"

# Tenta localizar o binario do Git caso nao esteja no PATH
$GitPath = "git"
$CommonPaths = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe"
)

foreach ($Path in $CommonPaths) {
    if (Test-Path $Path) {
        $GitPath = "`"$Path`""
        break
    }
}

Write-Host "--- Iniciando Sincronizacao Automatica (Usando Git em: $GitPath) ---"

while($true) {
    try {
        # Verifica mudancas
        $status = & $GitPath status --porcelain
        
        if ($status) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host ">>> Mudancas detectadas em $timestamp. Sincronizando..."
            
            & $GitPath add .
            & $GitPath commit -m "Auto-sync: $timestamp [Automated Commit]"
            & $GitPath push $RemoteName
            
            Write-Host "DONE: Sincronizado com sucesso no GitHub!"
        }
    } catch {
        Write-Host "ERRO: Ocorreu um problema na sincronizacao. Verifique se o Git esta pronto."
    }
    
    Start-Sleep -Seconds $IntervaloSegundos
}
