import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../../components/cliente.service';
import { Cliente } from '../../components/cliente';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { CampoFormulario } from 'src/app/reutilizacion/formulario-generico/campo.formulario';

@Component({
  selector: 'app-formulariocliente',
  templateUrl: '../../../reutilizacion/formulario-generico/formulario-generico.component.html',
  styleUrls: ['./formulariocliente.component.scss']
})
export class FormularioclienteComponent implements OnInit, OnDestroy {
  titulo = 'Cliente';
  private destroy$ = new Subject<void>();

  formGroup: FormGroup;
  campos: CampoFormulario[] = [];
  isEdit = false;
  clienteId: number | null = null;
  loading = false;
  formEnabled = false; // controla habilitación de inputs

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.fb.group({});
  }

  ngOnInit(): void {
    this.checkEditMode();
    this.initCampos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initCampos(): void {
    this.campos = [
      { control: 'nombre', label: 'Nombre', tipo: 'text', placeholder: 'Ingrese nombre', requerido: true },
      { control: 'apellido', label: 'Apellido', tipo: 'text', placeholder: 'Ingrese apellido', requerido: true },
      { control: 'documento', label: 'Documento', tipo: 'text', placeholder: 'Ingrese documento', requerido: true },
      { control: 'telefono', label: 'Teléfono', tipo: 'text', placeholder: 'Ingrese teléfono', requerido: true },
      { control: 'email', label: 'Email', tipo: 'text', placeholder: 'ejemplo@correo.com', requerido: true },
      { control: 'fechaRegistro', label: 'Fecha de Registro', tipo: 'text', placeholder: 'dd/mm/yyyy', requerido: true },
      { control: 'activo', label: 'Activo', tipo: 'checkbox' }
    ];

    // Crear los FormControls - habilitados si estamos en modo edición
    this.campos.forEach(campo => {
      const validators = campo.requerido ? [Validators.required] : [];
      if (campo.control === 'email') {
        validators.push(Validators.email);
      }
      const disabled = !this.isEdit; // Habilitar si estamos editando
      this.formGroup.addControl(campo.control, this.fb.control({value: '', disabled: disabled}, validators));
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clienteId = Number(id);
      this.loadCliente(this.clienteId);
      this.formEnabled = true; // si es edición, habilitamos el formulario
      this.formGroup.enable();
    }
  }

  loadCliente(id: number): void {
    this.loading = true;
    this.clienteService.getById(id)
      .pipe(takeUntil(this.destroy$), catchError(() => of(null)))
      .subscribe((data: Cliente | null) => {
        if (data) {
          this.formGroup.patchValue({
            nombre: data.nombre,
            apellido: data.apellido,
            documento: data.documento,
            telefono: data.telefono,
            email: data.email,
            fechaRegistro: data.fechaRegistro,
            activo: data.activo
          });
        }
        this.loading = false;
      });
  }

  // -------------------
  // Eventos botones
  // -------------------
  nuevo(): void {
    this.formGroup.reset({ activo: true });
    this.formEnabled = true;
    this.formGroup.enable();
  }

  cancelar(): void {
    this.formGroup.reset();
    this.formEnabled = false;
    this.formGroup.disable();
  }

  volver(): void {
    this.router.navigate(['dashboard/clientes']);
  }

  guardar(): void {
    if (this.formGroup.invalid) {
      console.error('Formulario inválido:', this.formGroup.errors);
      this.formGroup.markAllAsTouched();
      this.snackBar.open('Por favor, complete todos los campos obligatorios correctamente', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Validación básica de campos obligatorios
    const formValue = this.formGroup.value;
    if (!formValue.nombre || formValue.nombre.trim().length === 0) {
      this.snackBar.open('Error: El nombre es obligatorio', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!formValue.apellido || formValue.apellido.trim().length === 0) {
      this.snackBar.open('Error: El apellido es obligatorio', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (!formValue.email || formValue.email.trim().length === 0) {
      this.snackBar.open('Error: El email es obligatorio', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    try {
      const cliente: Cliente = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        documento: formValue.documento,
        telefono: formValue.telefono,
        email: formValue.email,
        fechaRegistro: formValue.fechaRegistro,
        activo: formValue.activo
      };

      const obs$ = this.isEdit && this.clienteId
        ? this.clienteService.updateCliente(this.clienteId, cliente)
        : this.clienteService.createCliente(cliente);

      this.loading = true;
      obs$.pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Error al guardar cliente:', error);
          this.loading = false;
          
          // Manejar errores específicos
          let mensajeError = 'Error al guardar el cliente';
          
          if (error.message && error.message.includes('llave duplicada')) {
            mensajeError = 'Ya existe un cliente con ese documento o email. Por favor, verifique los datos.';
          } else if (error.message && error.message.includes('constraint')) {
            mensajeError = 'Error de validación: Ya existe un cliente con esos datos.';
          } else if (error.message) {
            mensajeError = 'Error al guardar el cliente: ' + error.message;
          }
          
          this.snackBar.open(mensajeError, 'Cerrar', {
            duration: 7000,
            panelClass: ['error-snackbar']
          });
          return of(null);
        })
      ).subscribe((result) => {
        if (result) {
          // Cliente guardado exitosamente
          this.loading = false;
          this.formEnabled = false;
          this.formGroup.disable();
          this.snackBar.open('Cliente guardado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['dashboard/clientes']);
        }
      });
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      this.loading = false;
      this.snackBar.open('Error al crear el cliente: ' + (error as Error).message, 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
