import { gql } from "graphql-request";

export const GET_PRODUCTS = gql`
  query ($type: String, $material: String) {
    products(type: $type, material: $material) {
      id
      title
      price
      image
      type
      material
    }
  }
`;