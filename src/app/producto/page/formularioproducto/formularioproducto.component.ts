import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../components/producto.service';
import { CategoriaService } from '../../../categoria/components/categoria.service';
import { InputProducto } from '../../components/input.producto';
import { Categoria } from '../../../categoria/components/categoria';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { CampoFormulario } from 'src/app/reutilizacion/formulario-generico/campo.formulario';

@Component({
  selector: 'app-formulario-producto',
  templateUrl: '../../../reutilizacion/formulario-generico/formulario-generico.component.html',
  styleUrls: ['./formularioproducto.component.scss']
})
export class ProductoFormComponent implements OnInit, OnDestroy {
  titulo = 'Producto';
  private destroy$ = new Subject<void>();

  formGroup: FormGroup;
  campos: CampoFormulario[] = [];
  isEdit = false;
  productoId: number | null = null;
  categorias: Categoria[] = [];
  loading = false;
  formEnabled = false; // controla habilitación de inputs

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {
    this.formGroup = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
    this.initCampos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initCampos(): void {
    this.campos = [
      { control: 'descripcion', label: 'Descripción', tipo: 'text', placeholder: 'Ingrese descripción', requerido: true },
      { control: 'precioCompra', label: 'Precio Compra', tipo: 'number', placeholder: '0.00', requerido: true },
      { control: 'precioVenta', label: 'Precio Venta', tipo: 'number', placeholder: '0.00', requerido: true },
      { control: 'stock', label: 'Stock', tipo: 'number', placeholder: '0', requerido: true },
      { control: 'categoriaId', label: 'Categoría', tipo: 'select', opciones: [], requerido: true },
      { control: 'activo', label: 'Activo', tipo: 'checkbox' }
    ];

    // Crear los FormControls
    this.campos.forEach(campo => {
      const validators = campo.requerido ? [Validators.required] : [];
      this.formGroup.addControl(campo.control, this.fb.control('', validators));
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productoId = Number(id);
      this.loadProduct(this.productoId);
      this.formEnabled = true; // si es edición, habilitamos el formulario
    }
  }

  loadCategories(): void {
    this.loading = true;
    this.categoriaService.getAll()
      .pipe(takeUntil(this.destroy$), catchError(() => of([])))
      .subscribe(data => {
        this.categorias = data || [];
        // Actualizar opciones del select
        const categoriaCampo = this.campos.find(c => c.control === 'categoriaId');
        if (categoriaCampo) {
          categoriaCampo.opciones = this.categorias.map(c => ({ value: c.id, label: c.descripcion }));
        }
        this.loading = false;
      });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productoService.getById(id)
      .pipe(takeUntil(this.destroy$), catchError(() => of(null)))
      .subscribe((data: InputProducto | null) => {
        if (data) {
          this.formGroup.patchValue({
            descripcion: data.descripcion,
            precioCompra: data.precioCompra,
            precioVenta: data.precioVenta,
            stock: data.stock,
            activo: data.activo,
            categoriaId: data.categoria?.id || ''
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
    this.router.navigate(['/producto']);
  }

  guardar(): void {
    if (this.formGroup.invalid) return;

    const formValue = this.formGroup.value;
    const categoriaSeleccionada = this.categorias.find(c => c.id === Number(formValue.categoriaId));
    if (!categoriaSeleccionada) return;

    const producto = new InputProducto({
      descripcion: formValue.descripcion,
      precioCompra: Number(formValue.precioCompra),
      precioVenta: Number(formValue.precioVenta),
      stock: Number(formValue.stock),
      activo: formValue.activo,
      categoria: categoriaSeleccionada
    });

    const obs$ = this.isEdit && this.productoId
      ? this.productoService.update(this.productoId, producto.toDto())
      : this.productoService.create(producto.toDto());

    this.loading = true;
    obs$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loading = false;
      this.formEnabled = false;
      this.router.navigate(['/producto']);
    });
  }
}
