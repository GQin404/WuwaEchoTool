/* Platform workflow metadata; interface and local reader are original implementation. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-windows.js'));else root.ConveneGuides=factory(root.ConveneWindows);})(globalThis,function(Windows){
'use strict';
const macReader=`use strict;
use warnings;
my $file = shift @ARGV;
die "Client.log not found; open Convene History first.\\n" unless -f $file;
die "Log exceeds 64 MiB; select a recent log.\\n" if -s $file > 64 * 1024 * 1024;
open my $input, '<:raw', $file or die "Unable to read Client.log.\\n";
local $/;
my $bytes = <$input>;
close $input;
my $decoded = pack('C*', map { $_ ^ (($_ & 1) ? 0xA5 : 0xEF) } unpack('C*', $bytes));
my @urls;
for my $text ($bytes, $decoded) {
    while ($text =~ m{https://aki-gm-resources(?:-oversea)?\\.aki-game\\.(?:net|com)/aki/gacha/index\\.html\\#/record\\?[^\\s"<>]+}g) { push @urls, $&; }
}
die "No history URL found; reopen Convene History.\\n" unless @urls;
print $urls[-1], "\\n";
if ($^O eq 'darwin') {
    open my $clipboard, '|-', 'pbcopy' or die "Copy the displayed URL manually.\\n";
    print $clipboard $urls[-1];
    close $clipboard;
}`;
const macCommand='perl - "$HOME/Library/Containers/com.kurogame.wutheringwaves.global/Data/Library/Logs/Client/Client.log" <<\'WUWA_HISTORY\'\n'+macReader+'\nWUWA_HISTORY';
const linuxCommand='curl -sSL "https://raw.githubusercontent.com/wuwatracker/wuwatracker/747a48b1b994baa9c372a4fb933ea7588428bd4b/import.sh" | bash';
const platforms=['windows','android','ios','ps5','xbox','macos','linux'];
const methods={
 windows:[{id:'auto',label:'methodAuto',steps:['thirdStep1','thirdStep2','thirdStep3','thirdStep5','guideFinish'],command:Windows.thirdPartyCommand,source:Windows.reference,kind:'remoteWindows'},{id:'log',label:'methodLog',steps:['guideGameHistory','windowsLog1','guideSelectLog','guideFinish'],file:true},{id:'offline',label:'methodLocal',steps:['guideGameHistory','localCommandStep','guideFinish'],command:Windows.command,kind:'localWindows'}],
 android:[{id:'airplane',label:'methodAirplane',steps:['androidFlight1','androidFlight2','androidFlight3','androidFlight4','guideFinish'],video:'EP6ib3POGKE',input:true},{id:'log',label:'methodLog',steps:['guideGameHistory','androidLog1','guideSelectLog','guideFinish'],file:true,video:'G4CPyU0t-pA'},{id:'ascent',label:'methodAscent',steps:['androidNew1','androidNew2','androidNew3','androidNew4','androidNew5','guideFinish'],download:'https://github.com/4o3F/Ascent/releases/tag/2.1.6',input:true}],
 ios:[{id:'stream',label:'methodStream',steps:['iosNew1','iosNew2','iosNew3','iosCapture','iosCleanup','guideFinish'],video:'w--3SkszE60',input:true,json:true}],
 ps5:[{id:'info',label:'methodPageInfo',steps:['guideGameHistory','ps5Options','ps5Page','ps5Fields','guideFinish'],console:true}],
 xbox:[{id:'url',label:'methodURL',steps:['guideGameHistory','xboxCopy','xboxPaste','guideFinish'],input:true}],
 macos:[{id:'auto',label:'methodTerminal',steps:['guideGameHistory','macTerminal','macCommandStep','guideFinish'],command:macCommand,kind:'localMac'},{id:'log',label:'methodLog',steps:['guideGameHistory','macLog','guideSelectLog','guideFinish'],file:true}],
 linux:[{id:'auto',label:'methodTerminal',steps:['guideGameHistory','linuxTerminal','linuxRun','guideFinish'],command:linuxCommand,source:'https://github.com/wuwatracker/wuwatracker/blob/747a48b1b994baa9c372a4fb933ea7588428bd4b/import.sh',kind:'remoteLinux'},{id:'log',label:'methodLog',steps:['guideGameHistory','linuxLog','guideSelectLog','guideFinish'],file:true}]
};
function method(platform,id){return methods[platform]?.find(m=>m.id===id)||methods[platform]?.[0]||methods.windows[0];}
return {platforms,methods,method,macReader,macCommand,linuxCommand};});
