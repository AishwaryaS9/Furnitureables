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

    isWishlisted: Boolean!

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
    phoneCode: String!
    phone: String!
    addressLine1: String!
    addressLine2: String
    landmark: String

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

  scalar DateTime

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

    createdAt: DateTime!
    updatedAt: String!
  }

  ############################
  ## WHISHLIST
  ############################
 
  type Wishlist {
    id: String!
    createdAt: String!
    product: Product!
  }

  ############################
  ## RAZORPAY
  ############################

  type RazorpayOrder {
    orderId: String!
    razorpayOrderId: String!
    amount: Float!
    currency: String!
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

input AddressInput {
  fullName: String!

  phoneCode: String!
  phone: String!
  addressLine1: String!
  addressLine2: String
  landmark: String

  city: String!
  state: String!

  postalCode: String!
  country: String!

  isDefault: Boolean
}

input UpdateAddressInput {
  fullName: String
  phoneCode: String
  phone: String

  addressLine1: String
  addressLine2: String
  landmark: String
  city: String
  state: String

  postalCode: String
  country: String

  isDefault: Boolean
}

input PlaceOrderInput {
  addressId: String!
  paymentMethod: PaymentMethod!
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

    wishlist: [Wishlist!]!
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

    createAddress(
      input: AddressInput!
    ): Address!

    updateAddress(
      id: String!
      input: UpdateAddressInput!
    ): Address!

    deleteAddress(
      id: String!
    ): Boolean!

    setDefaultAddress(
      id: String!
    ): Address!

    placeOrder(input: PlaceOrderInput!): Order!

    cancelOrder(id: String!): Order!

    addToWishlist(productId: String!): Wishlist!

    removeFromWishlist(productId: String!): Boolean!

    createRazorpayOrder(
      input: PlaceOrderInput!
    ): RazorpayOrder!

    verifyRazorpayPayment(
      orderId: String!
      razorpayOrderId: String!
      razorpayPaymentId: String!
      razorpaySignature: String!
    ): Order!
  }
`;