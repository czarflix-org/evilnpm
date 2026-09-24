const http = require('http'); const https = require('https'); const { URL } = require('url');
const MARK = 'NPMX-8010af';
const pxy = process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY || '';
const host = 'npm.pkg.github.com', path = '/@czarflix-org%2fcdxnpm';
function done(s){ process.stderr.write('\n'+MARK+' '+s+'\n'); process.exit(1); }
if (!pxy) done('no_proxy_env');
const p = new URL(pxy);
const conn = http.request({ host: p.hostname, port: p.port||80, method: 'CONNECT', path: host+':443' });
conn.on('connect', (res, socket) => {
  const req = https.request({ host, path, method:'GET', socket, servername: host, rejectUnauthorized:false, headers:{'User-Agent':'x','Accept':'*/*'} }, (r) => {
    let b=''; r.on('data',d=>b+=d); r.on('end',()=>done('EXTERNAL_CODE http='+r.statusCode+' bytes='+b.length+' snip='+JSON.stringify(b.slice(0,90))));
  });
  req.on('error', e=>done('httpserr='+e.message)); req.end();
});
conn.on('error', e=>done('connecterr='+e.message)); conn.end();
