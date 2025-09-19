import { gql } from "apollo-angular";

export const GET_USUARIOS = gql`
  query GetAllUsuarios {
    findAllUsuarios {
      id
      nombre
      contrasenha
      email
      rol
    }
  }
`;

export const GET_USUARIO_BY_ID = gql`
  query GetUsuarioById($id: ID!) {
    findUsuarioById(id: $id) {
      id
      nombre
      contrasenha
      email
      rol
    }
  }
`;

export const CREATE_USUARIO = gql`
  mutation CreateUsuario($input: InputUsuario!) {
    createUsuario(inputUsuario: $input) {
      id
      nombre
      contrasenha
      email
      rol
    }
  }
`;

export const UPDATE_USUARIO = gql`
  mutation UpdateUsuario($id: ID!, $input: InputUsuario!) {
    updateUsuario(id: $id, inputUsuario: $input) {
      id
      nombre
      contrasenha
      email
      rol
    }
  }
`;

export const DELETE_USUARIO = gql`
  mutation DeleteUsuario($id: ID!) {
    deleteUsuario(id: $id) {
      id
    }
  }
`;

export const GET_USUARIOS_PAGINADOS = gql`
  query GetUsuariosPaginated($page: Int!, $size: Int!, $search: String) {
    findUsuariosPaginated(page: $page, size: $size, search: $search) {
      items {
        id
        nombre
        contrasenha
        email
        rol
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;


export const LOGIN_USUARIO = gql`
  mutation LoginUsuario($input: LoginInput!) {
    login(input: $input) {
      token
      usuario {
        id
        nombre
        contrasenha
        email
        rol
      }
    }
  }
`;




