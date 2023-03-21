export const theme = {
	palette: {
		black: "#000000",
		primary: "#EA7000",
		primaryTint: "#EBA800",
		secondary: "#E8E8E8",
		secondaryTint: "#C4C4C4",
		textLight: "#575757",
		white: "#FFFFFF",
	},
} as const;

export type Theme = typeof theme;
