import { Outlet } from "react-router-dom";
import { manrope } from "@/lib/fonts";

export default function EstateLayout() {
  // App already provides <main>; this wrapper scopes the es tokens and font
  return (
    <div className={`es ${manrope.variable} text-es-body`}>
      <Outlet />
    </div>
  );
}
