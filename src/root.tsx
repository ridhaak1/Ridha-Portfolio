import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { useRouteLang } from "@/lib/routeLang";
import "@/styles/tokens.css";
import "@/styles/fonts.css";
import "@/styles/design-tokens.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "preload", href: "/fonts/Switzer-Variable.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/GeistMono-Variable.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/dm-sans-latin-400-normal.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const lang = useRouteLang();

  return (
    // suppressHydrationWarning: the hero's inline script sets data-hero before hydration
    <html lang={lang} data-theme="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0d0b09" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeContent: "center",
        gap: 16,
        padding: 24,
        background: "var(--stage-bg)",
        color: "var(--ink-white)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h1 style={{ fontSize: "clamp(2rem, 4.2vw, 5rem)", fontWeight: 700, letterSpacing: "-0.03em" }}>
        {notFound ? "Page not found." : "Something went wrong."}
      </h1>
      <a href="/" style={{ fontFamily: "var(--font-meta)", fontSize: "var(--text-meta)" }}>
        Back home <span aria-hidden="true">↗</span>
      </a>
    </main>
  );
}
