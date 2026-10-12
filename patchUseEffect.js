const fs = require('fs');
let c = fs.readFileSync('src/screens/RegisteredTeamsScreen.tsx', 'utf8');
c = c.replace(
  "import React, { useContext, useState, useRef } from 'react';",
  "import React, { useContext, useState, useRef, useEffect } from 'react';"
);
fs.writeFileSync('src/screens/RegisteredTeamsScreen.tsx', c, 'utf8');
console.log('Fixed useEffect in RegisteredTeamsScreen');
