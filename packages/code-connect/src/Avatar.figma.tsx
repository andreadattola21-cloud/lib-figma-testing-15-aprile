import figma from "@figma/code-connect";

/**
 * Avatar — circular or square avatar with image or initials.
 */
figma.connect(
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=9762:1103",
  {
    props: {
      initials: figma.string("Initials"),
      type: figma.enum("Type", {
        Initial: "initial",
        Image: "image",
      }),
      size: figma.enum("Size", {
        Large: "lg",
        Medium: "md",
        Small: "sm",
      }),
      shape: figma.enum("Shape", {
        Circle: "circle",
        Square: "square",
      }),
    },
    example: ({ initials, size, shape }) => (
      <img
        src="/avatar.jpg"
        alt={initials}
        data-size={size}
        data-shape={shape}
        style={{ borderRadius: shape === "circle" ? "50%" : "8px" }}
      />
    ),
  }
);
