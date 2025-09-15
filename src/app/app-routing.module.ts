import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/page/menu/menu.component';

const routes: Routes = [
  {
    path: 'login',  loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuComponent, // menú lateral y toolbar
    children: [
      { path: 'clientes', loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule) },
      { path: 'usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule) },
      { path: 'categoria', loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule) },
      { path: 'vendedor', loadChildren: () => import('./vendedor/vendedor.module').then(m => m.VendedorModule) },
      { path: 'producto', loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule) },
      { path: 'ventas', loadChildren: () => import('./venta/ventas.module').then(m => m.VentasModule) },
      { path: 'bienvenido', loadChildren: () => import('./bienvenido/bienvenido.module').then(m => m.BienvenidoModule) },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }