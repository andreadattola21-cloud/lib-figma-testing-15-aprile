import { HeroActions, ButtonGroup, Button } from "@ds/components";
import styles from "../App.module.css";

export function HeroActionsShowcase() {
  return (
    <section className={styles["section"]}>
      <h2 className={styles["sectionTitle"]}>Hero Actions</h2>
      <p className={styles["sectionDescription"]}>
        Hero section composition with a centered title, subtitle, and action
        buttons. Composes TextContentTitle and ButtonGroup internally.
      </p>

      <div className={styles["showcase"]}>
        <div className={styles["showcaseLabel"]}>Default</div>
        <div style={{ padding: 0 }}>
          <HeroActions title="Title" subtitle="Subtitle">
            <ButtonGroup>
              <Button variant="secondary">Learn More</Button>
              <Button variant="primary">Get Started</Button>
            </ButtonGroup>
          </HeroActions>
        </div>
      </div>

      <div className={styles["showcase"]} style={{ marginTop: 24 }}>
        <div className={styles["showcaseLabel"]}>Without subtitle</div>
        <div style={{ padding: 0 }}>
          <HeroActions title="Welcome to the Platform">
            <ButtonGroup>
              <Button variant="secondary">Documentation</Button>
              <Button variant="primary">Sign Up Free</Button>
            </ButtonGroup>
          </HeroActions>
        </div>
      </div>

      <div className={styles["showcase"]} style={{ marginTop: 24 }}>
        <div className={styles["showcaseLabel"]}>Without actions</div>
        <div style={{ padding: 0 }}>
          <HeroActions
            title="Coming Soon"
            subtitle="We're working on something exciting"
          />
        </div>
      </div>
    </section>
  );
}
