const fs=require('fs');let p='js/convene-ui.js',s=fs.readFileSync(p,'utf8').replace('poolCards({pools:[pool]})','poolCards({pools:[pool],limited:s.limited})');fs.writeFileSync(p,s);
