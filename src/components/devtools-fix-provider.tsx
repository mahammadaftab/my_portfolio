"use client";

import { useEffect } from "react";
import { disableReactDevTools } from "@/lib/devtools-fix";

export default function DevToolsFixProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    disableReactDevTools();
  }, []);

  return <>{children}</>;
}