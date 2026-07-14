import { gql } from "graphql-request";

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput, $page: Int) {
    products(filter: $filter, page: $page) {
      total

      items {
        id
        title
        price
        type
        material
        createdAt

        media {
          id
          url
          type
          sortOrder
        }
      }
    }
  }
`;

export const ADMIN_PRODUCTS = gql`
  query AdminProducts {
    adminProducts {
      id
      title
      description
      price
      stock
      type
      material
      color
      room
      dimensions
      sku
      createdAt
      updatedAt

      media {
        id
        url
        type
        sortOrder
      }
    }
  }
`;

export const PRODUCT_BY_ID = gql`
  query Product($id: String!) {
    product(id: $id) {
      id
      title
      description
      price
      stock
      type
      material
      color
      room
      dimensions
      sku

      media {
        id
        url
        type
        sortOrder
      }
    }
  }
`;

export const RELATED_PRODUCTS = `
query ($filter: ProductFilterInput) {
  products(filter: $filter, related: true) {
     items {
      id
      title
      price
      createdAt
      material
      media {
        id
        url
        type
        sortOrder
      }
    }   
  }
}
`;

export const GET_CART = gql`
  query GetCart {
    cart {
      items {
        quantity
        product {
          id
          title
          price
          media {
            url
          }
        }
      }
    }
  }
`;