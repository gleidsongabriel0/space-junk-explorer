import fs from 'node:fs';
import path from 'node:path';

/**
 * Empacotador que combina os módulos ES de `vendor/` e `src/` em `dist/app.bundle.js`
 * preservando o escopo isolado de cada módulo para funcionar tanto em `http://localhost:8080`
 * quanto via `file://` (abrindo `index.html` diretamente).
 */

const root = 'c:/Users/gleid/Desktop/NASA-test';
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function wrapModule(relPath, exportedNames) {
  let code = read(relPath)
    .replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?/g, '')
    .replace(/import\s+[\s\S]*?from\s*['"][^'"]+['"];?/g, '')
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s+\{[\s\S]*?\};?/g, '');

  if (!exportedNames || exportedNames.length === 0) {
    return `\n// --- MODULE: ${relPath} ---\n(function() {\n${code}\n})();\n`;
  }
  const namesList = exportedNames.join(', ');
  return `\n// --- MODULE: ${relPath} ---\nconst { ${namesList} } = (function() {\n${code}\nreturn { ${namesList} };\n})();\n`;
}

// 1. Three.js
let threeCode = read('vendor/three.module.js');
const exportMatch = threeCode.match(/export\s*\{([\s\S]+?)\}\s*;?\s*$/);
if (!exportMatch) {
  throw new Error('Could not find export block in three.module.js');
}
const exportList = exportMatch[1]
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((item) => {
    const parts = item.split(/\s+as\s+/);
    if (parts.length === 2) {
      return `${parts[1].trim()}: ${parts[0].trim()}`;
    }
    return `${item}: ${item}`;
  })
  .join(',\n');

const threeBody = threeCode.slice(0, exportMatch.index);
const wrappedThree = `
const THREE = (function() {
${threeBody}
return {
${exportList}
};
})();
`;

// 2. OrbitControls
let orbitCode = read('vendor/OrbitControls.js');
orbitCode = orbitCode
  .replace(/import\s*\{[\s\S]*?\}\s*from\s*['"]three['"];?/, `
const {
  EventDispatcher,
  MOUSE,
  Quaternion,
  Spherical,
  TOUCH,
  Vector2,
  Vector3,
  Plane,
  Ray,
  MathUtils
} = THREE;
`)
  .replace(/export\s*\{[\s\S]*?\};?/, 'return { OrbitControls };');

const wrappedOrbit = `
const { OrbitControls } = (function() {
${orbitCode}
})();
`;

// 3. React & ReactDOM
let reactCode = read('vendor/react.esm.js');
reactCode = reactCode
  .replace(/export\s+default\s+React;?/, '')
  .replace(/export\s+const\s+\{[\s\S]*?\}\s*=\s*React;?/, 'return React;');
const wrappedReact = `
const React = (function() {
${reactCode}
})();
`;

let reactDomCode = read('vendor/react-dom.esm.js');
reactDomCode = reactDomCode
  .replace(/import\s+React\s+from\s+['"]\.\/react\.esm\.js['"];?/, '')
  .replace(/export\s+default\s+ReactDOM;?/, '')
  .replace(/export\s+const\s+\{[\s\S]*?\}\s*=\s*ReactDOM;?/, 'return ReactDOM;');
const wrappedReactDOM = `
const ReactDOM = (function() {
${reactDomCode}
})();
const { createRoot } = ReactDOM;
`;

// 4. htm
let htmCode = read('vendor/htm.module.js');
htmCode = htmCode.replace(/export\s+default\s+function/, 'return function');
const wrappedHtm = `
const htm = (function() {
${htmCode}
})();
const html = htm.bind(React.createElement);
`;

// 5. App modules in dependency order with isolated scopes
const modulesSpec = [
  ['src/data/solarSystem.js', ['SUN_DATA', 'PLANETS_DATA', 'OBJECT_CATEGORIES']],
  ['src/data/spaceObjects.js', ['SPACE_OBJECTS_DATA']],
  ['src/three/PlanetTextures.js', ['createGlowTexture', 'createSunTexture', 'createPlanetTextures', 'createSaturnRingTexture']],
  ['src/three/SpaceObjectModels.js', ['createSpaceObjectModel']],
  ['src/three/SolarSystemCanvas.js', ['SolarSystemCanvas']],
  ['src/components/ObjectSchematicCard.js', ['ObjectSchematicCard']],
  ['src/components/Header.js', ['Header']],
  ['src/components/LeftSidebar.js', ['LeftSidebar']],
  ['src/components/BottomCatalogPanel.js', ['BottomCatalogPanel']],
  ['src/components/HelpModal.js', ['HelpModal']],
  ['src/App.js', ['App']],
  ['src/main.js', []]
];

const appSegments = modulesSpec.map(([relPath, exports]) => wrapModule(relPath, exports));

const fullBundle = `(function() {
'use strict';
${wrappedThree}
${wrappedOrbit}
${wrappedReact}
${wrappedReactDOM}
${wrappedHtm}
${appSegments.join('\n')}
})();
`;

const outPath = path.join(root, 'dist', 'app.bundle.js');
fs.writeFileSync(outPath, fullBundle, 'utf8');
console.log('Bundle created at', outPath, 'Size:', fullBundle.length, 'bytes');
