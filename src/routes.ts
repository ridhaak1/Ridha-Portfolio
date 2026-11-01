import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("layouts/MainLayout.tsx", [
    route("blog", "routes/blog.tsx"),
    route("blog/:slug", "routes/blog-post.tsx"),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
