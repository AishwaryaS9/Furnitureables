import { gql } from "graphql-request";

export const GET_CART = gql`
  query GetCart {
    cart {
      items {
        id
        title
        price
        image
        quantity
      }
    }
  }
`;

export const SAVE_CART = gql`
  mutation SaveCart($items: [CartItemInput!]!) {
    saveCart(items: $items)
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;