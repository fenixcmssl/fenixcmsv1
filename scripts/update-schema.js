const fs = require('fs');
const path = './prisma/schema.prisma';
let schema = fs.readFileSync(path, 'utf8');
if (!schema.includes('price')) {
  schema = schema.replace(
    /model Application \{([^}]+)createdAt/,
    'model Application {$1price            Float    @default(0)\n  createdAt'
  );
  fs.writeFileSync(path, schema);
  console.log('Schema actualizado con price.');
} else {
  console.log('El campo price ya existe en el schema.');
}
