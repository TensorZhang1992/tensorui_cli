const fs = require('fs')

fs.copyFileSync('src/globals.css', 'dist/globals.css')

for (const f of ['dist/index.js', 'dist/lib/utils.js']) {
  let c = fs.readFileSync(f, 'utf8')
  c = c.replace(/^"use client";\n?/, '')
  fs.writeFileSync(f, c)
}

console.log('Post-build done: globals.css copied, "use client" removed from barrel/utils')
