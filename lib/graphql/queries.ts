import { gql } from "graphql-request";

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput, $page: Int) {
    products(filter: $filter, page: $page) {
      id
      title
      price
      image
      type
      material
    }
  }
`;