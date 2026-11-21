'use strict';
const table = document.querySelector('#table');
const menu = document.querySelector('#menu');
const names = ['Spades','Tunk','Backgammon','Chess','Neon Maze','Golf Solitaire','Mini Sudoku','City Word Search'];
let game, state;
const range = n => Array.from({length:n},(_,i)=>i);
function shuffle(cards) {
  for (let i=cards.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [cards[i],cards[j]]=[cards[j],cards[i]];
  }
  return cards;
}
const deck = () => shuffle(range(52));
const suit = c => Math.floor(c/13);
const rank = c => c%13;
const card = c => 'A23456789TJQK'[rank(c)].replace('T','10')+'♣♦♥♠'[suit(c)];
const strength = c => (rank(c)+12)%13;
const points = c => Math.min(rank(c)+1,10);
const btn = (label,action,disabled=false) => '<button type="button" data-act="'+action+'" '+(disabled?'disabled':'')+'>'+label+'</button>';
function start(n) {
  game=n; const cards=deck();state={note:'',over:false};
  if(n===0) Object.assign(state,{hands:range(4).map(i=>cards.slice(i*13,i*13+13)),turn:0,trick:[],wins:[0,0],broken:false,players:['You','West','Partner','East'],bid:null});
  if(n===1) Object.assign(state,{hands:[cards.splice(0,5),cards.splice(0,5)],pile:[cards.pop()],stock:cards,drawn:false});
  if(n===2) Object.assign(state,bgStart());
  if(n===3) Object.assign(state,{board:('rnbqkbnrpppppppp'+'.'.repeat(32)+'PPPPPPPPRNBQKBNR').split(''),white:true,sel:-1,castle:'KQkq',ep:-1});
  if(n===4) Object.assign(state,mazeStart());
  if(n===5) Object.assign(state,golfStart());
  if(n===6) Object.assign(state,sudokuStart());
  if(n===7) Object.assign(state,wordStart());
  render();
}
function spadesOptions(s) {
  const hand=s.hands[s.turn];
  const follow=s.trick.length?hand.filter(c=>suit(c)===suit(s.trick[0].c)):hand.filter(c=>s.broken||suit(c)!==3);
  return follow.length?follow:hand;
}
function trickPlay(c) {
  const s=state; s.hands[s.turn].splice(s.hands[s.turn].indexOf(c),1);
  s.trick.push({p:s.turn,c}); if(suit(c)===3)s.broken=true;
  s.turn=(s.turn+1)%4;
  if(s.trick.length===4){
    const lead=suit(s.trick[0].c);
    const value=c=>(suit(c)===3?30:suit(c)===lead?15:0)+strength(c);
    const best=s.trick.reduce((a,b)=>value(a.c)>value(b.c)?a:b);
    s.note=s.trick.map(x=>s.players[x.p]+' '+card(x.c)).join(' · ')+' — '+s.players[best.p]+' won.';
    s.wins[best.p%2]++;s.turn=best.p;s.trick=[];
    if(!s.hands[0].length){s.over=true;s.note+=' Your team '+(s.wins[0]>=s.bid?'made':'missed')+' its bid.';}
  }
}
function spadesUI(){
 const s=state;
 if(s.bid===null)return '<p>One-hand team challenge. Bid the number of tricks you and your computer partner will take together. Follow suit when possible. Spades are trump.</p>'+range(13).map(i=>btn(i+1,'bid-'+(i+1))).join(' ');
 return '<p>Your team '+s.wins[0]+' / bid '+s.bid+' · Opponents '+s.wins[1]+'</p><p>'+s.trick.map(x=>s.players[x.p]+' '+card(x.c)).join(' · ')+'</p>'+s.hands[0].map(c=>btn(card(c),'card-'+c,!spadesOptions(s).includes(c))).join(' ');
}
function meld(cs){
 if(cs.length<3)return false;
 if(cs.every(c=>rank(c)===rank(cs[0])))return true;
 const sorted=cs.slice().sort((a,b)=>a-b);
 return sorted.every((c,i)=>suit(c)===suit(sorted[0])&&(!i||c===sorted[i-1]+1));
}
function deadwood(hand){
 let best=hand.reduce((a,c)=>a+points(c),0);
 for(let mask=1;mask<(1<<hand.length);mask++){
  const group=hand.filter((_,i)=>mask&(1<<i));
  if(meld(group))best=Math.min(best,deadwood(hand.filter((_,i)=>!(mask&(1<<i)))));
 }
 return best;
}
function tunkEnd(){
 const s=state,a=deadwood(s.hands[0]),b=deadwood(s.hands[1]);
 s.over=true;s.note='Showdown · You '+a+' · Opponent '+b+'. '+(a===b?'Tie.':a<b?'You win.':'Opponent wins.');
}
function tunkUI(){const s=state;
 return '<p>Five-card house rules. Draw one, discard one. Sets and same-suit runs of three or more reduce deadwood automatically. Knock before drawing at five points or fewer. Lowest deadwood wins.</p><p>Deadwood '+deadwood(s.hands[0])+' · Stock '+s.stock.length+' · Discard '+(s.pile.length?card(s.pile.at(-1)):'empty')+'</p>'+s.hands[0].map(c=>btn(card(c),'drop-'+c,!s.drawn||s.over||c===s.picked)).join(' ')+'<p>'+btn('Draw stock','stock',s.drawn||s.over)+btn('Take discard','pile',s.drawn||s.over)+btn('Knock','knock',s.drawn||s.over||deadwood(s.hands[0])>5)+'</p>';
}
function tunkAction(a,id){
 const s=state;
 if(a==='knock')return tunkEnd();
 if(a==='stock'||a==='pile'){const c=(a==='stock'?s.stock:s.pile).pop();s.hands[0].push(c);s.drawn=true;s.picked=a==='pile'?c:null;s.note='Choose a card to discard.';return;}
 s.hands[0].splice(s.hands[0].indexOf(id),1);s.pile.push(id);s.drawn=false;
 if(!deadwood(s.hands[0])||!s.stock.length)return tunkEnd();
 const h=s.hands[1];h.push(s.stock.pop());const choices=h.map((c,i)=>({c,i,score:deadwood(h.filter((_,j)=>j!==i))})).sort((a,b)=>a.score-b.score);
 s.pile.push(h.splice(choices[0].i,1)[0]);s.note='Opponent discarded '+card(s.pile.at(-1))+'.';
 if(!s.stock.length||deadwood(h)<=5)tunkEnd();
}
function bgStart(){
 const board=Array(24).fill(0);
 for(const [point,count] of [[0,2],[11,5],[16,3],[18,5]]){board[point]=count;board[23-point]=-count;}
 return {board,bar:[0,0],turn:0,dice:[],off:[0,0]};
}
function bgMoves(s){
 const t=s.turn,dir=t?-1:1,entry=t?24:-1,m=[];
 const sources=s.bar[t]?[entry]:range(24).filter(i=>s.board[i]*dir>0);
 for(const from of sources)for(const d of new Set(s.dice)){
  const to=from+d*dir;
  if(to>=0&&to<24){if(s.board[to]*dir>=-1)m.push({from,to,d});continue;}
  const rel=i=>t?23-i:i;
  if(!s.bar[t]&&sources.every(i=>rel(i)>=18)&&(rel(to)===24||sources.every(i=>rel(i)>=rel(from))))m.push({from,to,d});
 }
 return m;
}
function bgApply(s,m){
 const t=s.turn,dir=t?-1:1;
 if(m.from<0||m.from>23)s.bar[t]--;else s.board[m.from]-=dir;
 if(m.to<0||m.to>23)s.off[t]++;
 else {if(s.board[m.to]===-dir){s.bar[1-t]++;s.board[m.to]=0;}s.board[m.to]+=dir;}
 s.dice.splice(s.dice.indexOf(m.d),1);
}
function bestBg(s){
 const moves=bgMoves(s).map(m=>{
  const next=structuredClone(s);bgApply(next,m);
  return {m,length:1+(bestBg(next)[0]?.length||0)};
 });
 const max=Math.max(0,...moves.map(x=>x.length));
 const usable=moves.filter(x=>x.length===max);
 return max===1?usable.filter(x=>x.m.d===Math.max(...usable.map(y=>y.m.d))):usable;
}
function bgUI(){
 const s=state;
 const points=range(24).map(i=>'<span style="padding:4px;border:1px solid #777">'+(i+1)+'<br>'+(s.board[i]?(s.board[i]>0?'○':'●')+Math.abs(s.board[i]):'·')+'</span>').join('');
 const label=i=>i<0||i>23?'Bar':i+1;
 return '<p>Two players on one device. White moves toward point 24, Black toward point 1. Pick a legal move below the board. First to bear off 15 wins.</p><p>'+['White','Black'][s.turn]+' to play · Bar '+s.bar.join(' / ')+' · Off '+s.off.join(' / ')+'</p><div style="display:grid;grid-template-columns:repeat(12,1fr);text-align:center;font-size:clamp(10px,2.8vw,16px)">'+points+'</div><p>'+(!s.dice.length?btn('Roll dice','roll',s.over):'Dice '+s.dice.join(' · '))+'</p>'+bestBg(s).map(({m},i)=>btn(label(m.from)+' → '+(m.to<0||m.to>23?'Off':m.to+1)+' ('+m.d+')','move-'+i)).join(' ');
}
function bgAction(a,id){
 const s=state;
 if(a==='roll'){const roll=()=>1+Math.floor(Math.random()*6);s.dice=[roll(),roll()];if(s.dice[0]===s.dice[1])s.dice.push(...s.dice);}
 else bgApply(s,bestBg(s)[id].m);
 if(s.off[s.turn]===15){s.over=true;s.note=['White','Black'][s.turn]+' wins!';return;}
 if(!bestBg(s).length){s.note=s.dice.length?'No further legal moves. Turn passes.':'Turn complete.';s.dice=[];s.turn=1-s.turn;}else s.note='';
}
const pieceNames={k:'King',q:'Queen',r:'Rook',b:'Bishop',n:'Knight',p:'Pawn'};
const symbols='♔♕♖♗♘♙♚♛♜♝♞♟';
const white=p=>p!=='.'&&p===p.toUpperCase();
function geometry(s,from,to,attack=false){
 const b=s.board,p=b[from],w=white(p),kind=p.toLowerCase(),dest=b[to];
 const dx=to%8-from%8,dy=(to>>3)-(from>>3),x=Math.abs(dx),y=Math.abs(dy),dir=w?-1:1;
 if(from===to||p==='.'||(!attack&&dest!=='.'&&(white(dest)===w||dest.toLowerCase()==='k')))return false;
 if(kind==='p'){
  if(attack)return x===1&&dy===dir;
  return x===1&&dy===dir&&(dest!=='.'||to===s.ep)||!x&&dest==='.'&&(dy===dir||dy===2*dir&&(from>>3)===(w?6:1)&&b[from+8*dir]==='.');
 }
 if(kind==='n')return x*y===2;
 if(kind==='k'){
  if(Math.max(x,y)===1)return true;
  if(attack||dy||x!==2||from!==(w?60:4))return false;
  const sign=Math.sign(dx),right=sign===1?(w?'K':'k'):(w?'Q':'q');
  return s.castle.includes(right)&&[1,2,...(sign<0?[3]:[])].every(i=>b[from+sign*i]==='.')&&![from,from+sign].some(i=>attacked(s,i,!w));
 }
 if(!(x===y&&'bq'.includes(kind)||(x===0||y===0)&&'rq'.includes(kind)))return false;
 const step=Math.sign(dx)+8*Math.sign(dy);
 for(let i=from+step;i!==to;i+=step)if(b[i]!=='.')return false;
 return true;
}
function attacked(s,cell,byWhite){return s.board.some((p,i)=>p!=='.'&&white(p)===byWhite&&geometry(s,i,cell,true));}
function chessApply(s,from,to,promote='Q'){
 const b=s.board,p=b[from],w=white(p),dir=w?-8:8;
 if(p.toLowerCase()==='p'&&to===s.ep)b[to-dir]='.';
 if(p.toLowerCase()==='k'){
  s.castle=s.castle.replace(w?/[KQ]/g:/[kq]/g,'');
  if(Math.abs(to-from)===2){const sign=Math.sign(to-from),corner=from+(sign>0?3:-4);b[from+sign]=b[corner];b[corner]='.';}
 }
 for(const [corner,flag] of [[0,'q'],[7,'k'],[56,'Q'],[63,'K']])if(from===corner||to===corner)s.castle=s.castle.replace(flag,'');
 s.ep=p.toLowerCase()==='p'&&Math.abs(to-from)===16?from+dir:-1;
 b[to]=p.toLowerCase()==='p'&&(to<8||to>=56)?(w?promote:promote.toLowerCase()):p;b[from]='.';s.white=!w;
}
function legalChess(s,i,j){
 if(s.board[i]==='.'||white(s.board[i])!==s.white||!geometry(s,i,j))return false;
 const next={...s,board:s.board.slice()};chessApply(next,i,j);
 return !attacked(next,next.board.indexOf(s.white?'K':'k'),!s.white);
}
const square=i=>'abcdefgh'[i%8]+(8-(i>>3));
function chessUI(){
 const s=state;
 return '<p>Two players on one device. Select a piece, then a highlighted destination. White starts.</p><p>'+ (s.white?'White':'Black')+' to move</p><div class="board">'+s.board.map((p,i)=>{
  const dest=s.sel>=0&&legalChess(s,s.sel,i);
  return '<button aria-label="'+square(i)+' '+(p==='.'?'empty':(white(p)?'white ':'black ')+pieceNames[p.toLowerCase()])+'" class="'+(((i%8+(i>>3))%2)?'light ':'')+(s.sel===i||dest?'sel':'')+'" data-act="cell-'+i+'">'+(p==='.'?(dest?'•':'&nbsp;'):symbols['KQRBNPkqrbnp'.indexOf(p)])+'</button>';
 }).join('')+'</div>'+(s.promotion?'<p>Promote to '+['Q','R','B','N'].map(p=>btn(pieceNames[p.toLowerCase()],'promote-'+p)).join(' ')+'</p>':'');
}
function chessAction(a,arg){
 const s=state,i=Number(arg);
 if(s.promotion&&a!=='promote')return;
 if(a==='promote'){chessApply(s,...s.promotion,arg);s.promotion=null;}
 else if(s.sel>=0&&legalChess(s,s.sel,i)){
  if(s.board[s.sel].toLowerCase()==='p'&&(i<8||i>=56)){s.promotion=[s.sel,i];return;}
  chessApply(s,s.sel,i);
 }else {s.sel=s.board[i]!=='.'&&white(s.board[i])===s.white?i:-1;return;}
 s.sel=-1;
 const check=attacked(s,s.board.indexOf(s.white?'K':'k'),!s.white);
 s.over=!range(64).some(from=>range(64).some(to=>legalChess(s,from,to)));
 s.note=s.over?(check?'Checkmate. '+(s.white?'Black':'White')+' wins.':'Stalemate.'):(check?'Check.':'');
}
const labyrinth=['#############','#.....#.....#','#.###.#.###.#','#...........#','###.#.#.#.###','#...#...#...#','#.#.#####.#.#','#...........#','#############'].join('');
const directions={up:-13,down:13,left:-1,right:1};
function mazeStart(){return {pos:14,ghost:102,prev:-1,steps:0,dots:new Set(range(labyrinth.length).filter(i=>labyrinth[i]==='.'&&i!==14))};}
function mazeUI(){
 const s=state;
 const tiles=Array.from(labyrinth,(v,i)=>i===s.pos?'◆':i===s.ghost?'✹':v==='#'?'▓':s.dots.has(i)?'·':' ').join('').match(/.{13}/g);
 return '<p>Collect every light ◆ without touching the violet hunter ✹. Use the arrows or tap to move. The hunter moves every second step.</p><p>'+s.dots.size+' lights left</p><pre class="maze">'+tiles.join('\n').replace('✹','<span style="color:#cb63ff">✹</span>')+'</pre>'+Object.keys(directions).map(d=>btn(d,'walk-'+d,s.over)).join(' ');
}
function mazeAction(dir){
 const s=state,to=s.pos+directions[dir];
 if(labyrinth[to]!=='.')return;
 s.pos=to;s.steps++;s.dots.delete(to);
 if(s.pos!==s.ghost&&s.steps%2===0){
  const near=Object.values(directions).map(d=>s.ghost+d).filter(i=>labyrinth[i]==='.');
  const valid=near.filter(i=>i!==s.prev);s.prev=s.ghost;
  const distance=i=>Math.abs(i%13-s.pos%13)+Math.abs((i/13|0)-(s.pos/13|0));
  s.ghost=shuffle(valid.length?valid:near).sort((a,b)=>distance(a)-distance(b))[0];
 }
 if(s.pos===s.ghost||!s.dots.size){s.over=true;s.note=s.pos===s.ghost?'Caught! Try another run.':'Every light collected. You win!';}
}
function render(){
 menu.innerHTML=names.map((n,i)=>btn(n,'open-'+i)).join('');
 table.innerHTML='<h2>'+names[game]+'</h2>'+[spadesUI,tunkUI,bgUI,chessUI,mazeUI,golfUI,sudokuUI,wordUI][game]()+'<p>'+state.note+'</p>'+btn('New game','reset');
}
document.addEventListener('click',event=>{
 const control=event.target.closest('[data-act]');if(!control)return;
 const [action,arg]=control.dataset.act.split('-'),id=Number(arg);
 if(action==='open')return start(id);
 if(action==='reset')return start(game);
 if(state.over)return;
 if(game===0){
  if(action==='bid')state.bid=id;else trickPlay(id);
  while(state.turn!==0&&!state.over)trickPlay(spadesOptions(state).slice().sort((a,b)=>strength(a)-strength(b))[0]);
 }else if(game===1)tunkAction(action,id);
 else if(game===2)bgAction(action,id);
 else if(game===3)chessAction(action,arg);
 else if(game===4)mazeAction(arg);
 else if(game===5)golfAction(action,id);
 else if(game===6)sudokuAction(action,id);
 else wordAction(id);
 render();
});
document.addEventListener('keydown',e=>{
 const dir=e.key.replace('Arrow','').toLowerCase();
 if(game===4&&!state.over&&Object.hasOwn(directions,dir)){e.preventDefault();mazeAction(dir);render();}
});
start(0);
