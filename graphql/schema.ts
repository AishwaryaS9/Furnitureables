export const typeDefs = /* GraphQL */ `
  type Product {
    id: String!
    title: String!
    description: String
    price: Float!
    image: String

    type: String
    material: String

    color: String
    room: String
    dimensions: String
    stock: Int

    createdAt: String!
  }

  type ProductsResponse {
    items: [Product!]!
    total: Int!
  }

  input ProductFilterInput {
    type: String
    material: String
    minPrice: Float
    maxPrice: Float
    search: String
    excludeId: String
  }

  type Query {
    products(
      filter: ProductFilterInput
      page: Int
      limit: Int
      related: Boolean
    ): ProductsResponse!

    product(id: String!): Product
  }
`;