module.exports = {
	printWidth: 100,
	quoteProps: "consistent",
	semi: true,
	singleQuote: false,
	tabWidth: 4,
	trailingComma: "all",
	useTabs: true,
	overrides: [
		{
			files: "tsconfig*.json",
			options: {
				parser: "json5",
				tabWidth: 2,
				trailingComma: "all",
				quoteProps: "preserve",
			},
		},
		{
			files: "*.json",
			options: {
				tabWidth: 2,
				trailingComma: "all",
				quoteProps: "preserve",
			},
		},
	],
};
