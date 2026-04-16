import { TestimonialCard, CardGridTestimonials } from "@ds/components";
import styles from "../App.module.css";

const sampleAvatar = "https://i.pravatar.cc/80?u=testimonial";

const testimonials = [
  {
    quote: "\u201CThis tool completely transformed our design workflow. We ship twice as fast now.\u201D",
    authorName: "Sarah Chen",
    authorDescription: "Head of Design, Acme Corp",
    avatarSrc: "https://i.pravatar.cc/80?u=sarah",
    avatarAlt: "Sarah Chen",
  },
  {
    quote: "\u201CIncredibly intuitive. Our entire team was onboarded in a single afternoon.\u201D",
    authorName: "Marcus Johnson",
    authorDescription: "CTO, Startup Co",
    avatarSrc: "https://i.pravatar.cc/80?u=marcus",
    avatarAlt: "Marcus Johnson",
  },
  {
    quote: "\u201CThe collaboration features are a game changer for distributed teams.\u201D",
    authorName: "Aiko Tanaka",
    authorDescription: "Product Manager, GlobalTech",
    avatarSrc: "https://i.pravatar.cc/80?u=aiko",
    avatarAlt: "Aiko Tanaka",
  },
  {
    quote: "\u201CI love how seamlessly it integrates with our existing tools.\u201D",
    authorName: "Elena Rodriguez",
    authorDescription: "Engineering Lead",
    avatarSrc: "https://i.pravatar.cc/80?u=elena",
    avatarAlt: "Elena Rodriguez",
  },
  {
    quote: "\u201CBest investment we made this year. The ROI is incredible.\u201D",
    authorName: "David Kim",
    authorDescription: "VP of Product, Fintech Inc",
    avatarSrc: "https://i.pravatar.cc/80?u=david",
    avatarAlt: "David Kim",
  },
  {
    quote: "\u201CFrom prototype to production in record time. Highly recommend.\u201D",
    authorName: "Priya Patel",
    authorDescription: "Design Director",
    avatarSrc: "https://i.pravatar.cc/80?u=priya",
    avatarAlt: "Priya Patel",
  },
];

export function TestimonialsShowcase() {
  return (
    <section className={styles["section"]}>
      <h2 className={styles["sectionTitle"]}>Testimonials</h2>
      <p className={styles["sectionDescription"]}>
        The TestimonialCard primitive and the CardGridTestimonials composition.
        Cards use <code>flex: 1 0 0</code> with <code>min-width: 300px</code>{" "}
        and <code>flex-wrap</code> for natural reflow.
      </p>

      {/* Single TestimonialCard */}
      <div className={styles["showcase"]}>
        <div className={styles["showcaseLabel"]}>TestimonialCard (primitive)</div>
        <div className={styles["showcaseBody"]}>
          <div style={{ maxWidth: 340 }}>
            <TestimonialCard
              quote={"\u201CAbsolutely love this product!\u201D"}
              authorName="Jane Doe"
              authorDescription="CEO at Acme"
              avatarSrc={sampleAvatar}
              avatarAlt="Jane Doe"
            />
          </div>
        </div>
      </div>

      {/* Full CardGridTestimonials */}
      <div className={styles["showcase"]} style={{ marginTop: 24 }}>
        <div className={styles["showcaseLabel"]}>CardGridTestimonials (composition)</div>
        <div style={{ padding: 0 }}>
          <CardGridTestimonials
            heading="What our customers say"
            subheading="Trusted by thousands of teams worldwide"
            testimonials={testimonials}
          />
        </div>
      </div>
    </section>
  );
}
