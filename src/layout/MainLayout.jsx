import React, { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "@/shared/LendingShared/Navbar";
import PromotionalHeader from "@/shared/LendingShared/PromotionalHeader";
import Footer from "@/shared/LendingShared/Footer";
import { useDispatch } from "react-redux";
import { fetchCartAsync } from "@/Redux/cartSlice";

export default function MainLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("aevum_token");
    if (token) {
      dispatch(fetchCartAsync());
    }
  }, [dispatch]);

  return (
    <>
      <ScrollRestoration />
      <PromotionalHeader />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
