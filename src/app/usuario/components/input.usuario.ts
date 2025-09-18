export class InputUsuario {
  id?: number;
  nombre: string = '';
  contrasenha: string = '';
  email: string = '';
  rol: string = '';
  constructor(init?: Partial<InputUsuario>) {
    Object.assign(this, init);
  }
}
