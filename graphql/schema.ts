import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    price: Float!
    image: String
    category: String
    material: String
    color: String
    room: String
  }

  input ProductFilterInput {
    category: String
    material: String
    color: String
    room: String
    minPrice: Float
    maxPrice: Float
  }

  type Query {
    products(filter: ProductFilterInput): [Product!]!
    product(id: ID!): Product
  }
`;