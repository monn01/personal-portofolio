import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "./site";

type BuildPageMetadataInput = {
  title: string;
  siteName: string;
  description: string;
  image?: string;
};

export function buildPageMetadata({
  title,
  siteName,
  description,
  image,
}: BuildPageMetadataInput): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      siteName,
      locale: "id_ID",
      type: "website",
      images: [image ?? DEFAULT_OG_IMAGE],
    },
  };
}
