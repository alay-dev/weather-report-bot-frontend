"use client";
import { store } from "@/config/store";
import { AuthenticationProvider } from "@/context/oauth";
import { ReactNode } from "react";
import { Provider } from "react-redux";

const RootProvider = ({ children }: { children?: ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthenticationProvider>{children}</AuthenticationProvider>
    </Provider>
  );
};

export default RootProvider;
