import { useState } from "react";
import { ButtonShowcase } from "./pages/ButtonShowcase";
import { FooterShowcase } from "./pages/FooterShowcase";
import { TestimonialsShowcase } from "./pages/TestimonialsShowcase";
import { HeroActionsShowcase } from "./pages/HeroActionsShowcase";
import { HeaderShowcase } from "./pages/HeaderShowcase";
import { FullPage } from "./pages/FullPage";
import { HomePageShowcase } from "./pages/HomePageShowcase";
import styles from "./App.module.css";

type Page = "components" | "full-page" | "home-page";

export function App() {
  const [page, setPage] = useState<Page>("components");

  return (
    <div className={styles["app"]}>
      <header className={styles["shellHeader"]}>
        <h1 className={styles["shellTitle"]}>DS Preview</h1>
        <nav className={styles["nav"]}>
          <button
            className={`${styles["navButton"]} ${page === "components" ? styles["navButtonActive"] : ""}`}
            onClick={() => setPage("components")}
          >
            Components
          </button>
          <button
            className={`${styles["navButton"]} ${page === "full-page" ? styles["navButtonActive"] : ""}`}
            onClick={() => setPage("full-page")}
          >
            Full Page
          </button>
          <button
            className={`${styles["navButton"]} ${page === "home-page" ? styles["navButtonActive"] : ""}`}
            onClick={() => setPage("home-page")}
          >
            Home Page
          </button>
        </nav>
      </header>

      <main className={styles["content"]}>
        {page === "components" && (
          <>
            <ButtonShowcase />
            <HeaderShowcase />
            <HeroActionsShowcase />
            <TestimonialsShowcase />
            <FooterShowcase />
          </>
        )}
        {page === "full-page" && <FullPage />}
        {page === "home-page" && <HomePageShowcase />}
      </main>
    </div>
  );
}
