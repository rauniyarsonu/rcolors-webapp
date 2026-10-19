import { Outlet } from "react-router-dom";

// App already provides <main>; this only groups the About pages
export default function AboutLayout() {
  return (
    <div className="flex w-full flex-col">
      <Outlet />
    </div>
  );
}
