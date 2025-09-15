import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendedorService } from '../../components/vendedor.service';
import { Vendedor } from '../../components/vendedor';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { CampoFormulario } from 'src/app/reutilizacion/formulario-generico/campo.formulario';

@Component({
  selector: 'app-formulariovendedor',
  templateUrl: '../../../reutilizacion/formulario-generico/formulario-generico.component.html',
  styleUrls: ['./formulariovendedor.component.scss']
})
export class FormulariovendedorComponent implements OnInit, OnDestroy {
  titulo = 'Vendedor';
  private destroy$ = new Subject<void>();

  formGroup: FormGroup;
  campos: CampoFormulario[] = [];
  isEdit = false;
  vendedorId: number | null = null;
  loading = false;
  formEnabled = false; // controla habilitación de inputs

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vendedorService: VendedorService
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
      { control: 'fechaNacimiento', label: 'Fecha de Nacimiento', tipo: 'text', placeholder: 'dd/mm/yyyy', requerido: true },
      { control: 'activo', label: 'Activo', tipo: 'checkbox' }
    ];

    // Crear los FormControls
    this.campos.forEach(campo => {
      const validators = campo.requerido ? [Validators.required] : [];
      if (campo.control === 'email') {
        validators.push(Validators.email);
      }
      this.formGroup.addControl(campo.control, this.fb.control('', validators));
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.vendedorId = Number(id);
      this.loadVendedor(this.vendedorId);
      this.formEnabled = true; // si es edición, habilitamos el formulario
    }
  }

  loadVendedor(id: number): void {
    this.loading = true;
    this.vendedorService.getById(id)
      .pipe(takeUntil(this.destroy$), catchError(() => of(null)))
      .subscribe((data: Vendedor | null) => {
        if (data) {
          this.formGroup.patchValue({
            nombre: data.nombre,
            apellido: data.apellido,
            documento: data.documento,
            telefono: data.telefono,
            email: data.email,
            fechaNacimiento: data.fechaNacimiento,
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
  }

  cancelar(): void {
    this.formGroup.reset();
    this.formEnabled = false;
  }

  volver(): void {
    this.router.navigate(['/vendedor']);
  }

  guardar(): void {
    if (this.formGroup.invalid) return;

    const formValue = this.formGroup.value;
    const vendedor = new Vendedor({
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      documento: formValue.documento,
      telefono: formValue.telefono,
      email: formValue.email,
      fechaNacimiento: formValue.fechaNacimiento,
      activo: formValue.activo
    });

    const obs$ = this.isEdit && this.vendedorId
      ? this.vendedorService.update(this.vendedorId, vendedor)
      : this.vendedorService.create(vendedor);

    this.loading = true;
    obs$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loading = false;
      this.formEnabled = false;
      this.router.navigate(['/vendedor']);
    });
  }
}
