import { Button } from "@ds/components";
import styles from "../App.module.css";

export function ButtonShowcase() {
  return (
    <section className={styles["section"]}>
      <h2 className={styles["sectionTitle"]}>Button</h2>
      <p className={styles["sectionDescription"]}>
        Primary interactive primitive. Available in four variants and three
        sizes, with support for leading/trailing icons and loading state.
      </p>

      <div className={styles["showcase"]}>
        <div className={styles["showcaseLabel"]}>Variants</div>
        <div className={styles["showcaseBody"]}>
          <div className={styles["variantGrid"]}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
      </div>

      <div className={styles["showcase"]} style={{ marginTop: 24 }}>
        <div className={styles["showcaseLabel"]}>Sizes</div>
        <div className={styles["showcaseBody"]}>
          <div className={styles["variantGrid"]}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </div>

      <div className={styles["showcase"]} style={{ marginTop: 24 }}>
        <div className={styles["showcaseLabel"]}>States</div>
        <div className={styles["showcaseBody"]}>
          <div className={styles["variantGrid"]}>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
            <Button fullWidth>Full Width</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
