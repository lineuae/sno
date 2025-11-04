# Script pour corriger client.color en client.config.color dans tous les fichiers
# Ne pas exécuter ce script si vous n'êtes pas sûr

$files = @(
    "source\commands\Informations\help.js",
    "source\commands\Informations\alladmin.js",
    "source\commands\Informations\allbots.js",
    "source\commands\Informations\allchannel.js",
    "source\commands\Informations\avatar.js",
    "source\commands\Informations\banner.js",
    "source\commands\Informations\boosters.js",
    "source\commands\Informations\botinfo.js",
    "source\commands\Informations\channel.js",
    "source\commands\Informations\member.js",
    "source\commands\Informations\myperm.js",
    "source\commands\Informations\prevname.js",
    "source\commands\Informations\serverinfos.js",
    "source\commands\Informations\snipe.js",
    "source\commands\Informations\snipedit.js",
    "source\commands\Informations\stats.js",
    "source\commands\Informations\support.js",
    "source\commands\Informations\userinfo.js",
    "source\commands\Informations\vocal.js",
    "source\commands\Logs\logs.js",
    "source\commands\Misc\chatgpt.js",
    "source\commands\Misc\cry.js",
    "source\commands\Misc\fivem.js",
    "source\commands\Misc\hug.js",
    "source\commands\Misc\kiss.js",
    "source\commands\Misc\osu.js",
    "source\commands\Misc\smile.js",
    "source\commands\Modérations\mutelist.js",
    "source\commands\Modérations\sanctions.js",
    "source\commands\Modérations\unbanall.js",
    "source\commands\Modérations\banlist.js",
    "source\commands\Owner\bl.js",
    "source\commands\Owner\serveurs.js",
    "source\commands\Permissions\helpall.js",
    "source\commands\Permissions\perms.js",
    "source\commands\Buyers\owner.js"
)

$count = 0
foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $newContent = $content -replace 'client\.color', 'client.config.color'
        if ($content -ne $newContent) {
            Set-Content $fullPath $newContent -Encoding UTF8 -NoNewline
            $count++
            Write-Host "✅ Corrigé: $file"
        } else {
            Write-Host "⏭️  Déjà OK: $file"
        }
    } else {
        Write-Host "❌ Non trouvé: $file"
    }
}

Write-Host "`n🎉 Terminé! $count fichiers corrigés."
