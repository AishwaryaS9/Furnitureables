import { gql } from "graphql-request";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      title
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: String!
    $input: UpdateProductInput!
  ) {
    updateProduct(id: $id, input: $input) {
      id
      title
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const SAVE_CART = gql`
  mutation SaveCart($items: [CartItemInput!]!) {
    saveCart(items: $items) {
      id
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: AddressInput!) {
    createAddress(input: $input) {
      id
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress(
    $id: String!
    $input: AddressInput!
  ) {
    updateAddress(
      id: $id
      input: $input
    ) {
      id
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: String!) {
    deleteAddress(id: $id)
  }
`;

export const SET_DEFAULT_ADDRESS = gql`
  mutation SetDefaultAddress($id: String!) {
    setDefaultAddress(id: $id) {
      id
      isDefault
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder(
    $input: PlaceOrderInput!
  ) {
    placeOrder(input: $input) {
      id
      orderNumber
      total
      status
      paymentStatus
      paymentMethod
      createdAt
    }
  }
`;