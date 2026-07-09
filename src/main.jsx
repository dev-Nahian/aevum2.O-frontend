import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
   <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Toaster position="top-center" reverseOrder={false} />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
      </QueryClientProvider>
  </StrictMode>
);
