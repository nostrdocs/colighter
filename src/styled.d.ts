import "styled-components";
import { type Theme } from "./Highlight/View/Theme";

declare module "styled-components" {
	export interface DefaultTheme extends Theme {}
}
