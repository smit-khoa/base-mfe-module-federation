declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Declare module for SVG files
declare module "*.svg" {
  const content: string;
  export default content;
}

// Declare module for image files
declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

// Declare module for shared components
declare module "shared/common" {
  import { DefineComponent } from "vue";

  export const Dropdown: DefineComponent<{}, {}, any>;
  export const Table: DefineComponent<{}, {}, any>;
  export const Table2: DefineComponent<{}, {}, any>;
}
