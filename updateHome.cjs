const fs = require('fs');
let content = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf8');

if (!content.includes('import { apiService }')) {
    content = content.replace(
        "import { AppContext } from '../context/AppContext';",
        "import { AppContext } from '../context/AppContext';\nimport { apiService } from '../api/index';"
    );
}

const hookSnippet = `  const [apiCarousel, setApiCarousel] = useState<any[]>([]);
  useEffect(() => {
    apiService.getHomeData().then(data => {
      if (data && data.carousel) setApiCarousel(data.carousel);
    }).catch(e => console.log('API Home error', e));
  }, []);`;

content = content.replace(
    "const carouselImages = [",
    hookSnippet + "\n\n  const dummyCarousel = ["
);

content = content.replace(
    "const nextSlide = (currentSlide + 1) % carouselImages.length;",
    "const activeCarousel = apiCarousel.length > 0 ? apiCarousel : dummyCarousel;\n      const nextSlide = (currentSlide + 1) % activeCarousel.length;"
);

content = content.replace(
    "data={carouselImages}",
    "data={apiCarousel.length > 0 ? apiCarousel : dummyCarousel}"
);

// We must also replace the map inside the pagination dots
content = content.replace(
    "carouselImages.map((_, index) => (",
    "(apiCarousel.length > 0 ? apiCarousel : dummyCarousel).map((_, index) => ("
);

fs.writeFileSync('src/screens/HomeScreen.tsx', content, 'utf8');
console.log('HomeScreen updated');
