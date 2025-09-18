import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { UsuarioService } from '../../components/usuario.service';
import { InputUsuario } from '../../components/input.usuario';
import { AccionTabla } from 'src/app/reutilizacion/tabla-paginada/accion.tabla';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit, OnDestroy {
  usuarios: InputUsuario[] = [];
  totalRegistros = 0;
  tamanioPagina = 5;
  paginaActual = 0;
  textoBusqueda = '';
  cargando = false;

  // Subject para búsqueda en tiempo real
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  columnas: string[] = [
    'id', 'nombre', 'contrasenha', 'acciones'
  ];

  nombresColumnas: { [key: string]: string } = {
    id: 'Código',
    nombre: 'Nombre',
    contrasenha: 'Contraseña',
    acciones: 'Acciones'
  };

  constructor(
    private servicioUsuario: UsuarioService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.cargarUsuarios();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 🔹 Configurar suscripción de búsqueda en tiempo real
  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(
        debounceTime(300), // Esperar 300ms después de que el usuario deje de escribir
        distinctUntilChanged(), // Solo emitir si el valor cambió
        takeUntil(this.destroy$)
      )
      .subscribe(searchText => {
        this.textoBusqueda = searchText;
        this.paginaActual = 0;
        this.cargarUsuarios();
      });
  }

  // 🔹 Método para manejar cambios en el input de búsqueda
  onSearchChange(searchText: string): void {
    this.textoBusqueda = searchText;
    this.searchSubject.next(searchText);
  }

  // 🔹 Cargar usuarios con backend
  cargarUsuarios(): void {
    this.cargando = true;
    const paginaEnviar = this.paginaActual + 1;

    this.servicioUsuario.getPaginated(paginaEnviar, this.tamanioPagina, this.textoBusqueda)
      .subscribe({
        next: data => {
          const items = data?.items || [];
          this.totalRegistros = data?.totalItems || 0;

          if(items.length === 0 && this.totalRegistros > 0 && this.paginaActual > 0){
            this.paginaActual = 0;
            setTimeout(()=> this.cargarUsuarios(), 0);
            return;
          }

          this.usuarios = items;
          this.cargando = false;
        },
        error: err => {
          console.error('Error al cargar usuarios:', err);
          this.cargando = false;
        }
      });
  }

  cambiarPagina(evento: PageEvent){
    this.paginaActual = evento.pageIndex;
    this.tamanioPagina = evento.pageSize;
    this.cargarUsuarios();
  }

  // 🔹 Limpiar búsqueda
  limpiarBusqueda(){
    this.textoBusqueda = '';
    this.searchSubject.next(''); // Emitir cadena vacía para limpiar
  }

  agregarUsuario(){
    this.router.navigate(['dashboard/usuario/crear']);
  }

  editarUsuario(usuario: InputUsuario){
    if(!usuario.id) return;
    this.router.navigate(['dashboard/usuario/editar', usuario.id]);
  }

  // 🔹 Eliminar usuario
  eliminarUsuario(usuario: InputUsuario){
    if(!usuario.id) return;
    if(confirm(`¿Desea eliminar el usuario "${usuario.nombre}"?`)){
      this.servicioUsuario.delete(usuario.id).subscribe(()=> this.cargarUsuarios());
    }
  }

  // 🔹 Manejar acción de fila
  manejarAccion(evento: AccionTabla<InputUsuario>){
    switch(evento.tipo){
      case 'editar': this.editarUsuario(evento.fila); break;
      case 'eliminar': this.eliminarUsuario(evento.fila); break;
      case 'ver': break;
      case 'custom': break;
    }
  }

}
