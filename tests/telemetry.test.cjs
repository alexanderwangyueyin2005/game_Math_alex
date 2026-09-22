'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {Telemetry,toCSV}=require('../telemetry.js');
const store=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),key:i=>[...data.keys()][i],get length(){return data.size;}};};
test('events and active progress survive a new logger instance',()=>{const storage=store(),a=new Telemetry(storage);a.logEvent('split_selected',{split:[5,2]},{challengeId:'split-7-6',challengeType:'split',skill:'decomposition',attemptNumber:1});a.saveSnapshot({stage:'PLAY',split:5});const b=new Telemetry(storage);assert.equal(b.session.sessionId,a.session.sessionId);assert.equal(b.session.events.length,2);assert.deepEqual(b.session.snapshot,{stage:'PLAY',split:5});});
test('CSV exports event context, feedback, timing and result summary',()=>{const t=new Telemetry(store());t.logEvent('feedback_shown',{feedbackType:'wrong_subfact',scaffoldLevel:2,relatedField:'partA'},{challengeId:'split-7-6',attemptNumber:2});t.logEvent('challenge_completed',{challengeId:'split-7-6',skill:'decomposition',attemptCount:3,independentSuccess:false,finalSuccess:true,selectedSplitStrategy:[5,2],completionTimeMs:22000,selfCorrected:true,highestScaffoldLevel:2,subfactAccuracy:0.5});const csv=t.exportCSV();for(const value of ['challenge_summary','wrong_subfact','partA','22000','[5,2]','independentSuccess','selfCorrected','scaffoldLevel'])assert.ok(csv.includes(value),value);});
test('replay preserves older sessions for export',()=>{const t=new Telemetry(store());const first=t.session.sessionId;t.start();assert.notEqual(t.session.sessionId,first);assert.equal(t.allSessions().length,2);});
test('storage denial remains playable with in-memory export',()=>{const t=new Telemetry({getItem(){throw Error('denied');},setItem(){throw Error('denied');}});t.logEvent('hint_requested');assert.equal(t.persistent,false);assert.ok(t.exportCSV().includes('hint_requested'));});
test('CSV quotes text and prevents spreadsheet formula evaluation',()=>{const csv=toCSV([{sessionId:'x',events:[{eventName:'=BAD()',payload:{note:'a,"b"'}}],summaries:[]}]);assert.ok(csv.includes("'=BAD()"));assert.ok(csv.includes('""'));});

test('round 3 CSV preserves cue, support and per-part outcomes',()=>{
  const t=new Telemetry(store());
  t.logEvent('attention_cue_shown',{attentionCueShown:true,splitCueShown:true,cueType:'splitCueShown',trigger:'idle'});
  t.logEvent('support_opened',{supportOpened:true,supportType:'skip_count',relatedField:'partA'});
  t.logEvent('support_completed',{supportCompleted:true,supportType:'skip_count',relatedField:'partA'});
  t.logEvent('challenge_completed',{challengeId:'split-6-7',selectedSplit:[2,4],partial1Attempts:1,partial2Attempts:2,partial1Outcome:'correct_after_support',partial2Outcome:'correct_after_retry',supportUsed:true,supportType:'skip_count',independentSuccess:false,selfCorrected:true});
  const csv=t.exportCSV();
  for(const value of ['selectedSplit','partial1Attempts','partial2Attempts','supportOpened','supportCompleted','attentionCueShown','correct_after_support','correct_after_retry','skip_count'])assert.ok(csv.includes(value),value);
  const restored=new Telemetry(t.storage);
  assert.equal(restored.session.summaries[0].partial2Outcome,'correct_after_retry');
});
