const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyerEditScreen.tsx', 'utf8');

const replacement = `  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  useEffect(() => {
    if (typeof selectedTemplate.image === 'string') {
      Image.getSize(
        selectedTemplate.image,
        (width, height) => setImageAspectRatio(width / height),
        () => setImageAspectRatio(1)
      );
    } else {
      const source = Image.resolveAssetSource(selectedTemplate.image);
      if (source && source.width && source.height) {
        setImageAspectRatio(source.width / source.height);
      }
    }
  }, [selectedTemplate]);`;

content = content.replace(/const \[imageAspectRatio, setImageAspectRatio\] = useState\(1\);\s*useEffect\(\(\) => \{\s*if \(typeof selectedTemplate\.image === 'string'\) \{\s*Image\.getSize\(\s*selectedTemplate\.image,\s*\(width, height\) => setImageAspectRatio\(width \/ height\),\s*\(\) => setImageAspectRatio\(1\)\s*\);\s*\}\s*\}, \[selectedTemplate\]\);/g, replacement);

fs.writeFileSync('src/screens/TournamentFlyerEditScreen.tsx', content, 'utf8');
console.log('Aspect ratio fixed');
