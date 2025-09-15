import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from './cliente';
import { CREATE_CLIENTE, DELETE_CLIENTE, GET_CLIENTES, UPDATE_CLIENTE, GET_CLIENTES_PAGINADOS, GET_CLIENTE_BY_ID } from 'src/app/graphql/graphql/cliente.graphql';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  constructor(private apollo: Apollo) {}

  getClientes(): Observable<Cliente[]> {
    return this.apollo.watchQuery<{ findAllClientes: Cliente[] }>({
      query: GET_CLIENTES
    }).valueChanges.pipe(
      map(result => result.data.findAllClientes)
    );
  }

  getById(id: number): Observable<Cliente> {
    return this.apollo.watchQuery<{ findClienteById: Cliente }>({
      query: GET_CLIENTE_BY_ID,
      variables: { id }
    }).valueChanges.pipe(
      map(result => result.data.findClienteById)
    );
  }

  createCliente(cliente: Cliente): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_CLIENTE,
      variables: { input: cliente }
    });
  }

  updateCliente(id: number, cliente: Cliente): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_CLIENTE,
      variables: { id, input: cliente }
    });
  }

  deleteCliente(id: number): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_CLIENTE,
      variables: { id }
    });
  }

  getPaginated(page: number, size: number, search: string = ''): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_CLIENTES_PAGINADOS,
      variables: { page, size, search },
      fetchPolicy: 'cache-and-network'
    }).valueChanges.pipe(
      map((result: any) => {
        return result.data?.findClientesPaginated || { items: [], totalItems: 0, totalPages: 0, currentPage: 0 };
      })
    );
  }
}
