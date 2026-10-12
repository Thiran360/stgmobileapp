import re

with open('src/screens/TournamentFlyersScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_block = '''        const genericFields = [
          { name: 'organiserName', label: 'Organiser Name', default: 'ORG NAME', y: '10%', x: 0, fontSize: 28, color: '#FFD700', fontWeight: 'bold' },
          { name: 'eventName', label: 'Event Name', default: 'TOURNAMENT NAME', y: '20%', x: 0, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' }
        ];
        const staticTemplates = [
          // COMING SOON
          { id: 'cs_1', category: 'Coming Soon', image: 'https://images.unsplash.com/photo-1616628188506-4b981bdcb0f5?q=80&w=1080&auto=format&fit=crop', fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'COMING SOON', y: '40%', x: 0, fontSize: 36, color: '#FF0000', fontWeight: 'bold' }] },
          { id: 'cs_2', category: 'Coming Soon', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1080&auto=format&fit=crop', fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'GET READY', y: '50%', x: 0, fontSize: 40, color: '#00FFFF', fontWeight: 'bold' }] },

          // ALL YOU NEED TO KNOW
          { id: 'ayntk_1', category: 'All You Need to Know', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1080&auto=format&fit=crop', fields: [...genericFields, { name: 'details', label: 'Details', default: 'INFO & RULES', y: '40%', x: 0, fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }] },
          { id: 'ayntk_2', category: 'All You Need to Know', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1080&auto=format&fit=crop', fields: [...genericFields, { name: 'details', label: 'Details', default: 'ALL DETAILS INSIDE', y: '45%', x: 0, fontSize: 22, color: '#FFFFFF', fontWeight: 'bold' }] },

          // PRIZE POOL
          { id: 'pp_1', category: 'Prize Pool', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1080&auto=format&fit=crop', fields: [...genericFields, { name: 'prizePool', label: 'Prize Pool', default: 'Prize: Rs.1,50,000', y: '30%', x: 0, fontSize: 24, color: '#FFD700', fontWeight: 'bold' }] },
          { id: 'pp_2', category: 'Prize Pool', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1080&auto=format&fit=crop', fields: [...genericFields, { name: 'prizePool', label: 'Prize Pool', default: 'MASSIVE PRIZE POOL', y: '40%', x: 0, fontSize: 28, color: '#FFFFFF', fontWeight: 'bold' }] },

          // PRIZE DISTRIBUTION
          { id: 'pd_1', category: 'Prize Distribution', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1080&auto=format&fit=crop', fields: genericFields },
          { id: 'pd_2', category: 'Prize Distribution', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1080&auto=format&fit=crop', fields: genericFields },

          // EVENT CALENDAR
          { id: 'ec_1', category: 'Event Calender', image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=1080&auto=format&fit=crop', fields: genericFields },
          { id: 'ec_2', category: 'Event Calender', image: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d?q=80&w=1080&auto=format&fit=crop', fields: genericFields },

          // EVENT ROAD MAP
          { id: 'erm_1', category: 'Event Road Map', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1080&auto=format&fit=crop', fields: genericFields },
          { id: 'erm_2', category: 'Event Road Map', image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1080&auto=format&fit=crop', fields: genericFields },

          // MAP SCHEDULE
          { id: 'ms_1', category: 'Map Schedule', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1080&auto=format&fit=crop', fields: genericFields },
          { id: 'ms_2', category: 'Map Schedule', image: 'https://images.unsplash.com/photo-1526778548025-fa2fbf8b1bb3?q=80&w=1080&auto=format&fit=crop', fields: genericFields },

          // LIVE CASTING
          { id: 'lc_1', category: 'Live Casting', image: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=1080&auto=format&fit=crop', fields: genericFields },
          { id: 'lc_2', category: 'Live Casting', image: 'https://images.unsplash.com/photo-1516280440502-a279bf2bc961?q=80&w=1080&auto=format&fit=crop', fields: genericFields },

          // CASTER REVEAL
          { id: 'cr_1', category: 'Caster Reveal', image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=1080&auto=format&fit=crop', fields: genericFields },
          { id: 'cr_2', category: 'Caster Reveal', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1080&auto=format&fit=crop', fields: genericFields },

          // TEAM PREVIEW
          { id: 'tp_1', category: 'Team Preview', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1080&auto=format&fit=crop', fields: genericFields },
          { id: 'tp_2', category: 'Team Preview', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1080&auto=format&fit=crop', fields: genericFields }
        ];'''

# Replace from 'const staticTemplates = [' to the next '];'
new_content = re.sub(r'const staticTemplates = \[\s*\{.*?\s*\];', new_block, content, flags=re.DOTALL)

with open('src/screens/TournamentFlyersScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Python replace done")
