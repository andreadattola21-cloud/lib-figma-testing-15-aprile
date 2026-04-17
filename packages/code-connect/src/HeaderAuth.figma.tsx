import figma from "@figma/code-connect";
import { Button } from "@ds/components";

/**
 * Header Auth — sign-in and register button group in the Header.
 */
figma.connect(
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=18:9389",
  {
    example: () => (
      <>
        <Button variant="secondary" size="sm">
          Sign in
        </Button>
        <Button variant="primary" size="sm">
          Register
        </Button>
      </>
    ),
  }
);
