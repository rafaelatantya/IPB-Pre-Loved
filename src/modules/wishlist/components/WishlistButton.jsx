"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

export default function WishlistButton({ productId, className = "", iconSize = 16, onToggle }) {
  const { status } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && productId) {
      fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId, action: "CHECK" }),
      }).then(res => res.json()).then(data => {
        if (data.success) {
          setIsWishlisted(data.wishlisted);
          if (onToggle) onToggle(data.wishlisted);
        }
      }).catch(() => {});
    }
  }, [productId, status, onToggle]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      alert("Silakan login terlebih dahulu!");
      return;
    }

    if (isPending || !productId) return;

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);
    setIsPending(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId, action: "TOGGLE" }),
      });
      const result = await res.json();
      if (result.success) {
        setIsWishlisted(result.wishlisted);
        if (onToggle) onToggle(result.wishlisted);
      } else {
        setIsWishlisted(previousState);
        alert("Gagal: " + (result.error || "Terjadi kesalahan"));
      }
    } catch (error) {
      setIsWishlisted(previousState);
      alert("Kesalahan Sistem: " + error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`transition-all active:scale-90 ${className} ${isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
    >
      <Heart 
        size={iconSize} 
        className={`${isWishlisted ? "fill-current" : ""} transition-transform duration-300`} 
      />
    </button>
  );
}
