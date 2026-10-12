
const fs = require("fs");
let content = fs.readFileSync("src/screens/MatchesScreen.tsx", "utf8");
content = content.replace(
  "const { userProfile, globalTournaments, fetchTournaments, registeredMatches, addTournament, addMatch } = useContext(AppContext);",
  "const { userProfile, currentUserId, globalTournaments, fetchTournaments, registeredMatches, addTournament, addMatch } = useContext(AppContext);"
);
fs.writeFileSync("src/screens/MatchesScreen.tsx", content, "utf8");
console.log("Fixed currentUserId crash");

