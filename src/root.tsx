import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { useRouteLang } from "@/lib/routeLang";
import "@/styles/tokens.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const lang = useRouteLang();

  return (
    <html lang={lang} data-theme="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#080b10" />
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
