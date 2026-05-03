import WishlistView from "./WishlistView";
import { getWishlistItems } from "@/modules/wishlist/services";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const auth = await getAuth();
  const session = await auth();
  if (!session) return redirect("/login");

  const result = await getWishlistItems();
  
  return (
    <WishlistView initialItems={result.data || []} />
  );
}
