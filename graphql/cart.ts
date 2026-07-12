import { gql } from "graphql-request";

export const GET_CART = gql`
  query GetCart {
    cart {
      id

      items {
        id
        quantity

        product {
          id
          title
          price

          media {
            id
            url
            type
            sortOrder
          }
        }
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