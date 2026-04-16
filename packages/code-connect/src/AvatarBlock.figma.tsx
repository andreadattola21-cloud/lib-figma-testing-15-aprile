import figma from "@figma/code-connect";

/**
 * Avatar Block — avatar with title and description text.
 */
figma.connect(
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=2010:15581",
  {
    props: {
      title: figma.string("Title"),
      description: figma.string("Description"),
      avatar: figma.children("Avatar"),
    },
    example: ({ title, description, avatar }) => (
      <div className="avatar-block">
        {avatar}
        <div>
          <strong>{title}</strong>
          <span>{description}</span>
        </div>
      </div>
    ),
  }
);
