import React from "react";
import SellerProfileForm from "@/modules/user/components/SellerProfileForm";
import { getUserProfile } from "@/modules/user/actions";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function ProfilePage() {
    const res = await getUserProfile();
    const user = res.success ? res.data : null;

    return (
        <SellerProfileForm initialData={user} />
    );
}
