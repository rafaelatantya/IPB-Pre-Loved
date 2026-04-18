import HeroSection from '@/modules/landing/components/HeroSection';
import LatestProducts from '@/modules/landing/components/LatestProducts';
import PopularCategories from '@/modules/landing/components/PopularCategories';
import FeaturesSection from '@/modules/landing/components/FeaturesSection';
import WhyUsSection from '@/modules/landing/components/WhyUsSection';
import CTASection from '@/modules/landing/components/CTASection';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Produk Terbaru */}
      <LatestProducts />

      {/* 3. Kategori Populer */}
      <PopularCategories />

      {/* 4. Fitur Singkat */}
      <FeaturesSection />

      {/* 5. Visi / Mengapa IPB Pre Loved */}
      <WhyUsSection />

      {/* 6. Call to Action Bawah */}
      <CTASection />
    </div>
  );
}
