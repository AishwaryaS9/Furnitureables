export const typeDefs = /* GraphQL */ `
  ############################
  ## ENUMS
  ############################

  enum OrderStatus {
    PENDING
    CONFIRMED
    SHIPPED
    DELIVERED
    CANCELLED
  }

  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }

  enum PaymentMethod {
    COD
    STRIPE
    RAZORPAY
  }

  enum MediaType {
    IMAGE
    VIDEO
  }

  ############################
  ## PRODUCT
  ############################

  type ProductMedia {
    id: String!

    url: String!

    type: MediaType!

    sortOrder: Int!
  }

  type Product {
    id: String!

    title: String!
    description: String

    price: Float!
    stock: Int!

    media: [ProductMedia!]!

    type: String!
    material: String!
    color: String!
    room: String!
    dimensions: String!

    sku: String!

    createdAt: String!
    updatedAt: String!
  }

  ############################
  ## CART
  ############################

  type CartItem {
    id: String!

    quantity: Int!

    product: Product!
  }

  type Cart {
    id: String!

    items: [CartItem!]!
  }

  ############################
  ## ADDRESS
  ############################

  type Address {
    id: String!

    fullName: String!
    phone: String!

    addressLine1: String!
    addressLine2: String

    city: String!
    state: String!
    postalCode: String!
    country: String!

    isDefault: Boolean!

    createdAt: String!
    updatedAt: String!
  }

  ############################
  ## ORDER
  ############################

  type OrderItem {
    id: String!

    title: String!

    image: String

    sku: String!

    price: Float!

    quantity: Int!

    product: Product!
  }

  type Order {
    id: String!

    orderNumber: String!

    items: [OrderItem!]!

    subtotal: Float!
    shipping: Float!
    tax: Float!
    discount: Float!
    total: Float!

    currency: String!

    status: OrderStatus!

    paymentStatus: PaymentStatus!
    paymentMethod: PaymentMethod!

    stripePaymentIntentId: String
    razorpayOrderId: String
    razorpayPaymentId: String

    fullName: String!
    phone: String!

    addressLine1: String!
    addressLine2: String

    city: String!
    state: String!
    postalCode: String!
    country: String!

    couponCode: String
    notes: String

    createdAt: String!
    updatedAt: String!
  }

  ############################
  ## RESPONSE TYPES
  ############################

  type ProductsResponse {
    items: [Product!]!
    total: Int!
  }

  type UploadResult {
    inserted: Int!
    updated: Int!
    failed: Int!
  }

  ############################
  ## INPUTS
  ############################

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

  input ProductUploadInput {
    title: String!
    description: String

    price: Float!
    stock: Int!

    media: [ProductMediaInput!]

    type: String!
    material: String!
    color: String!
    room: String!
    dimensions: String!

    sku: String!
  }

  input ProductMediaInput {
    url: String!
    type: MediaType!
    sortOrder: Int
  }

input ProductInput {
  title: String!
  description: String

  price: Float!
  stock: Int!

  media: [ProductMediaInput!]

  type: String!
  material: String!
  color: String!
  room: String!
  dimensions: String!

  sku: String!
}

input UpdateProductInput {
  title: String
  description: String

  price: Float
  stock: Int

  media: [ProductMediaInput!]

  type: String
  material: String
  color: String
  room: String
  dimensions: String

  sku: String
}

  input CartItemInput {
    productId: String!
    quantity: Int!
  }

  ############################
  ## QUERIES
  ############################

  type Query {
    products(
      filter: ProductFilterInput
      page: Int
      limit: Int
      related: Boolean
    ): ProductsResponse!

    product(id: String!): Product

    adminProducts: [Product!]!

    cart: Cart

    addresses: [Address!]!

    orders: [Order!]!

    order(id: String!): Order
  }

  ############################
  ## MUTATIONS
  ############################

  type Mutation {
    saveCart(
      items: [CartItemInput!]!
    ): Cart!

    uploadProducts(
      products: [ProductUploadInput!]!
    ): UploadResult!

    createProduct(
      input: ProductInput!
    ): Product!

    updateProduct(
      id: String!
      input: UpdateProductInput!
    ): Product!

    deleteProduct(
      id: String!
    ): Boolean!
  }
`;