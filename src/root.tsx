import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { useRouteLang } from "@/lib/routeLang";
import "@/styles/tokens.css";
import "@/styles/fonts.css";
import "@/styles/design-tokens.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "preload", href: "/fonts/Switzer-Variable.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: "/fonts/GeistMono-Variable.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

// Fonts of the sections that haven't been redesigned yet. Injected from a script so the
// stylesheet doesn't block first paint (it used to be a chained @import in tokens.css).
const LEGACY_FONTS =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500;600&display=swap";
const LOAD_LEGACY_FONTS = `(function(){var l=document.createElement("link");l.rel="stylesheet";l.href=${JSON.stringify(LEGACY_FONTS)};document.head.appendChild(l)})()`;

export function Layout({ children }: { children: React.ReactNode }) {
  const lang = useRouteLang();

  return (
    // suppressHydrationWarning: the hero's inline script sets data-hero before hydration
    <html lang={lang} data-theme="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#080b10" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: LOAD_LEGACY_FONTS }} />
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
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 64, letterSpacing: 3, color: "var(--color-accent)" }}>
          {notFound ? "404" : "Error"}
        </h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 20 }}>
          {notFound ? "This page doesn't exist." : "Something went wrong."}
        </p>
        <a href="/" style={{ color: "var(--color-accent)" }}>← Back home</a>
      </div>
    </main>
  );
}
