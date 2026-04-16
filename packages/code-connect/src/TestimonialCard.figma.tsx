import figma from "@figma/code-connect";
import { TestimonialCard } from "@ds/components";

/**
 * Testimonial Card — blockquote card with quote, author name, and role.
 */
figma.connect(
  TestimonialCard,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=7717:3946",
  {
    props: {
      children: figma.children("*"),
    },
    example: ({ children }) => (
      <TestimonialCard
        quote="This product changed our workflow completely."
        authorName="Jane Doe"
        authorDescription="CEO at Acme"
        avatarSrc="/avatar.jpg"
      />
    ),
  }
);
