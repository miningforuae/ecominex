// app/shop/[id]/page.tsx

import { Metadata } from "next";
import { productSeo } from "@/lib/seoMap";
import ProductDetails from "./ProductDetails";

// ✅ This generates meta tags on the server — works for SEO & crawlers
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const slug = params.id;
  const seo = productSeo[slug];

  return {
    title: seo?.title || "Mining Machine | Ecominex",
    description:
      seo?.description ||
      "Browse and buy crypto mining hardware on Ecominex with secure checkout and fast worldwide shipping.",
    openGraph: {
      title: seo?.title || "Mining Machine | Ecominex",
      description:
        seo?.description ||
        "Browse and buy crypto mining hardware on Ecominex.",
      url: `https://ecominex.net/shop/${slug}`,
      siteName: "Ecominex",
      type: "website",
    },
  };
}

// Server component just passes params to the client component
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetails params={params} />;
}