const fs = require('fs');
let content = fs.readFileSync('src/screens/CommunityListScreen.tsx', 'utf8');

if (!content.includes('import { apiService }')) {
    content = content.replace(
        "import { colors } from '../theme/colors';",
        "import { colors } from '../theme/colors';\nimport { apiService } from '../api/index';"
    );
}

const useEffectSnippet = `useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiPosts = await apiService.getCommunityPosts();
        if (apiPosts && Array.isArray(apiPosts)) {
          // Filter by category if API returns all
          const matched = apiPosts.filter(p => p.category === category || p.type === category);
          if (matched.length > 0) {
            setPosts(matched);
          }
        }
      } catch(e) {
        console.log('Failed to fetch community posts', e);
      }
    };
    fetchPosts();
  }, [category]);`;

content = content.replace(
    "const [searchQuery, setSearchQuery] = useState('');",
    "const [searchQuery, setSearchQuery] = useState('');\n  " + useEffectSnippet
);

fs.writeFileSync('src/screens/CommunityListScreen.tsx', content, 'utf8');
console.log('CommunityListScreen updated');
