variable "project_id" {
  description = "ID del proyecto existente en MongoDB Atlas."
  type        = string
}

variable "database_name" {
  description = "Base de datos propietaria de los registros médicos."
  type        = string
  default     = "SaludActiva_medical_records"
}

variable "database_username" {
  description = "Usuario de aplicación con acceso solo a la base médica."
  type        = string
}

variable "database_password" {
  description = "Contraseña del usuario de aplicación."
  type        = string
  sensitive   = true
}

variable "allowed_ip_address" {
  description = "Dirección IPv4 del cliente autorizado, sin máscara CIDR."
  type        = string
}
