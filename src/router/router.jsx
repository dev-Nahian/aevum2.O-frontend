import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "@/pages/LandingPages/Home";
import LogIn from "@/pages/AuthPages/LogIn";
import Wishlist from "@/pages/LandingPages/Wishlist";
import Men from "@/pages/LandingPages/Men";
import ProductDetails from "@/pages/LandingPages/ProductDetails";
import SignUp from "@/pages/AuthPages/SignUp";
import VerificationOTP from "@/pages/AuthPages/VerificationOTP";
import NewPassword from "@/pages/AuthPages/NewPassword";
import Checkout from "@/pages/LandingPages/Checkout";
import Cart from "@/pages/LandingPages/Cart";
import Store from "@/pages/LandingPages/Store";
import ErrorPage from "@/pages/FallbackPages/ErrorPage";
import NewArrivals from "@/pages/LandingPages/NewArrivals";
import About from "@/pages/LandingPages/About";

const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LogIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "verification/otp",
        element: <VerificationOTP />,
      },
      {
        path: "new-password",
        element: <NewPassword />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "/category/:slug",
        element: <Men />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetails />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "store",
        element: <Store />,
      },
      {
        path: "category/new-arrivals",
        element: <NewArrivals />,
      }
    ],
  },
  // {
  //   path: "/dashboard",
  //   element: <DashboardLayout />,
  //   children: [
  //     {
  //       index: true,
  //       element: <Navigate to="overview" replace />,
  //     },
  //     {
  //       path: "overview",
  //       element: <Overview />,
  //     },
  //   ],
  // },
]);

export default router;
