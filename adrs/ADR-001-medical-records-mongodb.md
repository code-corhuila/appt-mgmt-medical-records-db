# ADR-001: MongoDB for Medical Records

- Status: Accepted
- Context: Salud Activa represents studies and medications as flexible documents and already uses MongoDB 7.
- Decision: This bounded context manages only the `estudios` and `medicamentos` collections in its own database. Each document keeps `usuarioId` as an opaque reference to its owner; authentication and identity data are not duplicated here.
- Consequences: Migrations run with `mongosh`, validators protect required fields, and indexes start with `usuarioId`. Consumers must scope queries to the owner and use soft deletion through `deleted_at`.
