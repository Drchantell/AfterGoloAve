'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const ROOT=__dirname,PORT=Number(process.env.PORT||3000),PROD=process.env.NODE_ENV==='production';
if(PROD && !/^https:\/\//.test(process.env.PUBLIC_ORIGIN||''))throw Error('Production PUBLIC_ORIGIN must use HTTPS');
const dbPath=path.resolve(process.env.DATABASE_PATH||path.join(ROOT,'data','afterglow.sqlite'));
if(dbPath.startsWith(path.join(ROOT,'assets')+path.sep))throw Error('Database must not be public');
fs.mkdirSync(path.dirname(dbPath),{recursive:true});
const db=new DatabaseSync(dbPath);db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;');
db.exec('CREATE TABLE IF NOT EXISTS members(id INTEGER PRIMARY KEY, display_name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, salt TEXT NOT NULL, pass_hash TEXT NOT NULL, adult INTEGER NOT NULL CHECK(adult=1), created INTEGER NOT NULL)');
db.exec('CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE, expires INTEGER NOT NULL)');
db.exec('CREATE TABLE IF NOT EXISTS saved_cities(member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE, city TEXT NOT NULL, PRIMARY KEY(member_id,city))');
db.exec('CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY, member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE, category TEXT NOT NULL, details TEXT NOT NULL, created INTEGER NOT NULL)');
const pages={'/':'index.html','/index.html':'index.html','/cities.html':'cities.html','/arcade.html':'arcade.html','/account.html':'account.html','/assets/aga-neon.webp':'assets/aga-neon.webp'};
const CITIES=['Atlanta','Berlin','Brooklyn','Charlotte','Chicago','Houston','Kingston','Las Vegas','Lagos','London','Los Angeles','Miami','Montreal','New York City','Paris','Seoul','Tokyo','Toronto'];
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const pass=(p,s)=>crypto.scryptSync(p,Buffer.from(s,'hex'),64).toString('hex');
const reply=(res,status,data,headers={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(data));};
const error=(res,status,msg)=>reply(res,status,{error:msg});
const plain=p=>({id:p.id,displayName:p.display_name,email:p.email});
const cookie=(t,age)=>'aga_session='+t+'; HttpOnly; SameSite=Lax; Path=/; Max-Age='+age+(PROD?'; Secure':'');
const rate=new Map();
function limited(req){const ip=req.socket.remoteAddress||'unknown',now=Date.now();let b=rate.get(ip);if(!b||now-b.t>60000)b={t:now,n:0};b.n++;rate.set(ip,b);if(rate.size>2000){for(const [k,v] of rate){if(now-v.t>60000)rate.delete(k);}}return b.n>80;}
function parse(req){return new Promise((resolve,reject)=>{let d='',size=0;req.on('data',p=>{size+=p.length;if(size>16384){reject(Object.assign(Error('Request too large'),{code:413}));req.destroy();}else d+=p;});req.on('end',()=>{try{const o=JSON.parse(d||'{}');if(!o||Array.isArray(o)||typeof o!=='object')throw Error();resolve(o);}catch{reject(Object.assign(Error('Invalid JSON'),{code:400}));}});req.on('error',reject);});}
function token(req){return (req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('aga_session='))?.slice(12)||'';}
function member(req){const t=token(req);if(!/^[0-9a-f]{64}$/.test(t))return null;return db.prepare('SELECT m.id,m.display_name,m.email FROM members m JOIN sessions s ON m.id=s.member_id WHERE s.token_hash=? AND s.expires>?').get(hash(t),Date.now())||null;}
function begin(res,p){const t=crypto.randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions(token_hash,member_id,expires) VALUES(?,?,?)').run(hash(t),p.id,Date.now()+604800000);return {'Set-Cookie':cookie(t,604800)};}
function valid(s,n){return typeof s==='string'&&s.trim().length>0&&s.trim().length<=n;}
function email(s){return typeof s==='string'&&s.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);}
async function api(req,res,url){
const route=url.pathname,method=req.method;
if(route==='/api/health'&&method==='GET')return reply(res,200,{ok:true,service:'AGA'});
if(limited(req))return error(res,429,'Too many requests');
if(!['GET','HEAD'].includes(method)&&req.headers.origin&&req.headers.origin!==(process.env.PUBLIC_ORIGIN||'http://'+req.headers.host))return error(res,403,'Origin not allowed');
if(route==='/api/register'&&method==='POST'){const b=await parse(req),name=b.displayName,emailAddress=typeof b.email==='string'?b.email.trim().toLowerCase():'';
if(!valid(name,60)||!email(emailAddress)||typeof b.password!=='string'||b.password.length<12||b.password.length>128||b.adultConfirmed!==true)return error(res,400,'Valid name, email, 12-character minimum password and 18+ confirmation required');
if(db.prepare('SELECT id FROM members WHERE email=?').get(emailAddress))return error(res,409,'Account already exists');
const salt=crypto.randomBytes(16).toString('hex'),pwhash=pass(b.password,salt);
const r=db.prepare('INSERT INTO members(display_name,email,salt,pass_hash,adult,created) VALUES(?,?,?,?,1,?)').run(name.trim(),emailAddress,salt,pwhash,Date.now());
const p={id:Number(r.lastInsertRowid),display_name:name.trim(),email:emailAddress};return reply(res,201,{member:plain(p)},begin(res,p));}
if(route==='/api/login'&&method==='POST'){const b=await parse(req),e=typeof b.email==='string'?b.email.trim().toLowerCase():'',p=email(e)?db.prepare('SELECT * FROM members WHERE email=?').get(e):null;
const actual=Buffer.from(pass(typeof b.password==='string'?b.password:'',p?.salt||'00000000000000000000000000000000'),'hex');
const expected=Buffer.from(p?.pass_hash||'00'.repeat(64),'hex');
if(!p||!crypto.timingSafeEqual(actual,expected))return error(res,401,'Invalid email or password');
return reply(res,200,{member:plain(p)},begin(res,p));}
if(route==='/api/logout'&&method==='POST'){const t=token(req);if(/^[0-9a-f]{64}$/.test(t))db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(t));return reply(res,200,{ok:true},{'Set-Cookie':cookie('',0)});}
if(route==='/api/me'&&method==='GET'){const p=member(req);return p?reply(res,200,{member:plain(p)}):error(res,401,'Sign in first');}
if(route==='/api/cities'&&method==='GET')return reply(res,200,{cities:CITIES});
if(route==='/api/saved-cities'&&['GET','POST','DELETE'].includes(method)){const p=member(req);if(!p)return error(res,401,'Sign in first');
if(method==='GET')return reply(res,200,{cities:db.prepare('SELECT city FROM saved_cities WHERE member_id=? ORDER BY city').all(p.id).map(x=>x.city)});
const b=await parse(req);if(!CITIES.includes(b.city))return error(res,400,'Select a listed city');
if(method==='POST')db.prepare('INSERT OR IGNORE INTO saved_cities(member_id,city) VALUES(?,?)').run(p.id,b.city);
else db.prepare('DELETE FROM saved_cities WHERE member_id=? AND city=?').run(p.id,b.city);
return reply(res,200,{ok:true});}
if(route==='/api/report'&&method==='POST'){const p=member(req);if(!p)return error(res,401,'Sign in first');const b=await parse(req);
if(!['harassment','spam','safety','other'].includes(b.category)||!valid(b.details,1000))return error(res,400,'Choose category and describe concern');
db.prepare('INSERT INTO reports(member_id,category,details,created) VALUES(?,?,?,?)').run(p.id,b.category,b.details.trim(),Date.now());
return reply(res,201,{ok:true,message:'Report recorded for review'});}
return error(res,404,'API route not found');
}
const server=http.createServer(async(req,res)=>{try{
res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');res.setHeader('Permissions-Policy','geolocation=(), camera=(), microphone=()');
const url=new URL(req.url,'http://localhost');
if(url.pathname.startsWith('/api/'))return await api(req,res,url);
const file=pages[url.pathname];if(!file||!['GET','HEAD'].includes(req.method))return error(res,404,'Not found');
const full=path.join(ROOT,file);fs.stat(full,(e,stat)=>{if(e||!stat.isFile())return error(res,404,'Not found');
const type=file.endsWith('.webp')?'image/webp':'text/html; charset=utf-8';
res.writeHead(200,{'Content-Type':type,'Content-Length':stat.size,'Cache-Control':'no-cache'});if(req.method==='HEAD')return res.end();fs.createReadStream(full).pipe(res);});
}catch(e){if(e?.code===400)return error(res,400,e.message);if(e?.code===413)return error(res,413,e.message);if(e?.code==='SQLITE_CONSTRAINT_UNIQUE')return error(res,409,'Account already exists');console.error(e);return error(res,500,'Server error');}});
if(require.main===module)server.listen(PORT,()=>console.log('AGA ready on port '+PORT));
module.exports={server,db};
