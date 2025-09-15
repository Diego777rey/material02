import { gql } from "apollo-angular";

export const GET_VENDEDORES = gql`
  query GetAllVendedores {
    findAllVendedores {
      id
      nombre
      apellido
      documento
      telefono
      email
      activo
      fechaNacimiento
    }
  }
`;
export const GET_VENDEDOR_BY_ID = gql`
  query GetVendedorById($id: ID!) {
    findVendedorById(VendedorId: $id) {
      id
      nombre
      apellido
      documento
      telefono
      email
      activo
      fechaNacimiento
    }
  }
`;

export const CREATE_VENDEDOR = gql`
  mutation CreateVendedor($input: InputVendedor!) {
    createVendedor(inputVendedor: $input) {
      id
      nombre
      apellido
      documento
      telefono
      email
      activo
      fechaNacimiento
    }
  }
`;
export const UPDATE_VENDEDOR = gql`
  mutation UpdateVendedor($id: ID!, $input: InputVendedor!) {
    updateVendedor(id: $id, inputVendedor: $input) {
      id
      nombre
      apellido
      documento
      telefono
      email
      activo
      fechaNacimiento
    }
  }
`;
export const DELETE_VENDEDOR = gql`
  mutation DeleteVendedor($id: ID!) {
    deleteVendedor(id: $id) {
      id
    }
  }
`;
export const GET_VENDEDORES_PAGINADOS = gql`
  query GetVendedoresPaginated($page: Int!, $size: Int!, $search: String) {
    findVendedoresPaginated(page: $page, size: $size, search: $search) {
      items {
         id
         nombre
         apellido
         documento
         telefono
         email
         activo
         fechaNacimiento
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;
