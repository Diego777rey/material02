import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing.module';
import { CategoriaComponent } from './page/categoria/categoria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReutilizacionModule } from 'src/app/reutilizacion/reutilizacion.module';
//apartir de aca es de angular material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormulariocategoriaComponent } from './page/formulariocategoria/formulariocategoria.component';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    CategoriaComponent,
    FormulariocategoriaComponent
  ],
  imports: [
    CommonModule,
    CategoriaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ReutilizacionModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule
  ]
})
export class CategoriaModule { }
