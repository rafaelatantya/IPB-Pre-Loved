export function generateWhatsAppLink(sellerName, sellerPhone, productTitle, productPrice) {
  const phone = sellerPhone?.replace(/\D/g, "") || "628123456789";
  
  const formattedPrice = productPrice?.toLocaleString("id-ID") || 0;
  const text = encodeURIComponent(
    `Halo ${sellerName || "Kak"}, saya tertarik dengan produk "${productTitle}" seharga Rp ${formattedPrice} yang Anda jual di IPB Pre-Loved. Apakah masih tersedia?`
  );
  
  return `https://wa.me/${phone}?text=${text}`;
}

export function openWhatsAppChat(sellerName, sellerPhone, productTitle, productPrice) {
  const link = generateWhatsAppLink(sellerName, sellerPhone, productTitle, productPrice);
  window.open(link, "_blank", "noopener,noreferrer");
}
