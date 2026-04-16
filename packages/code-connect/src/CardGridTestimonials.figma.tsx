import figma from "@figma/code-connect";
import { CardGridTestimonials } from "@ds/components";

figma.connect(
  CardGridTestimonials,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=348:13347",
  {
    example: () => (
      <CardGridTestimonials
        heading="What our customers say"
        subheading="Trusted by thousands of teams worldwide"
        testimonials={[
          {
            quote: "\u201CThis tool transformed our design workflow.\u201D",
            authorName: "Jane Doe",
            authorDescription: "Head of Design, Acme",
            avatarSrc: "/avatars/jane.jpg",
            avatarAlt: "Jane Doe",
          },
          {
            quote: "\u201CIncredibly intuitive and powerful.\u201D",
            authorName: "John Smith",
            authorDescription: "CTO, Startup Co",
            avatarSrc: "/avatars/john.jpg",
            avatarAlt: "John Smith",
          },
          {
            quote: "\u201COur team collaboration improved overnight.\u201D",
            authorName: "Alice Johnson",
            authorDescription: "Product Manager",
            avatarSrc: "/avatars/alice.jpg",
            avatarAlt: "Alice Johnson",
          },
        ]}
      />
    ),
  }
);
