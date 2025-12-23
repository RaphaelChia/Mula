import type { SuiCodegenConfig } from '@mysten/codegen';
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const config: SuiCodegenConfig = {
	output: '__generated__',
	generateSummaries: true,
	prune: true,
	packages: [
		{
			package: '@local-pkg/poll',
			path: '../contract',
		},
	],
};

export default config;