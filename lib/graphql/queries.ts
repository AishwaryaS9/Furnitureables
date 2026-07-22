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

export const GET_ADDRESSES = gql`
  query GetAddresses {
    addresses {
      id
      fullName
      phoneCode
      phone

      addressLine1
      addressLine2

      city
      state
      postalCode
      country

      isDefault

      createdAt
      updatedAt
    }
  }
`;

export const GET_ORDERS = gql`
  query Orders {
    orders {
      id
      orderNumber
      total
      currency
      status
      paymentStatus
      paymentMethod
      createdAt

      items {
        id
        title
        image
        quantity
        price
      }
    }
  }
`;

export const GET_ORDER = gql`
  query Order($id: String!) {
    order(id: $id) {
      id
      orderNumber
      subtotal
      shipping
      tax
      discount
      total
      currency
      status
      paymentStatus
      paymentMethod
      fullName
      phone
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      createdAt

      items {
        id
        title
        image
        sku
        quantity
        price
        product {
          id
        }
      }
    }
  }
`;