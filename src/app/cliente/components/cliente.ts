export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  email: string;
  activo: boolean;
  fechaRegistro: string;
}
