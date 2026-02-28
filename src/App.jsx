import { useState } from "react";
import { BreakpointProvider, useBreakpoint } from "./context/BreakpointContext";
import { BottomNav } from "./components/BottomNav";
import { TopNav } from "./components/TopNav";
import { HomePage } from "./pages/HomePage";
import { DirectoryPage } from "./pages/DirectoryPage";
import { SubmitPage } from "./pages/SubmitPage";
import { useListings } from "./hooks/useListings";

function AppInner() {
  const [page, setPage] = useState("home");
  const { listings, addListing } = useListings();
  const { isDesktop } = useBreakpoint();

  const handleNavigate = (target) => setPage(target);

  return (
    <div style={isDesktop ? desktopRootStyle : mobileRootStyle}>
      {isDesktop && <TopNav page={page} onNavigate={handleNavigate} />}

      <main style={isDesktop ? desktopMainStyle : {}}>
        {page === "home" && (
          <HomePage listings={listings} onNavigate={handleNavigate} />
        )}
        {page === "directory" && (
          <DirectoryPage listings={listings} onNavigate={handleNavigate} />
        )}
        {page === "submit" && (
          <SubmitPage onNavigate={handleNavigate} onSubmit={addListing} />
        )}
      </main>

      {!isDesktop && <BottomNav page={page} onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <BreakpointProvider>
      <AppInner />
    </BreakpointProvider>
  );
}

const mobileRootStyle = {
  background: "#F3F4F6",
  minHeight: "100vh",
  maxWidth: 480,
  margin: "0 auto",
};

const desktopRootStyle = {
  background: "#F3F4F6",
  minHeight: "100vh",
};

const desktopMainStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 32px 48px",
};
