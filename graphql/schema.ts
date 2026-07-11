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

  type CartItem {
    productId: String!
    quantity: Int!

    product: Product!
  }

  type Cart {
    id: String!
    items: [CartItem!]!
  }

  type ProductsResponse {
    items: [Product!]!
    total: Int!
  }

  # NEW
  type UploadResult {
    inserted: Int!
    updated: Int!
    failed: Int!
  }

  input ProductFilterInput {
    category: String
    room: String
    material: String
    minPrice: Float
    maxPrice: Float
    search: String
    sortBy: String
    excludeId: String
  }

  # NEW
  input ProductUploadInput {
    title: String!
    description: String
    price: Float!
    stock: Int!
    image: String
    type: String!
    material: String!
    color: String!
    room: String!
    dimensions: String!
    sku: String!
  }

  input CartItemInput {
    productId: String!
    quantity: Int!
  }

  type Query {
    products(
      filter: ProductFilterInput
      page: Int
      limit: Int
      related: Boolean
    ): ProductsResponse!

    product(id: String!): Product

    cart: Cart
  }

  type Mutation {
    saveCart(items: [CartItemInput!]!): Cart!

    # NEW
    uploadProducts(products: [ProductUploadInput!]!): UploadResult!
  }
`;