// Node script which copies the contents of the `dist` directory to the specified Foundry VTT module directory.
// This script is intended to be run from the root of the project directory.

import * as fs from 'fs';
import * as path from 'path';
import module from '../src/module.json' assert { type: 'json' };
import localconfig from '../localconfig.json' assert { type: 'json' };
const MODULE_ID = module.id;
const FOUNDRY_PATH = localconfig.foundryModulesPath;
const DIST_PATH = path.resolve('dist');
const MODULE_PATH = path.join(FOUNDRY_PATH, MODULE_ID);

// Validate the config and paths
validate();
// Remove the existing module directory if it exists
if (fs.existsSync(MODULE_PATH)) {
  fs.rmSync(MODULE_PATH, { recursive: true });
}
// Copy the dist directory to the module directory
copyFolderSync(DIST_PATH, MODULE_PATH);
// Log the success message
console.log(`Copied contents of dist directory to ${MODULE_PATH}`);

// Function to validate config and paths
function validate() {
  // Ensure the foundry module path is defined
  if (!FOUNDRY_PATH) {
    console.error('Foundry module path not defined in localconfig.json');
    process.exit(1);
  }

  // Ensure the foundry module path exists
  if (!fs.existsSync(FOUNDRY_PATH)) {
    console.error(`Foundry module path does not exist: ${FOUNDRY_PATH}`);
    process.exit(1);
  }

  // Ensure the dist directory exists
  if (!fs.existsSync(DIST_PATH)) {
    console.error(`dist directory does not exist: ${DIST_PATH}`);
    process.exit(1);
  }
}

// Function to copy a folder and its contents recursively
function copyFolderSync(from, to) {
  fs.mkdirSync(to);
  fs.readdirSync(from).forEach((element) => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}
