import figma from "@figma/code-connect";

/**
 * Navigation Pill — a single nav pill item inside the Header.
 */
figma.connect(
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=7768:19970",
  {
    props: {
      label: figma.string("Label"),
    },
    example: ({ label }) => (
      <a href="#">{label}</a>
    ),
  }
);
