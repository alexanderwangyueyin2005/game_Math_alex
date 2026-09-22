'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
let Game,reduced=false;
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../array-architects.js'),'utf8'),{
  window:{ArrayArchitectsEngine:{},matchMedia:()=>({matches:reduced})},
  HTMLElement:class{},customElements:{get:()=>null,define:(_,component)=>{Game=component;}},
  setTimeout,clearTimeout,console
});
function harness(rows=4,total=24){
  const game=Object.create(Game.prototype),queue=[],phases=[],events=[];
  const classes=new Set();
  const node={classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},setAttribute(){},removeAttribute(){},focus(){}};
  Object.assign(game,{joining:false,rows,allocations:Array.from({length:rows},()=>[]),pool:Array.from({length:total},(_,i)=>i),shadowRoot:{querySelector:()=>node,querySelectorAll:()=>[]},save(){},clearFeedback(){},later(delay,callback){queue.push({delay,callback});},drawArray(confirm=true){phases.push({confirm,pool:this.pool.length,groups:this.allocations.map(a=>a.length)});},refreshWork(){phases.push({numbersConfirmed:true,pool:this.pool.length});},log(name,payload){events.push({name,payload});},flashSharing(){}});
  return {game,queue,phases,events,classes,advance(){const next=queue.shift();assert.ok(next,'scheduled phase exists');next.callback();return next.delay;}};
}
test('sharing confirms numbers only after lift, travel and landing; all objects conserved',()=>{
  const h=harness();h.game.moveObjects('deal',NaN);
  assert.equal(h.game.pool.length,24);assert.equal(h.game.joining,true);assert.ok(h.classes.has('in-flight'));
  assert.equal(h.advance(),120);
  assert.equal(h.game.pool.length,24);assert.deepEqual(h.game.allocations.map(a=>a.length),[0,0,0,0]);
  assert.equal(h.phases[0].pool,20); // Only visual destination changes during travel.
  assert.equal(h.phases.length,1);assert.equal(h.phases[0].confirm,false);assert.equal(h.events.length,0);
  assert.equal(h.advance(),620);assert.ok(h.classes.has('landing'));assert.equal(h.events.length,0);
  assert.equal(h.advance(),180);assert.equal(h.game.joining,false);
  assert.equal(h.phases.at(-1).numbersConfirmed,true);assert.equal(h.events.length,1);
  assert.equal(h.events[0].payload.remaining,20);
  assert.equal(new Set([...h.game.pool,...h.game.allocations.flat()]).size,24);
});
test('rapid deal clicks are ignored while physical transfer is active',()=>{
  const h=harness();h.game.moveObjects('deal',NaN);h.game.moveObjects('deal',NaN);
  assert.equal(h.queue.length,1);h.advance();h.advance();h.advance();
  assert.equal(h.game.pool.length,20);assert.equal(h.events.length,1);
});
test('place then return moves the same object and restores the pool',()=>{
  const h=harness(3,12);h.game.moveObjects('place',1);h.advance();h.advance();h.advance();
  assert.equal(h.game.allocations[1][0],0);assert.equal(h.game.pool.length,11);
  h.game.returnObject=0;h.game.moveObjects('return',1);h.advance();h.advance();h.advance();
  assert.equal(h.game.allocations[1].length,0);assert.equal(h.game.pool.length,12);
  assert.equal(new Set(h.game.pool).size,12);
});

test('interrupted travel has not committed a partially recorded distribution',()=>{
  const h=harness();h.game.moveObjects('deal',NaN);h.advance();
  // Detach/refresh cancels pending timers: the saved logical state is still intact.
  h.queue.length=0;
  assert.equal(h.game.pool.length,24);assert.equal(h.game.allocations.flat().length,0);assert.equal(h.events.length,0);
});
test('reduced motion reaches the same result without lift/travel durations',()=>{
  reduced=true;
  try{const h=harness();h.game.moveObjects('deal',NaN);assert.equal(h.advance(),0);assert.equal(h.advance(),0);assert.equal(h.advance(),0);assert.equal(h.game.pool.length,20);assert.equal(h.events.length,1);}finally{reduced=false;}
});
