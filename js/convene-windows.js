/* Original local-only reader. Reviewed third-party flow is a reference, never downloaded/executed. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ConveneWindows=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const reference='https://github.com/wuwatracker/wuwatracker/blob/747a48b1b994baa9c372a4fb933ea7588428bd4b/import.ps1';
const command=String.raw`& {
  param([string]$GamePath, [switch]$NoClipboard)
  $ErrorActionPreference = 'Stop'
  # Local reads only. No network, administrator elevation, or game/config changes.
  if (-not $GamePath) {
    $gameExe = Get-Process -Name 'Client-Win64-Shipping' -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty Path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($gameExe) { $GamePath = Split-Path (Split-Path (Split-Path $gameExe)) }
    else { $GamePath = Read-Host 'Game folder (or Client.log path)' }
  }
  $GamePath = $GamePath.Trim().Trim('"')
  $paths = @()
  if (Test-Path -LiteralPath $GamePath -PathType Leaf) { $paths += $GamePath }
  else {
    foreach ($root in @($GamePath, (Join-Path $GamePath 'Client'), (Join-Path $GamePath 'Wuthering Waves Game/Client'))) {
      foreach ($tail in @('Saved/Logs/Client.log', 'Binaries/Win64/ThirdParty/KrPcSdk_Global/KRSDKRes/KRSDKWebView/debug.log', 'Binaries/Win64/ThirdParty/KrPcSdk/KRSDKRes/KRSDKWebView/debug.log')) {
        $candidate = Join-Path $root $tail
        if (Test-Path -LiteralPath $candidate -PathType Leaf) { $paths += $candidate }
      }
    }
  }
  $files = @($paths | Select-Object -Unique | Get-Item | Sort-Object LastWriteTime -Descending)
  if (-not $files.Count) { throw 'No supported log. Open Convene History in game, then retry with the game folder.' }
  $found = $null
  foreach ($file in $files) {
    if ($file.Length -gt 67108864) { continue }
    [byte[]]$bytes = [IO.File]::ReadAllBytes($file.FullName)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 239 -and $bytes[1] -eq 187 -and $bytes[2] -eq 191) {
      if ($bytes.Length -eq 3) { continue }
      $bytes = $bytes[3..($bytes.Length - 1)]
    }
    $raw = [Text.Encoding]::UTF8.GetString($bytes)
    for ($i = 0; $i -lt $bytes.Length; $i++) {
      $mask = if (($bytes[$i] -band 1) -eq 1) { 165 } else { 239 }
      $bytes[$i] = $bytes[$i] -bxor $mask
    }
    foreach ($text in @($raw, [Text.Encoding]::UTF8.GetString($bytes))) {
      $matches = [regex]::Matches($text, 'https://aki-gm-resources(?:-oversea)?\.aki-game\.(?:net|com)/aki/gacha/index\.html(?:#/record\?[^\s"<>]+|\?[^\s"<>]+)')
      for ($i = $matches.Count - 1; $i -ge 0; $i--) {
        $value = $matches[$i].Value.TrimEnd("'", ')', ',')
        if ($value -match '[?&]player_id=\d+' -and $value -match '[?&]svr_id=[^&]+' -and $value -match '[?&]record_id=[^&]+' -and $value -match '[?&]resources_id=[^&]+') { $found = $value; break }
      }
      if ($found) { break }
    }
    if ($found) { break }
  }
  if (-not $found) { throw 'No supported URL. Open Convene History in game, then retry. No files were changed.' }
  if ($NoClipboard) { return $found }
  Set-Clipboard -Value $found
  Write-Host 'History URL copied. Return to WuwaEchoTool and paste it. Keep this private; do not share screenshots of the URL.'
}`;
const thirdPartyCommand='iwr -UseBasicParsing -Headers @{"User-Agent"="Mozilla/5.0"} https://raw.githubusercontent.com/wuwatracker/wuwatracker/747a48b1b994baa9c372a4fb933ea7588428bd4b/import.ps1 | iex';
return {thirdPartyCommand,command,reference,reviewedAt:'2026-10-21'};
});
