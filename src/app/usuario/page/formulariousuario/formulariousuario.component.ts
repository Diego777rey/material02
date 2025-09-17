import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../components/usuario.service';
import { InputUsuario } from '../../components/input.usuario';
import { CampoFormulario } from 'src/app/reutilizacion/formulario-generico/campo.formulario';

@Component({
  selector: 'app-formulariousuario',
  templateUrl: './formulariousuario.component.html',
  styleUrls: ['./formulariousuario.component.scss']
})
export class FormulariousuarioComponent implements OnInit {
  titulo = 'Usuario';
  formGroup!: FormGroup;
  campos: CampoFormulario[] = [];
  isEdit = false;
  loading = false;
  formEnabled = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
    this.initCampos();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEdit = true;
        this.titulo = 'Editar Usuario';
        this.loadUsuario(id);
      } else {
        this.isEdit = false;
        this.titulo = 'Nuevo Usuario';
        this.formEnabled = false; // Inicialmente deshabilitado
      }
    });
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      contrasenha: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  private initCampos(): void {
    this.campos = [
      { control: 'nombre', label: 'Nombre', tipo: 'text', placeholder: 'Ingrese el nombre del usuario', requerido: true },
      { control: 'contrasenha', label: 'Contraseña', tipo: 'text', placeholder: 'Ingrese la contraseña', requerido: true }
    ];
  }

  private loadUsuario(id: string): void {
    this.loading = true;
    this.usuarioService.getById(+id).subscribe({
      next: (data) => {
        this.formGroup.patchValue(data);
        this.formEnabled = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.loading = false;
      }
    });
  }

  guardar(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.formGroup.value;
    const usuario = new InputUsuario(formValue);

    const request = this.isEdit
      ? this.usuarioService.update(this.route.snapshot.params['id'], usuario)
      : this.usuarioService.create(usuario);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['dashboard/usuario']);
      },
      error: (err) => {
        console.error('Error al guardar usuario:', err);
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.formGroup.reset();
    this.formEnabled = false;
    this.isEdit = false;
    this.titulo = 'Nuevo Usuario';
  }

  nuevo(): void {
    this.formGroup.reset();
    this.formEnabled = true;
    this.isEdit = false;
    this.titulo = 'Nuevo Usuario';
  }

  volver(): void {
    this.router.navigate(['dashboard/usuario']);
  }
}
