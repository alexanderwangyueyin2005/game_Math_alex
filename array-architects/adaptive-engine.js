(function (root) {
  'use strict';

  const challenges = [
    { id: 'build-3-4', type: 'build', skill: 'equalGroups', total: 12, rows: 3, columns: 4, difficulty: 1 },
    { id: 'build-5-3', type: 'build', skill: 'equalGroups', total: 15, rows: 5, columns: 3, difficulty: 2 },
    { id: 'split-6-7', type: 'split', skill: 'decomposition', rows: 6, columns: 7, anchor: 5, difficulty: 3 },
    { id: 'split-7-6', type: 'split', skill: 'decomposition', rows: 7, columns: 6, anchor: 5, difficulty: 4 },
    { id: 'inverse-24-4', type: 'inverse', skill: 'inverseRelationship', rows: 4, columns: 6, total: 24, difficulty: 3 },
    { id: 'mixed-8-6', type: 'mixed', skill: 'decomposition', rows: 8, columns: 6, anchor: 5, difficulty: 5 },
  ];

  function createLearnerState() {
    return { productRecall: 0, equalGroups: 0, arrayConstruction: 0, decomposition: 0, inverseRelationship: 0, attempts: 0, hintUsage: 0 };
  }

  // This boundary can later be replaced by a recommendation service.
  // Time is deliberately absent from this policy and all mastery updates.
  function selectNextChallenge(learnerState, history) {
    const remaining = challenges.filter(c => !history.some(h => h.challengeId === c.id));
    if (!remaining.length) return null;
    if (!history.length) return { ...remaining[0], support: false, policy: 'start-with-equal-groups' };
    const last = history[history.length - 1];
    const sameSkillHistory = history.filter(h => h.skill === last.skill).slice(-2);
    const needsAnchor = last.highestScaffoldLevel >= 2 ||
      (sameSkillHistory.length === 2 && sameSkillHistory.every(h => !h.independentSuccess));
    const similar = remaining.filter(c => c.skill === last.skill);
    if ((last.hintCount > 0 || needsAnchor) && similar.length) {
      return { ...similar[0], support:true, policy:needsAnchor ? 'scaffold-same-skill-transfer' : 'practice-same-skill' };
    }
    const inverse = remaining.find(c => c.type === 'inverse');
    if (learnerState.equalGroups >= 2 && learnerState.inverseRelationship === 0 && inverse) {
      return { ...inverse, support:false, policy:'connect-multiplication-to-division' };
    }
    const fluent = history.length >= 2 && history.slice(-2).every(h => h.independentSuccess && h.hintCount === 0 && h.highestScaffoldLevel === 0);
    const lastDifficulty = challenges.find(c => c.id === last.challengeId)?.difficulty || 1;
    const next = fluent ? remaining.find(c => c.difficulty > lastDifficulty && c.difficulty <= lastDifficulty + 1) : null;
    return { ...(next || remaining[0]), support: needsAnchor, policy: next ? 'increase-complexity' : needsAnchor ? 'offer-anchor' : 'steady-practice' };
  }

  function recordCompletion(learnerState, result) {
    const next = { ...learnerState };
    const independent = result.independentSuccess && result.hintCount === 0 && result.highestScaffoldLevel === 0;
    const gain = independent ? 1 : result.highestScaffoldLevel >= 2 ? 0.2 : 0.5;
    if (result.finalSuccess) {
      next[result.skill] = (next[result.skill] || 0) + gain;
      if (result.skill === 'equalGroups') next.arrayConstruction += gain;
      if (result.skill === 'inverseRelationship') next.equalGroups += gain;
      // Only submitted subfacts give product-recall evidence. An auto-generated
      // final product is never credited as independently recalled multiplication.
      if (result.subfactAccuracy !== null && result.subfactAccuracy !== undefined) {
        next.productRecall += result.subfactAccuracy * (independent ? 1 : 0.25);
      }
    }
    next.attempts += result.attemptCount;
    next.hintUsage += result.hintCount;
    return next;
  }

  const api = { challenges, createLearnerState, selectNextChallenge, recordCompletion, evidenceStatus: 'pending' };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ArrayArchitectsEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
