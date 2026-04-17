/**
 * @ds/components — Design System Component Library
 *
 * Tree-shaking: import only what you need.
 *   import { Button } from "@ds/components"
 *
 * Do NOT use default exports or barrel-file re-exports at the
 * component level — import from the component's own entry point
 * in webpack configs to guarantee granular code splitting.
 */

// ─── Primitives ─────────────────────────────────────────────
export { Button } from "./primitives/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./primitives/Button";

export { TestimonialCard } from "./primitives/TestimonialCard";
export type { TestimonialCardProps } from "./primitives/TestimonialCard";

export { TextLinkList } from "./primitives/TextLinkList";
export type { TextLinkListProps } from "./primitives/TextLinkList";

export { TextLinkListItem } from "./primitives/TextLinkListItem";
export type { TextLinkListItemProps } from "./primitives/TextLinkListItem";

export { TextContentTitle } from "./primitives/TextContentTitle";
export type {
  TextContentTitleProps,
  TextContentTitleAlign,
} from "./primitives/TextContentTitle";

export { ButtonGroup } from "./primitives/ButtonGroup";
export type {
  ButtonGroupProps,
  ButtonGroupAlign,
} from "./primitives/ButtonGroup";

// ─── Layout ─────────────────────────────────────────────────
export { Flex } from "./layout/Flex";
export type {
  FlexProps,
  FlexDirection,
  FlexAlign,
  FlexJustify,
  FlexWrap,
} from "./layout/Flex";

// ─── Compositions ────────────────────────────────────────────
export { Footer } from "./compositions/Footer";
export type {
  FooterProps,
  FooterColumn,
  FooterLink,
  FooterSocialLink,
} from "./compositions/Footer";

export { CardGridTestimonials } from "./compositions/CardGridTestimonials";
export type {
  CardGridTestimonialsProps,
  TestimonialData,
} from "./compositions/CardGridTestimonials";

export { HeroActions } from "./compositions/HeroActions";
export type { HeroActionsProps } from "./compositions/HeroActions";

export { Header } from "./compositions/Header";
export type { HeaderProps, HeaderNavItem } from "./compositions/Header";
