# Medical Records Database

Persistencia del dominio de registros médicos de Salud Activa. Este repositorio contiene únicamente las colecciones de estudios médicos y medicamentos; autenticación, turnos y chat son responsabilidad de otros dominios.

## Modelo de datos

MongoDB 7 almacena dos colecciones:

- `estudios`: `usuarioId`, `titulo`, `fecha`, `tipo`, `resultadoBreve`, `urlDocumento` y `notas`.
- `medicamentos`: `usuarioId`, `nombre`, `dosis`, `frecuencia`, `proximaToma` y `notas`.

Los nombres y tipos de los campos requeridos mantienen compatibilidad con los modelos de Salud Activa. `usuarioId` es una referencia opaca al usuario propietario; no se replica información de autenticación. Ambas colecciones aceptan `created_at`, `updated_at` y `deleted_at` para auditoría y borrado lógico.

## Desarrollo local

Requiere Docker Compose y Node.js 18 o posterior.

```sh
Copy-Item .env.example .env
npm test
npm run db:up
```

En un volumen nuevo, Compose ejecuta la migración y carga registros sintéticos de demostración. La base queda disponible solo en `127.0.0.1:27017`.

Para volver a aplicar la migración o la semilla:

```sh
npm run db:migrate
npm run db:seed
```

La migración es idempotente y la semilla usa identificadores fijos con `upsert`; ejecutarlas otra vez no duplica ni sobrescribe registros existentes. `npm run db:down` detiene MongoDB sin borrar el volumen. No uses `docker compose down -v` si necesitas conservar los datos.

## Atlas

`terraform/` administra un usuario con permisos `readWrite` sobre esta base y permite el acceso desde una sola IP. Requiere un proyecto y clúster Atlas existentes. Configura las credenciales del proveedor mediante `MONGODB_ATLAS_PUBLIC_KEY` y `MONGODB_ATLAS_PRIVATE_KEY`, copia `terraform/terraform.tfvars.example` a `terraform/terraform.tfvars` y reemplaza los valores de ejemplo antes de ejecutar Terraform. No subas secretos ni archivos de estado.
