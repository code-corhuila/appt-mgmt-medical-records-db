resource "mongodbatlas_project_ip_access_list" "medical_records" {
  project_id = var.project_id
  ip_address = var.allowed_ip_address
  comment    = "Acceso al dominio de registros médicos"
}

resource "mongodbatlas_database_user" "medical_records" {
  project_id         = var.project_id
  username           = var.database_username
  password           = var.database_password
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = var.database_name
  }
}
