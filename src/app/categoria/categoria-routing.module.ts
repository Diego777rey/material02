import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaComponent } from './page/categoria/categoria.component';
import { FormulariocategoriaComponent } from './page/formulariocategoria/formulariocategoria.component';

const routes: Routes = [
  { path: '', component: CategoriaComponent }, // lista de categorías
  { path: 'crear', component: FormulariocategoriaComponent }, // creación
  { path: 'editar/:id', component: FormulariocategoriaComponent } // edición
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaRoutingModule { }
