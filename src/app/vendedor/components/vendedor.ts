export class Vendedor {
  id?: number;
  nombre: string = '';
  apellido: string = '';
  documento: string = '';
  telefono: string = '';
  email: string = '';
  activo: boolean = true;
  fechaNacimiento: string = '';

  constructor(init?: Partial<Vendedor>) {
    Object.assign(this, init);
  }
}
