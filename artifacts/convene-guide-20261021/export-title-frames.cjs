const fs=require('node:fs'),path=require('node:path'),{PNG}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const source='C:/Users/user/Downloads/WuwaEchoTool/artifacts/convene-player-20261021/themes';
const destination='C:/Users/user/Downloads/WuwaEchoTool_整体称号外框_20261021';
if(fs.existsSync(destination))throw Error('Destination already exists; do not overwrite');fs.mkdirSync(destination);
const tiers=[['fate','天命共鸣者'],['star','星运眷顾者'],['lucky','幸运同行者'],['steady','平稳共鸣者'],['headwind','逆风漂泊者'],['abyss','深渊守望者']];
const montage=new PNG({width:1416,height:2360});for(let p=0;p<montage.data.length;p+=4){montage.data[p]=14;montage.data[p+1]=24;montage.data[p+2]=28;montage.data[p+3]=255;}
for(const [i,[key,name]] of tiers.entries()){const file=path.join(source,key+'-desktop.png'),original=PNG.sync.read(fs.readFileSync(file)),crop=new PNG({width:1376,height:370});PNG.bitblt(original,crop,32,350,1376,370,0,0);fs.writeFileSync(path.join(destination,(i+1)+'_'+name+'_外框.png'),PNG.sync.write(crop),{flag:'wx'});fs.copyFileSync(file,path.join(destination,(i+1)+'_'+name+'_完整页面.png'),fs.constants.COPYFILE_EXCL);PNG.bitblt(crop,montage,0,0,1376,370,20,20+i*390);}
fs.writeFileSync(path.join(destination,'00_六阶外框对比总览.png'),PNG.sync.write(montage),{flag:'wx'});
fs.writeFileSync(path.join(destination,'说明.txt'),'图片取自此前保存的真实浏览器截图，使用合成记录，不含完整 UID。外框样式未在后续教程调整中修改。\n单张图片只展示动态外框的一个静态时刻。\n本次仅整理已有截图，没有联网、运行游戏或执行 PowerShell。\n',{flag:'wx'});console.log(JSON.stringify({folder:destination,images:13}));
