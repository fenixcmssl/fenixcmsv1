const fs = require('fs');
const files = [
  '/var/www/fenixcms/src/app/[domain]/admin/page.tsx',
  '/var/www/fenixcms/src/app/[domain]/admin/products/page.tsx',
  '/var/www/fenixcms/src/app/[domain]/admin/products/new/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Eliminar el bloque <aside> antiguo
    content = content.replace(/<aside[\s\S]*?<\/aside>/, '');
    // Quitar el contenedor flex global, ya que ahora lo provee el Layout
    content = content.replace(/<div className="min-h-screen bg-gray-50 flex">/, '<div className="w-full flex flex-col">');
    fs.writeFileSync(file, content);
    console.log('Refactorizado exitosamente: ' + file);
  }
});
