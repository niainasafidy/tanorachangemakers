import { useState, useEffect } from "react";
import TanoraChangeMakers from "./components/TanoraChangeMakers";
import VolunteerRegister from "./components/VolunteerRegister";
import AllPhotos from "./components/AllPhotos";

export default function App() {
  const [page, setPage] = useState(
    () => localStorage.getItem("lastPage") || "home"
  );

  const navigate = (p) => {
    localStorage.setItem("lastPage", p);

    if (p === "home") {
      // Going back to home — just go back in history
      window.history.back();
    } else {
      // Going to a new page — push a real history entry
      window.history.pushState({ page: p }, "", window.location.href);
      setPage(p);
    }
  };

  useEffect(() => {
    // Push an initial entry so the first back press is catchable
    window.history.pushState({ page: "home" }, "", window.location.href);

    const handlePopState = (e) => {
      const prev = e.state?.page || "home";
      localStorage.setItem("lastPage", prev);
      setPage(prev);

      // Re-push so the back button stays "trapped" on home
      if (prev === "home") {
        window.history.pushState({ page: "home" }, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (page === "register")
    return <VolunteerRegister onClose={() => navigate("home")} />;
  if (page === "photos") return <AllPhotos onBack={() => navigate("home")} />;
  return (
    <TanoraChangeMakers
      onVolunteer={() => navigate("register")}
      onSeePhotos={() => navigate("photos")}
    />
  );
}
