const fs = require('fs');
let content = fs.readFileSync('src/screens/RegisteredTeamsScreen.tsx', 'utf8');

if (!content.includes('import { apiService }')) {
    content = content.replace(
        "import { AppContext } from '../context/AppContext';",
        "import { AppContext } from '../context/AppContext';\nimport { apiService } from '../api/index';"
    );
}

const useEffectSnippet = `const [apiTeams, setApiTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await apiService.getRegisteredTeams(tournamentId);
        if (teams && Array.isArray(teams)) {
          setApiTeams(teams);
        }
      } catch(e) {
        console.log('Failed to fetch teams', e);
      }
    };
    fetchTeams();
  }, [tournamentId]);`;

content = content.replace(
    "const [expandedGroup, setExpandedGroup] = useState<number>(0);",
    useEffectSnippet + "\n  const [expandedGroup, setExpandedGroup] = useState<number>(0);"
);

// We need to use apiTeams if available, else local context teams.
content = content.replace(
    "const tournamentTeams = teamRegistrations.filter(t => t.tournamentId === tournamentId);",
    "const tournamentTeams = apiTeams.length > 0 ? apiTeams : teamRegistrations.filter(t => t.tournamentId === tournamentId);"
);

fs.writeFileSync('src/screens/RegisteredTeamsScreen.tsx', content, 'utf8');
console.log('RegisteredTeamsScreen updated');
