import "../styles/globals.css";
import "../styles/github-dark.min.css";
import type { AppProps } from "next/app";
import React from "react";
import NavBar from "../src/components/NavBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-zinc-900 text-slate-300 text-lg">
      <NavBar />
      <div className="mx-auto p-6 py-16 max-w-3xl">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
export default MyApp;
