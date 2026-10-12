
const fs = require("fs");
let content = fs.readFileSync("src/screens/MatchesScreen.tsx", "utf8");

content = content.replace(
  "setMyTournaments(globalTournaments);",
  "const uid = userProfile?.id || currentUserId;\n      setMyTournaments(globalTournaments.filter(t => String(t.user_id) === String(uid)));"
);
content = content.replace(
  "setMyTournaments(globalTournaments);",
  "const uid = userProfile?.id || currentUserId;\n    setMyTournaments(globalTournaments.filter(t => String(t.user_id) === String(uid)));"
);

fs.writeFileSync("src/screens/MatchesScreen.tsx", content, "utf8");
console.log("Filtered myTournaments");

