const fs = require('fs');
let content = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf8');

content = content.split('{carouselImages.map((slide, index) => (').join('{(apiCarousel.length > 0 ? apiCarousel : dummyCarousel).map((slide, index) => (');
content = content.split('{carouselImages.map((_, i) => (').join('{(apiCarousel.length > 0 ? apiCarousel : dummyCarousel).map((_, i) => (');

fs.writeFileSync('src/screens/HomeScreen.tsx', content, 'utf8');

// Verify no more carouselImages references
if (content.includes('carouselImages')) {
  console.log('Still has carouselImages references!');
} else {
  console.log('Fixed! No more carouselImages references.');
}
