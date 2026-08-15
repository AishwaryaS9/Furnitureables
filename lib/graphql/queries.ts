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
        isWishlisted
        stock

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

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories($limit: Int) {
    productCategories(limit: $limit) {
      type
      count
    }
  }
`;

export const GET_PRODUCT_ROOMS = gql`
  query GetProductRooms($limit: Int) {
    productRooms(limit: $limit) {
      room
      count
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
      isWishlisted

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
      isWishlisted
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

      razorpayPaymentId

      coupon {
        code
      }

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

export const GET_WISHLIST = gql`
    query Wishlist {
        wishlist {
            id
            createdAt

            product {
                id
                title
                price
                stock

                media {
                    id
                    url
                }
            }
        }
    }
`;

export const GET_WISHLIST_COUNT = gql`
  query GetWishlistCount {
    wishlist {
      id
    }
  }
`;

export const ADMIN_DASHBOARD_STATS = gql`
  query AdminDashboardStats {
    adminDashboardStats {
      totalRevenue
      totalOrders
      totalProducts
      totalCustomers
    }
  }
`;

export const ADMIN_SALES_CHART = gql`
  query AdminSalesChart($months: Int) {
    adminSalesChart(months: $months) {
      date
      revenue
    }
  }
`;

export const ADMIN_LOW_STOCK_PRODUCTS = gql`
  query AdminLowStockProducts($threshold: Int, $limit: Int) {
    adminLowStockProducts(threshold: $threshold, limit: $limit) {
      id
      title
      sku
      stock
    }
  }
`;

export const ADMIN_RECENT_ORDERS = gql`
  query AdminRecentOrders($limit: Int) {
    adminRecentOrders(limit: $limit) {
      id
      orderNumber
      customerName
      createdAt
      total
      currency
      status
    }
  }
`;

export const ADMIN_ORDERS = gql`
  query AdminOrders {
    adminOrders {
      id
      orderNumber
      customerName
      customerEmail
      itemsCount
      total
      currency
      status
      paymentStatus
      paymentMethod
      createdAt
      items {
        id
        productName
        productImage
        quantity
        price
      }
    }
  }
`;

export const ADMIN_CUSTOMERS = gql`
  query AdminCustomers {
    adminCustomers {
      id
      name
      email
      joinedAt
      totalOrders
      totalSpent
      currency
      lastOrderAt
    }
  }
`;

export const ADMIN_CUSTOMER_DETAIL = gql`
  query AdminCustomer($id: String!) {
    adminCustomer(id: $id) {
      id
      name
      email
      joinedAt
      totalOrders
      totalSpent
      currency
      lastOrderAt
      addresses {
        id
        fullName
        phoneCode
        phone
        addressLine1
        addressLine2
        landmark
        city
        state
        postalCode
        country
        isDefault
      }
      orders {
        id
        orderNumber
        itemsCount
        total
        currency
        status
        paymentStatus
        createdAt
      }
    }
  }
`;

export const VALIDATE_COUPON = gql`
  query ValidateCoupon(
    $code: String!
    $subtotal: Float!
  ) {
    validateCoupon(
      code: $code
      subtotal: $subtotal
    ) {
      success
      message
      discount

      coupon {
        id
        code
        discountType
        discountValue
      }
    }
  }
`;