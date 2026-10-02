import { OG_IMAGE, SITE_URL } from "@/data/site";

interface PageMeta {
  title: string;
  description: string;
  /** Path starting with "/", used for canonical and og:url. */
  path: string;
  /** Defaults to `description`. */
  socialDescription?: string;
  locale: "en_US" | "nl_BE";
  /** Path under /public or absolute URL; defaults to the site OG image. */
  image?: string;
  type?: "website" | "article";
  /** ISO date for articles */
  publishedTime?: string;
}

const absolute = (urlOrPath: string) => (urlOrPath.startsWith("http") ? urlOrPath : `${SITE_URL}${urlOrPath}`);

/** Full set of SEO, Open Graph and Twitter tags for a route's `meta` export. */
export function pageMeta({
  title,
  description,
  path,
  socialDescription = description,
  locale,
  image = OG_IMAGE,
  type = "website",
  publishedTime,
}: PageMeta) {
  const url = `${SITE_URL}${path}`;
  const imageUrl = absolute(image);

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },

    { property: "og:title", content: title },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:description", content: socialDescription },
    { property: "og:image", content: imageUrl },
    { property: "og:locale", content: locale },
    ...(publishedTime ? [{ property: "article:published_time", content: publishedTime }] : []),

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: socialDescription },
    { name: "twitter:image", content: imageUrl },
  ];
}
