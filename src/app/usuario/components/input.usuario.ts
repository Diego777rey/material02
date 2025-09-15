export class InputUsuario {
  id?: number;
  nombre: string = '';
  contrasenha: string = '';
  constructor(init?: Partial<InputUsuario>) {
    Object.assign(this, init);
  }
}
