import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "@/shared/LendingShared/Navbar";
import PromotionalHeader from "@/shared/LendingShared/PromotionalHeader";
import Footer from "@/shared/LendingShared/Footer";

export default function MainLayout() {
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

