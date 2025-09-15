import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendedorRoutingModule } from './vendedor-routing.module';
import { VendedorComponent } from './page/vendedor/vendedor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from "src/app/menu/menu.module";
import { ReutilizacionModule } from 'src/app/reutilizacion/reutilizacion.module';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormulariovendedorComponent } from './page/formulariovendedor/formulariovendedor.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [VendedorComponent, FormulariovendedorComponent],
  imports: [
    CommonModule,
    VendedorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    ReutilizacionModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule
]
})
export class VendedorModule { }
