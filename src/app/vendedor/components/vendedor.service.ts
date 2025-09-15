// src/app/services/vendedor.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Vendedor } from './vendedor';
import { map, Observable } from 'rxjs';
import { CREATE_VENDEDOR, DELETE_VENDEDOR, GET_VENDEDORES, UPDATE_VENDEDOR, GET_VENDEDORES_PAGINADOS, GET_VENDEDOR_BY_ID } from 'src/app/graphql/graphql/vendedor.graphql';
@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  constructor(private apollo: Apollo) {}

  getAll() {
    return this.apollo.watchQuery<{ findAllVendedores: Vendedor[] }>({
      query: GET_VENDEDORES
    }).valueChanges.pipe(map(result => result.data.findAllVendedores));//este es lo que devuelve el servicio graphql
  }

  getById(id: number) {
    return this.apollo.watchQuery<{ findVendedorById: Vendedor }>({
      query: GET_VENDEDOR_BY_ID,
      variables: { id }
    }).valueChanges.pipe(map(result => result.data.findVendedorById));
  }

  create(vendedor: Vendedor) {
    return this.apollo.mutate({
      mutation: CREATE_VENDEDOR,
      variables: { input: vendedor }
    });
  }

  update(id: number, vendedor: Vendedor) {
    return this.apollo.mutate({
      mutation: UPDATE_VENDEDOR,
      variables: { id, input: vendedor }
    });
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_VENDEDOR,
      variables: { id }
    });
  }

  getPaginated(page: number, size: number, search: string = ''): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_VENDEDORES_PAGINADOS,
      variables: { page, size, search },
      fetchPolicy: 'cache-and-network'
    }).valueChanges.pipe(
      map((result: any) => {
        return result.data?.findVendedoresPaginated || { items: [], totalItems: 0, totalPages: 0, currentPage: 0 };
      })
    );
  }
}
