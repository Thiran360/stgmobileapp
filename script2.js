const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

const newBlock = `
        const genericFields = [
          { name: 'organiserName', label: 'Organiser Name', default: 'ORG NAME', y: '10%', x: 0, fontSize: 28, color: '#FFD700', fontWeight: 'bold' },
          { name: 'eventName', label: 'Event Name', default: 'TOURNAMENT NAME', y: '20%', x: 0, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' }
        ];
        const staticTemplates = [
          // COMING SOON
          { id: 'cs_1', category: 'Coming Soon', image: require('../assets/images/flyers/bgmi_1.jpg'), fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'COMING SOON', y: '40%', x: 0, fontSize: 36, color: '#FF0000', fontWeight: 'bold' }] },
          { id: 'cs_2', category: 'Coming Soon', image: require('../assets/images/flyers/bgmi_2.jpg'), fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'GET READY', y: '50%', x: 0, fontSize: 40, color: '#00FFFF', fontWeight: 'bold' }] },

          // ALL YOU NEED TO KNOW
          { id: 'ayntk_1', category: 'All You Need to Know', image: require('../assets/images/flyers/bgmi_3.jpg'), fields: [...genericFields, { name: 'details', label: 'Details', default: 'INFO & RULES', y: '40%', x: 0, fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }] },
          { id: 'ayntk_2', category: 'All You Need to Know', image: require('../assets/images/flyers/bgmi_4.jpg'), fields: [...genericFields, { name: 'details', label: 'Details', default: 'ALL DETAILS INSIDE', y: '45%', x: 0, fontSize: 22, color: '#FFFFFF', fontWeight: 'bold' }] },

          // PRIZE POOL
          { id: 'pp_1', category: 'Prize Pool', image: require('../assets/images/flyers/bgmi_5.jpg'), fields: [...genericFields, { name: 'prizePool', label: 'Prize Pool', default: 'Prize: Rs.1,50,000', y: '30%', x: 0, fontSize: 24, color: '#FFD700', fontWeight: 'bold' }] },
          { id: 'pp_2', category: 'Prize Pool', image: require('../assets/images/flyers/bgmi_1.jpg'), fields: [...genericFields, { name: 'prizePool', label: 'Prize Pool', default: 'MASSIVE PRIZE POOL', y: '40%', x: 0, fontSize: 28, color: '#FFFFFF', fontWeight: 'bold' }] },

          // PRIZE DISTRIBUTION
          { id: 'pd_1', category: 'Prize Distribution', image: require('../assets/images/flyers/bgmi_2.jpg'), fields: genericFields },
          { id: 'pd_2', category: 'Prize Distribution', image: require('../assets/images/flyers/bgmi_3.jpg'), fields: genericFields },

          // EVENT CALENDAR
          { id: 'ec_1', category: 'Event Calender', image: require('../assets/images/flyers/bgmi_4.jpg'), fields: genericFields },
          { id: 'ec_2', category: 'Event Calender', image: require('../assets/images/flyers/bgmi_5.jpg'), fields: genericFields },

          // EVENT ROAD MAP
          { id: 'erm_1', category: 'Event Road Map', image: require('../assets/images/flyers/bgmi_1.jpg'), fields: genericFields },
          { id: 'erm_2', category: 'Event Road Map', image: require('../assets/images/flyers/bgmi_2.jpg'), fields: genericFields },

          // MAP SCHEDULE
          { id: 'ms_1', category: 'Map Schedule', image: require('../assets/images/flyers/bgmi_3.jpg'), fields: genericFields },
          { id: 'ms_2', category: 'Map Schedule', image: require('../assets/images/flyers/bgmi_4.jpg'), fields: genericFields },

          // LIVE CASTING
          { id: 'lc_1', category: 'Live Casting', image: require('../assets/images/flyers/bgmi_5.jpg'), fields: genericFields },
          { id: 'lc_2', category: 'Live Casting', image: require('../assets/images/flyers/bgmi_1.jpg'), fields: genericFields },

          // CASTER REVEAL
          { id: 'cr_1', category: 'Caster Reveal', image: require('../assets/images/flyers/bgmi_2.jpg'), fields: genericFields },
          { id: 'cr_2', category: 'Caster Reveal', image: require('../assets/images/flyers/bgmi_3.jpg'), fields: genericFields },

          // TEAM PREVIEW
          { id: 'tp_1', category: 'Team Preview', image: require('../assets/images/flyers/bgmi_4.jpg'), fields: genericFields },
          { id: 'tp_2', category: 'Team Preview', image: require('../assets/images/flyers/bgmi_5.jpg'), fields: genericFields }
        ];
`.replace(/^\s*[\r\n]/gm, '');

content = content.replace(/const staticTemplates = \[\s*\{[\s\S]*?\];/m, newBlock.trim());
fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
console.log('Node replace done');
