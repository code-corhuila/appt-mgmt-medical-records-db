const demoUserId = 'demo-medical-records-user';

const demoRecords = [
  {
    collection: 'estudios',
    id: '665000000000000000000001',
    document: {
      usuarioId: demoUserId,
      titulo: 'Estudio de demostración',
      fecha: '2026-01-15',
      tipo: 'General',
      resultadoBreve: 'Dato ficticio para desarrollo.',
      urlDocumento: null,
      notas: '',
      created_at: new Date('2026-01-15T12:00:00Z'),
      updated_at: new Date('2026-01-15T12:00:00Z'),
      deleted_at: null
    }
  },
  {
    collection: 'medicamentos',
    id: '665000000000000000000002',
    document: {
      usuarioId: demoUserId,
      nombre: 'Medicamento de demostración',
      dosis: '1 unidad',
      frecuencia: 'Según indicación de prueba',
      proximaToma: '2026-01-15T20:00:00Z',
      notas: 'Registro ficticio para desarrollo.',
      created_at: new Date('2026-01-15T12:00:00Z'),
      updated_at: new Date('2026-01-15T12:00:00Z'),
      deleted_at: null
    }
  }
];

for (const record of demoRecords) {
  db.getCollection(record.collection).updateOne(
    { _id: ObjectId(record.id) },
    { $setOnInsert: { _id: ObjectId(record.id), ...record.document } },
    { upsert: true }
  );
}
