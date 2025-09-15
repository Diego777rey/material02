import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { BuscadorComponent } from './buscador/buscador.component';
import { TablaPaginadaComponent } from './tabla-paginada/tabla-paginada.component';
import { AccionesComponent } from './acciones/acciones.component';
import { FormularioGenericoComponent } from './formulario-generico/formulario-generico.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    BuscadorComponent,
    TablaPaginadaComponent,
    AccionesComponent,
    FormularioGenericoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
  exports: [
    BuscadorComponent,
    TablaPaginadaComponent,
    AccionesComponent,
    FormularioGenericoComponent
  ]
})
export class ReutilizacionModule { }