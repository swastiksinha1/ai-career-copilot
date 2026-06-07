const fs = require('fs');

const width = 1440;
const height = 800;

// To create a mesh we draw horizontal curves and vertical curves
const lines = [];
const rows = 45;
const cols = 70;

for (let r = 0; r < rows; r++) {
  let path = '';
  for (let c = 0; c <= cols; c++) {
    // Math to create a cool 3D valley mesh
    // X goes from 0 to width
    const x = (c / cols) * width;
    
    // Normalized X from -1 to 1 (0 is center)
    const nx = (c / cols) * 2 - 1; 
    
    // Y base is an inverted parabola to make a "valley" in the center
    const valleyDepth = 350;
    const baseHeight = height - (100 + valleyDepth * Math.pow(Math.abs(nx), 2));
    
    // Perspective offset (rows further back go higher up)
    const zOffset = r * 15;
    
    // Noise/waves to make it look organic
    const wave = Math.sin(c * 0.4 + r * 0.2) * 30 * (r / rows);
    
    const y = baseHeight - zOffset + wave;
    
    if (c === 0) {
      path = `M ${x} ${y}`;
    } else {
      path += ` L ${x} ${y}`;
    }
  }
  lines.push(path);
}

// Vertical lines
for (let c = 0; c <= cols; c++) {
  let path = '';
  for (let r = 0; r < rows; r++) {
    const x = (c / cols) * width;
    const nx = (c / cols) * 2 - 1;
    const valleyDepth = 350;
    const baseHeight = height - (100 + valleyDepth * Math.pow(Math.abs(nx), 2));
    const zOffset = r * 15;
    const wave = Math.sin(c * 0.4 + r * 0.2) * 30 * (r / rows);
    const y = baseHeight - zOffset + wave;
    
    if (r === 0) {
      path = `M ${x} ${y}`;
    } else {
      path += ` L ${x} ${y}`;
    }
  }
  lines.push(path);
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMax slice">
  <defs>
    <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF00FF" />
      <stop offset="100%" stop-color="#00FFFF" />
    </linearGradient>
    <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000" stop-opacity="1" />
    </linearGradient>
  </defs>
  <g fill="none" stroke="url(#meshGradient)" stroke-width="1.5" opacity="0.7">
`;

for (const p of lines) {
  svg += `    <path d="${p}" />\n`;
}

svg += `  </g>
  <!-- Fade out bottom so it blends into background seamlessly -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#fadeGradient)" />
</svg>`;

fs.writeFileSync('c:/Users/swast/ai-career-copilot/public/hero-mesh.svg', svg);
console.log('SVG generated at public/hero-mesh.svg');
