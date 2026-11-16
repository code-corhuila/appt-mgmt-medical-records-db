const collectionDefinitions = [
  {
    name: 'estudios',
    required: ['usuarioId', 'titulo', 'fecha'],
    properties: {
      usuarioId: { bsonType: 'string' },
      titulo: { bsonType: 'string' },
      fecha: { bsonType: 'string' },
      tipo: { bsonType: 'string' },
      resultadoBreve: { bsonType: 'string' },
      urlDocumento: { bsonType: ['string', 'null'] },
      notas: { bsonType: 'string' },
      created_at: { bsonType: 'date' },
      updated_at: { bsonType: 'date' },
      deleted_at: { bsonType: ['date', 'null'] }
    }
  },
  {
    name: 'medicamentos',
    required: ['usuarioId', 'nombre', 'dosis', 'frecuencia', 'proximaToma'],
    properties: {
      usuarioId: { bsonType: 'string' },
      nombre: { bsonType: 'string' },
      dosis: { bsonType: 'string' },
      frecuencia: { bsonType: 'string' },
      proximaToma: { bsonType: 'string' },
      notas: { bsonType: 'string' },
      created_at: { bsonType: 'date' },
      updated_at: { bsonType: 'date' },
      deleted_at: { bsonType: ['date', 'null'] }
    }
  }
];

for (const definition of collectionDefinitions) {
  const options = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: definition.required,
        properties: definition.properties
      }
    },
    validationLevel: 'strict',
    validationAction: 'error'
  };
  const collectionExists = db.getCollectionInfos({ name: definition.name }).length > 0;

  if (collectionExists) {
    db.runCommand({ collMod: definition.name, ...options });
  } else {
    db.createCollection(definition.name, options);
  }

  db.getCollection(definition.name).createIndex(
    { usuarioId: 1, deleted_at: 1 },
    { name: `idx_${definition.name}_usuario_deleted` }
  );
}
