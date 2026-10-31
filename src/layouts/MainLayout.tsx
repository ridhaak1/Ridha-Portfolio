import { Outlet, useLocation } from "react-router";
import Header from "@/components/header/Header";

export default function MainLayout() {
  // The home page hero brings its own top bar
  const isHome = useLocation().pathname === "/";

  return (
    <>
      {!isHome && <Header />}
      <main data-page={isHome ? "home" : undefined}>
        <Outlet />
      </main>
    </>
  );
}
