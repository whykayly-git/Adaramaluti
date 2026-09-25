import { WishlistClient } from "@/components/wishlist/WishlistClient";
import { getAllProducts } from "@/data/products";

export default function WishlistPage() {
  return <WishlistClient products={getAllProducts()} />;
}
