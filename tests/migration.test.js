const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const migration = fs.readFileSync(
  path.join(__dirname, '..', 'migrations', '001_create_medical_records.js'),
  'utf8'
);

function runMigration(existingNames = []) {
  const existing = new Set(existingNames);
  const calls = { created: [], altered: [], indexes: [] };
  const db = {
    getCollectionInfos({ name }) {
      return existing.has(name) ? [{ name }] : [];
    },
    createCollection(name, options) {
      calls.created.push({ name, options });
      existing.add(name);
    },
    runCommand(command) {
      calls.altered.push(command);
    },
    getCollection(name) {
      return {
        createIndex(keys, options) {
          calls.indexes.push({ name, keys, options });
        }
      };
    }
  };

  vm.runInNewContext(migration, { db });
  return calls;
}

test('creates only the studies and medication collections with their required fields', () => {
  const calls = runMigration();

  assert.deepEqual(calls.created.map(({ name }) => name), ['estudios', 'medicamentos']);
  const requiredByCollection = Object.fromEntries(
    calls.created.map(({ name, options }) => [
      name,
      Array.from(options.validator.$jsonSchema.required)
    ])
  );
  assert.deepEqual(requiredByCollection, {
    estudios: ['usuarioId', 'titulo', 'fecha'],
    medicamentos: ['usuarioId', 'nombre', 'dosis', 'frecuencia', 'proximaToma']
  });
  assert.equal(calls.indexes.length, 2);
  assert.ok(calls.indexes.every(({ keys }) => keys.usuarioId === 1 && keys.deleted_at === 1));
});

test('updates existing collections and reapplies indexes instead of recreating them', () => {
  const calls = runMigration(['estudios', 'medicamentos']);

  assert.equal(calls.created.length, 0);
  assert.deepEqual(calls.altered.map(({ collMod }) => collMod), ['estudios', 'medicamentos']);
  assert.equal(calls.indexes.length, 2);
});
