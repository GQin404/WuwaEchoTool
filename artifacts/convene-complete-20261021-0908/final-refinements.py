from pathlib import Path
import json
R=Path.cwd()
p=R/'js/character-catalog.js';t=p.read_text('utf-8');start=t.index('const records=')+len('const records=');end=t.index(';\nconst normalize',start);rows=json.loads(t[start:end]);t=t[:start]+json.dumps(rows,ensure_ascii=False,indent=2)+t[end:];p.write_text(t,encoding='utf-8',newline='\n')
p=R/'js/weapon-catalog.js';t=p.read_text('utf-8');prefix,payload=t.split('()=>(',1);data=json.loads(payload.rsplit('));',1)[0]);p.write_text(prefix+'()=>('+json.dumps(data,ensure_ascii=False,indent=2)+'));\n',encoding='utf-8',newline='\n')
p=R/'js/convene-service.js';t=p.read_text('utf-8');old="if(Number(body.code)!==0)throw Error('AUTH_OR_API');";assert old in t
t=t.replace(old,"if(Number(body.code)!==0){const reason=String(body.msg??body.message??'');throw Error(/(?:record|token|authori[sz]ation).*expir|(?:授权|授權|链接|連結).*(?:过期|過期|失效)/i.test(reason)?'LINK_EXPIRED':'AUTH_OR_API');}")
t=t.replace("['RATE_LIMIT','PROXY_REQUIRED'", "['LINK_EXPIRED','RATE_LIMIT','PROXY_REQUIRED'")
t=t.replace("['TIMEOUT','NETWORK','AUTH_OR_API'", "['LINK_EXPIRED','TIMEOUT','NETWORK','AUTH_OR_API'")
p.write_text(t,encoding='utf-8',newline='\n')
p=R/'js/convene-i18n.js';t=p.read_text('utf-8');at=t.rfind('return {');t=t[:at]+"Object.assign(rows,{LINK_EXPIRED:['官方明確回覆連結授權已失效；請在遊戲重新開啟歷史並取得新連結。','官方明确回复链接授权已失效；请在游戏重新打开历史并获取新链接。','The API explicitly reported expired link authorization. Reopen in-game history and get a fresh URL.']});\n"+t[at:];p.write_text(t,encoding='utf-8',newline='\n')
print('Readable registry data; explicit expired-link category without guessed numeric API codes or raw messages.')
