const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const seed = fs.readFileSync(path.join(__dirname, '..', 'seed.js'), 'utf8');

test('upserts synthetic medical records without overwriting existing documents', () => {
  const calls = [];
  const db = {
    getCollection(collection) {
      return {
        updateOne(...args) {
          calls.push({ collection, args });
        }
      };
    }
  };
  const ObjectId = value => ({ value });

  vm.runInNewContext(seed, { db, ObjectId, Date });

  assert.deepEqual(calls.map(({ collection }) => collection), ['estudios', 'medicamentos']);
  for (const { args } of calls) {
    assert.equal(args[2].upsert, true);
    assert.ok(args[1].$setOnInsert);
    assert.equal(args[1].$set, undefined);
    assert.equal(args[1].$setOnInsert.usuarioId, 'demo-medical-records-user');
  }
});
