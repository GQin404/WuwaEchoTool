param([string]$ZipPath)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive=[IO.Compression.ZipFile]::OpenRead($ZipPath)
try {
  $fileEntries=@($archive.Entries | Where-Object {$_.Name -ne ''})
  if($fileEntries.Count -ne 689){throw 'Unexpected ZIP file count'}
  if(@($fileEntries.FullName | Select-Object -Unique).Count -ne $fileEntries.Count){throw 'Duplicate ZIP entries'}
  foreach($entry in $fileEntries){if(-not $entry.FullName.StartsWith('WuwaEchoTool/') -or $entry.FullName.Contains('../')){throw 'Invalid ZIP path'}}
  $reader=[IO.StreamReader]::new($archive.GetEntry('WuwaEchoTool/handoff/SHA256SUMS.txt').Open())
  try {$lines=$reader.ReadToEnd().Trim().Split("`n")}finally{$reader.Dispose()}
  $verified=0
  foreach($line in $lines){$pair=$line.TrimEnd("`r").Split(@('  '),2,[StringSplitOptions]::None);$entry=$archive.GetEntry('WuwaEchoTool/'+$pair[1]);if($null -eq $entry){throw 'ZIP file missing'};$stream=$entry.Open();$sha=[Security.Cryptography.SHA256]::Create();try{$actual=[BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-','').ToLowerInvariant()}finally{$stream.Dispose();$sha.Dispose()};if($actual -ne $pair[0]){throw ('Checksum mismatch: '+$pair[1])};$verified++}
  if($verified -ne 688){throw 'Unexpected checksum count'}
  $reader=[IO.StreamReader]::new($archive.GetEntry('WuwaEchoTool/handoff/FILE_MANIFEST.json').Open());try{$manifest=$reader.ReadToEnd()|ConvertFrom-Json}finally{$reader.Dispose()}
  foreach($item in $manifest.entries){if($archive.GetEntry('WuwaEchoTool/'+$item.path).Length -ne $item.bytes){throw 'Byte size mismatch'}}
  [PSCustomObject]@{Files=$fileEntries.Count;VerifiedChecksums=$verified;ArchiveBytes=(Get-Item -LiteralPath $ZipPath).Length;SHA256=(Get-FileHash -LiteralPath $ZipPath -Algorithm SHA256).Hash.ToLowerInvariant()}|ConvertTo-Json
} finally {$archive.Dispose()}
