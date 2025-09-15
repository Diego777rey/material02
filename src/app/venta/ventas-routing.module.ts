import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './page/ventas/ventas.component';
import { FormularioventasComponent } from './page/formularioventas/formularioventas.component';

const routes: Routes = [
  { path: '', component: VentasComponent },
  { path: 'crear', component: FormularioventasComponent },
  { path: 'editar/:id', component: FormularioventasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
