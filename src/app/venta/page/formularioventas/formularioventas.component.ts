import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../components/venta.service';
import { ClienteService } from 'src/app/cliente/components/cliente.service';
import { ProductoService } from 'src/app/producto/components/producto.service';
import { VendedorService } from 'src/app/vendedor/components/vendedor.service';

type Cliente = { id?: number; nombre: string; apellido: string };
type Vendedor = { id?: number; nombre: string; apellido: string };
type Producto = { id?: number; descripcion: string; precio: number };
type ProductoVenta = { productoId?: number; descripcion: string; cantidad: number; precio: number };

@Component({
  selector: 'app-formularioventas',
  templateUrl: './formularioventas.component.html',
  styleUrls: ['./formularioventas.component.scss']
})
export class FormularioventasComponent implements OnInit {

  ventaForm: FormGroup;
  esEdicion = false;
  ventaId: number | null = null;

  clientes: Cliente[] = [];
  vendedores: Vendedor[] = [];
  productos: Producto[] = [];
  productosAgregados: ProductoVenta[] = [];

  columnasProductos = ['producto', 'precio', 'cantidad', 'subtotal', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private vendedorService: VendedorService
  ) {
    this.ventaForm = this.fb.group({
      fecha: ['', Validators.required],
      tipoPago: ['', Validators.required],
      clienteId: [null, Validators.required],
      vendedorId: [null, Validators.required],
      productoId: [null],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.verificarEdicion();
  }

  private verificarEdicion(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        this.ventaId = +params['id'];
        this.cargarVentaParaEdicion();
      }
    });
  }

  private cargarDatos(): void {
    this.clienteService.getClientes().subscribe({
      next: data => this.clientes = data,
      error: err => console.error('Error cargando clientes', err)
    });

    this.vendedorService.getAll().subscribe({
      next: data => this.vendedores = data,
      error: err => console.error('Error cargando vendedores', err)
    });

    this.productoService.getAll().subscribe({
      next: (data: any[]) => {
        this.productos = data.map(p => ({
          id: p.id,
          descripcion: p.descripcion,
          precio: p.precioVenta || p.precio || 0
        }));
      },
      error: err => console.error('Error cargando productos', err)
    });
  }

  private cargarVentaParaEdicion(): void {
    if (this.ventaId) {
      this.ventaService.obtenerVentaPorId(this.ventaId).subscribe({
        next: venta => {
          this.ventaForm.patchValue({
            fecha: venta.fecha,
            tipoPago: venta.tipoPago,
            clienteId: venta.cliente?.id,
            vendedorId: venta.vendedor?.id
          });
          this.productosAgregados = venta.productos || [];
        },
        error: err => console.error('Error cargando venta', err)
      });
    }
  }

  agregarProducto(): void {
    const productoId = this.ventaForm.get('productoId')?.value;
    const cantidad = this.ventaForm.get('cantidad')?.value;

    if (productoId && cantidad > 0) {
      const producto = this.productos.find(p => p.id === productoId);
      if (producto) {
        // Verificar si el producto ya está agregado
        const productoExistente = this.productosAgregados.find(p => p.productoId === productoId);
        if (productoExistente) {
          productoExistente.cantidad += cantidad;
        } else {
          this.productosAgregados.push({
            productoId: producto.id,
            descripcion: producto.descripcion,
            cantidad: cantidad,
            precio: producto.precio
          });
        }
        
        // Limpiar el formulario de producto
        this.ventaForm.patchValue({ productoId: null, cantidad: 1 });
      }
    }
  }

  removerProducto(index: number): void {
    this.productosAgregados.splice(index, 1);
  }

  calcularTotal(): number {
    return this.productosAgregados.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }

  onSubmit(): void {
    if (this.ventaForm.valid && this.productosAgregados.length > 0) {
      const ventaData = {
        ...this.ventaForm.value,
        productos: this.productosAgregados,
        total: this.calcularTotal()
      };

      const request$ = this.esEdicion && this.ventaId
        ? this.ventaService.actualizarVenta(this.ventaId, ventaData)
        : this.ventaService.crearVenta(ventaData);

      request$.subscribe({
        next: () => {
          alert(`Venta ${this.esEdicion ? 'actualizada' : 'creada'} correctamente`);
          this.router.navigate(['/venta']);
        },
        error: err => {
          console.error('Error guardando venta', err);
          alert('Error al guardar la venta');
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/venta']);
  }
}
