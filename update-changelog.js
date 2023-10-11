const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const packagesDir = "packages"; // Update this to your package directory

// Run "lerna changed" to get a list of changed packages
const changedPackages = childProcess
  .execSync("lerna changed --json")
  .toString()
  .split("\n")
  .map((line) => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return null;
    }
  })
  .filter(Boolean)
  .map((change) => change.name);

// Extract folder names from package names
const folderNames = changedPackages.map((packageName) => {
  const packageDir = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packageDir, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    return packageJson.name;
  }

  return packageName;
});

// Update changelog-preset.config.js with the folderNames
const configPath = path.join(__dirname, "changelog-preset.config.js");
const configContent = fs.readFileSync(configPath, "utf8");
const updatedConfigContent = configContent.replace(
  /"folderNames":\s*\[.*\]/,
  `"folderNames": [${folderNames.map((name) => `"${name}"`).join(", ")}]`
);
fs.writeFileSync(configPath, updatedConfigContent, "utf8");
