import "../styles/globals.css";
import "../styles/github-dark.min.css";
import type { AppProps } from "next/app";
import React from "react";
import NavBar from "../src/components/NavBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
      <NavBar />
      <Component {...pageProps} />
    </div>
  );
}
export default MyApp;
