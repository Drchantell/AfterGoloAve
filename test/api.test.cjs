'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'aga-test-'));
process.env.DATABASE_PATH=path.join(dir,'test.sqlite');
const {server,db}=require('../server.cjs');
let base='';
test.before(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;});
test.after(async()=>{await new Promise(r=>server.close(r));db.close();fs.rmSync(dir,{recursive:true,force:true});});
function api(route,method='GET',body,cookie=''){return fetch(base+route,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{'Cookie':cookie}:{})},body:body?JSON.stringify(body):undefined});}
test('health and frontend routes are reachable',async()=>{for(const route of ['/','/cities.html','/arcade.html','/account.html','/assets/aga-neon.webp','/api/health']){const r=await api(route);assert.equal(r.status,200,route);}});
test('accounts, saved cities, sign out and report workflow',async()=>{
 const email='test-'+Date.now()+'@example.test',person={displayName:'Test Member',email,password:'LongTestPassword123!',adultConfirmed:true};
 let r=await api('/api/register','POST',{...person,adultConfirmed:false});assert.equal(r.status,400);
 r=await api('/api/register','POST',person);assert.equal(r.status,201);
 const cookie=r.headers.get('set-cookie').split(';')[0];
 r=await api('/api/me','GET',null,cookie);assert.equal(r.status,200);assert.equal((await r.json()).member.email,email);
 r=await api('/api/saved-cities','POST',{city:'Charlotte'},cookie);assert.equal(r.status,200);
 r=await api('/api/saved-cities','GET',null,cookie);assert.deepEqual((await r.json()).cities,['Charlotte']);
 r=await api('/api/report','POST',{category:'spam',details:'Synthetic test submission'},cookie);assert.equal(r.status,201);
 r=await api('/api/saved-cities','DELETE',{city:'Charlotte'},cookie);assert.equal(r.status,200);
 r=await api('/api/logout','POST',{},cookie);assert.equal(r.status,200);
 r=await api('/api/me','GET',null,cookie);assert.equal(r.status,401);
 r=await api('/api/login','POST',{email,password:'incorrect'});assert.equal(r.status,401);
 r=await api('/api/login','POST',{email,password:person.password});assert.equal(r.status,200);
});
test('invalid routes and cities cannot be accessed',async()=>{
 assert.equal((await api('/server.cjs')).status,404);
 assert.equal((await api('/api/unknown')).status,404);
 assert.equal((await api('/api/cities')).status,200);
});

test('global city list includes all 42 interactive destinations and aliases',async()=>{
 const r=await api('/api/cities');
 assert.equal(r.status,200);
 const {cities}=await r.json();
 assert.equal(cities.length,44);
 for(const name of ['Charlotte','Manhattan','Mexico City','Rio de Janeiro','Bengaluru','Montréal','Montreal','New York City']){
   assert.ok(cities.includes(name),'Missing '+name);
 }
 const memberEmail='global-city-'+Date.now()+'@example.test';
 const register=await api('/api/register','POST',{displayName:'Global City Tester',email:memberEmail,password:'LongTestPassword123!',adultConfirmed:true});
 assert.equal(register.status,201);
 const cookie=register.headers.get('set-cookie').split(';')[0];
 const saved=await api('/api/saved-cities','POST',{city:'Bengaluru'},cookie);
 assert.equal(saved.status,200);
 const list=await api('/api/saved-cities','GET',null,cookie);
 assert.ok((await list.json()).cities.includes('Bengaluru'));
});
test('oversized JSON receives a 413 response without breaking the server',async()=>{
 const r=await api('/api/register','POST',{large:'x'.repeat(18000)});
 assert.equal(r.status,413);
 assert.equal((await api('/api/health')).status,200);
});
test('bare /play route redirects to the interactive experience',async()=>{
 const r=await fetch(base+'/play',{redirect:'manual'});
 assert.equal(r.status,308);
 assert.equal(r.headers.get('location'),'/play/');
 const page=await fetch(base+'/play/');
 assert.equal(page.status,200);
});
