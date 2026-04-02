import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { CartContext, useCartState } from "@/hooks/useCart";
import { OwnerAuthProvider } from "@/hooks/useOwnerAuth";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React, { useEffect } from "react";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import OwnerAccessListener from "./components/OwnerAccessListener";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Menu from "./pages/Menu";
import Offers from "./pages/Offers";
import Orders from "./pages/Orders";
import OwnerPanel from "./pages/OwnerPanel";

function AppLoginTracker() {
  const { actor } = useActor();

  useEffect(() => {
    if (!actor) return;
    const name = localStorage.getItem("ew_user_name");
    const phone = localStorage.getItem("ew_user_phone");
    const savedKey = `ew_login_saved_${phone}`;
    // Only save once per device per user (not on every page load)
    if (name && phone && !localStorage.getItem(savedKey)) {
      const deviceInfo = `${navigator.platform} / ${navigator.userAgent.split(" ").slice(-1)[0]}`;
      actor
        .saveAppLogin({ name, phone, deviceInfo, timestamp: BigInt(0) })
        .then(() => {
          localStorage.setItem(savedKey, "1");
        })
        .catch(() => {
          // silently ignore - non-critical
        });
    }
  }, [actor]);

  return null;
}

function RootLayout() {
  const cart = useCartState();
  const [loggedIn, setLoggedIn] = React.useState<boolean>(() => {
    return !!localStorage.getItem("ew_user_name");
  });

  const handleLogin = (name: string, phone: string) => {
    localStorage.setItem("ew_user_name", name);
    localStorage.setItem("ew_user_phone", phone);
    setLoggedIn(true);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <OwnerAuthProvider>
      <CartContext.Provider value={cart}>
        {/* Dark red 3D animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="dark-red-bg" />
          {/* Floating 3D orbs */}
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
          {/* Grid lines */}
          <div className="bg-grid" />
        </div>
        <div className="dark min-h-screen flex flex-col text-foreground relative">
          <AppLoginTracker />
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <ChatWidget />
          <OwnerAccessListener />
          <Toaster richColors position="top-right" />
        </div>
      </CartContext.Provider>
    </OwnerAuthProvider>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link to="/" className="text-primary hover:underline">
        Go Home
      </Link>
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: Menu,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});
const offersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/offers",
  component: Offers,
});
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: Orders,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});
const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner",
  component: OwnerPanel,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  menuRoute,
  offersRoute,
  ordersRoute,
  aboutRoute,
  contactRoute,
  ownerRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
