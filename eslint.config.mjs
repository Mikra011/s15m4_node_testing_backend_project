import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],  // Apply to all JavaScript files
    languageOptions: {
      sourceType: "commonjs",  // CommonJS modules
      ecmaVersion: "latest",  // Latest ECMAScript version
      globals: {
        ...globals.node,  // Include Node.js global variables
        ...globals.jest,      // Add Jest global variables for testing
      },
    },
    rules: {
      // Add any specific rules here
    },
  },
  pluginJs.configs.recommended,  // Extend from the recommended ESLint config
];
