'use strict';
function golfStart(){
  const cards=deck();
  return {columns:range(7).map(()=>cards.splice(0,5)),top:cards.pop(),stock:cards};
}
function playableGolfCard(c){return Math.abs(rank(c)-rank(state.top))===1;}
function golfUI(){
  return '<p>Clear all seven columns. Play an exposed card one rank above or below the waste. Aces are low. Draw when you need a new rank.</p><p>Waste <strong>'+card(state.top)+'</strong> · Stock '+state.stock.length+'</p><div class="golf-columns">'+state.columns.map((col,i)=>'<div>'+col.slice(0,-1).map(c=>'<span>'+card(c)+'</span>').join('')+(col.length?btn(card(col.at(-1)),'take-'+i,!playableGolfCard(col.at(-1))):'✓')+'</div>').join('')+'</div>'+btn('Draw from stock','draw',!state.stock.length);
}
function golfAction(action,i){
  if(action==='draw'&&state.stock.length) state.top=state.stock.pop();
  if(action==='take'&&state.columns[i]?.length&&playableGolfCard(state.columns[i].at(-1))) state.top=state.columns[i].pop();
  const left=state.columns.flat().length;
  if(!left||(!state.stock.length&&!state.columns.some(c=>c.length&&playableGolfCard(c.at(-1))))){
    state.over=true;state.note=left?'Out of moves with '+left+' cards left.':'All seven columns cleared!';
  }
}
function sudokuStart(){
  const digits=shuffle([1,2,3,4]);
  const answer=Array.from('1234341221434321',c=>digits[Number(c)-1]);
  const fixed=new Set([0,3,5,6,8,11,13,14]);
  return {answer,fixed,values:answer.map((v,i)=>fixed.has(i)?v:0),selected:1};
}
function sudokuUI(){
  return '<p>Fill each row, column and outlined box with 1–4. Select an empty square, then a number.</p><div class="mini-grid">'+state.values.map((v,i)=>'<button type="button" aria-label="Row '+(1+(i>>2))+', column '+(1+i%4)+', '+(v||'empty')+'" class="'+(i===state.selected?'sel':'')+'" data-act="cell-'+i+'" '+(state.fixed.has(i)?'disabled':'')+'>'+(v||'·')+'</button>').join('')+'</div><div class="choices">'+[1,2,3,4].map(v=>btn(v,'digit-'+v)).join('')+btn('Erase','digit-0')+'</div>';
}
function sudokuAction(action,i){
  if(action==='cell'&&!state.fixed.has(i)) state.selected=i;
  if(action!=='digit')return;
  state.values[state.selected]=i;
  state.note='';
  if(state.values.every(Boolean)){
    const groups=[];
    for(let j=0;j<4;j++){
      groups.push(range(4).map(k=>state.values[4*j+k]),range(4).map(k=>state.values[4*k+j]));
      const corner=(j>>1)*8+(j%2)*2;
      groups.push([0,1,4,5].map(k=>state.values[corner+k]));
    }
    state.over=groups.every(g=>new Set(g).size===4);
    state.note=state.over?'Puzzle solved!':'Check for repeated numbers.';
  }
}
const cityWords=['SEOUL','MIAMI','PARIS','LAGOS','TOKYO','ACCRA','DUBAI','DELHI'];
function wordStart(){
  const grid=Array(49).fill(''),words=shuffle(cityWords.slice()).slice(0,4),paths=[];
  for(const word of words){
    const choices=[];
    for(const i of range(49))for(const [dx,dy] of [[1,0],[0,1],[1,1],[-1,1]]){
      const path=[];
      for(let k=0;k<word.length;k++){
        const x=i%7+k*dx,y=(i/7|0)+k*dy,p=y*7+x;
        if(x<0||x>=7||y>=7||(grid[p]&&grid[p]!==word[k]))break;
        path.push(p);
      }
      if(path.length===word.length)choices.push(path);
    }
    if(!choices.length)return wordStart();
    const path=shuffle(choices)[0];path.forEach((p,k)=>grid[p]=word[k]);paths.push(path);
  }
  return {words,paths,grid:grid.map(c=>c||String.fromCharCode(65+Math.floor(Math.random()*26))),found:[],selected:-1};
}
function wordUI(){
  return '<p>Select the first and last letters of each city. Look across, down and diagonally.</p><p>'+state.words.map((w,i)=>state.found.includes(i)?'<s>'+w+'</s>':w).join(' · ')+'</p><div class="word-grid">'+state.grid.map((c,i)=>'<button type="button" class="'+(state.selected===i?'sel ':'')+(state.found.some(j=>state.paths[j].includes(i))?'found':'')+'" data-act="letter-'+i+'">'+c+'</button>').join('')+'</div>';
}
function wordAction(i){
  if(state.selected<0){state.selected=i;state.note='Select the other end.';return;}
  const j=state.paths.findIndex(p=>[p[0],p.at(-1)].includes(i)&&[p[0],p.at(-1)].includes(state.selected)&&i!==state.selected);
  if(j>=0&&!state.found.includes(j))state.found.push(j);
  state.selected=-1;state.over=state.found.length===state.words.length;
  state.note=state.over?'You found every city!':j>=0?state.words[j]+' found.':'Try another pair.';
}
