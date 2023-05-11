import "styled-components";
import { type Theme } from "../src/view/theme";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
