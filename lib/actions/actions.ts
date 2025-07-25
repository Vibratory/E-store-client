export const getCollections = async () => {
  const collections = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`)
  return await collections.json()
}

export const getCollectionss = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`);
    if (!res.ok) throw new Error("Failed to fetch collections");
    return await res.json();
  } catch (err) {
    console.error("getCollections error:", err);
    return [];
  }
};

export const getCollectionDetails = async (collectionId: string) => {
  const collection = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}`)
  return await collection.json()
}

export const getProducts = async () => {
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return await products.json()
}

export const getProductDetails = async (productId: string) => {
  const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
  return await product.json()
}

export const getSearchedProducts = async (query: string) => {
  const searchedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/${query}`)
  return await searchedProducts.json()
}

export const getOrders = async (customerId: string) => {
  const orders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`)
  return await orders.json()
}

export const getRelatedProducts = async (productId: string) => {
  const relatedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`)
  return await relatedProducts.json()
}

// function to Format as DA in the DZ local currency
export const formatDZD = (price: number) => {
  return new Intl.NumberFormat('FR-DZ', {
    style: 'currency',
    currency: 'DZD',
  }).format(price);
};

export const availability = (stock: number): boolean => {
  return stock > 0;
};
