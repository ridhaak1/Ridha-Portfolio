import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/MainLayout.tsx", [
    index("routes/home.tsx"),
    route("blog", "routes/blog.tsx"),
    route("blog/:slug", "routes/blog-post.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
