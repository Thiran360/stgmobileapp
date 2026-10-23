export const FLYER_IMAGES = {
  img1: require('../assets/images/flyers/1.png'),
  img2: require('../assets/images/flyers/2.png'),
  img3: require('../assets/images/flyers/3.png'),
  bgmi1: require('../assets/images/flyers/custom_bgmi_1.jpg'),
  bgmi2: require('../assets/images/flyers/custom_bgmi_2.jpg'),
  slotlist: require('../assets/images/flyers/slotlist_template.png'),
  banner1: require('../assets/images/banner1.jpg'),
  banner2: require('../assets/images/banner2.jpg'),
  banner3: require('../assets/images/banner3.jpg'),
  bgmiBanner1: require('../assets/images/bgmi_banner1.jpg'),
  bgmiBanner2: require('../assets/images/bgmi_banner2.jpg'),
  bgmiPoster: require('../assets/images/bgmi_poster.jpg'),
  storeBg: require('../assets/images/store_bg.jpg'),
};

const IMAGES_LIST = [
  FLYER_IMAGES.img1,
  FLYER_IMAGES.img2,
  FLYER_IMAGES.img3,
  FLYER_IMAGES.bgmi1,
  FLYER_IMAGES.bgmi2,
  FLYER_IMAGES.banner1,
  FLYER_IMAGES.banner2,
  FLYER_IMAGES.banner3,
  FLYER_IMAGES.bgmiBanner1,
  FLYER_IMAGES.bgmiPoster,
];

export const FLYER_CATEGORIES = [
  'Coming Soon',
  'All You Need to Know',
  'Prize Pool',
  'Prize Distribution',
  'Event Calculation',
  'Event Road Map',
  'Map Schedule',
  'Live Casting',
  'Caster Reveal',
  'Team Preview'
];

export interface FlyerField {
  name: string;
  label: string;
  default: string;
  y: string;
  x?: string;
  fontSize: number;
  color: string;
  fontWeight?: string;
}

export interface FlyerTemplate {
  id: string;
  name: string;
  category: string;
  image: any;
  layoutVariant: number;
  logoPos: { x: string; y: string; size: number };
  socialPos: { x: string; y: string; color: string; size: number };
  fields: FlyerField[];
}

const getCategoryHeadline = (category: string, index: number): string => {
  switch (category) {
    case 'Coming Soon':
      return index % 2 === 0 ? 'COMING SOON' : 'GET READY TO BATTLE';
    case 'All You Need to Know':
      return 'ALL YOU NEED TO KNOW';
    case 'Prize Pool':
      return index % 2 === 0 ? 'PRIZE POOL ₹50,000' : 'TOTAL PRIZE ₹1,00,000';
    case 'Prize Distribution':
      return 'PRIZE DISTRIBUTION';
    case 'Event Calculation':
      return 'POINTS & CALCULATION';
    case 'Event Road Map':
      return 'TOURNAMENT ROADMAP';
    case 'Map Schedule':
      return 'OFFICIAL MATCH SCHEDULE';
    case 'Live Casting':
      return 'WATCH LIVE BROADCAST';
    case 'Caster Reveal':
      return 'OFFICIAL CASTER REVEAL';
    case 'Team Preview':
      return 'QUALIFIED TEAMS PREVIEW';
    default:
      return category.toUpperCase();
  }
};

const getCategorySubHeadline = (category: string, index: number): string => {
  switch (category) {
    case 'Coming Soon':
      return 'REGISTRATION OPENS SOON';
    case 'All You Need to Know':
      return 'RULES • FORMAT • TIMINGS';
    case 'Prize Pool':
      return 'TOP 3 TEAMS REWARD';
    case 'Prize Distribution':
      return '#1: 50% • #2: 30% • #3: 20%';
    case 'Event Calculation':
      return '1 KILL = 1 POINT | WWCD = 10 PTS';
    case 'Event Road Map':
      return 'QUALIFIERS • SEMIS • GRAND FINALS';
    case 'Map Schedule':
      return 'ERANGEL • MIRAMAR • SANHOK';
    case 'Live Casting':
      return 'STREAMING LIVE ON YOUTUBE';
    case 'Caster Reveal':
      return 'VOICE OF THE BATTLEGROUND';
    case 'Team Preview':
      return 'TOP 25 INVITED ROSTERS';
    default:
      return 'OFFICIAL TOURNAMENT';
  }
};

export const generateTemplates = (): FlyerTemplate[] => {
  const templates: FlyerTemplate[] = [];

  FLYER_CATEGORIES.forEach((cat) => {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    for (let i = 1; i <= 10; i++) {
      const img = IMAGES_LIST[(i - 1) % IMAGES_LIST.length];
      const variant = (i % 3); // 0, 1, 2 layout variants

      let orgY = '6%';
      let eventY = '13%';
      let subY = '20%';
      let headlineY = '42%';
      let subHeadlineY = '50%';
      let logoX = '75%';
      let logoY = '5%';
      let socialY = '88%';
      let primaryColor = '#FFD700';

      if (variant === 1) {
        orgY = '8%';
        eventY = '16%';
        subY = '24%';
        headlineY = '48%';
        subHeadlineY = '56%';
        logoX = '10%';
        logoY = '7%';
        socialY = '90%';
        primaryColor = '#00F0FF';
      } else if (variant === 2) {
        orgY = '5%';
        eventY = '12%';
        subY = '18%';
        headlineY = '38%';
        subHeadlineY = '46%';
        logoX = '80%';
        logoY = '4%';
        socialY = '86%';
        primaryColor = '#FF3366';
      }

      const fields: FlyerField[] = [
        {
          name: 'organiserName',
          label: 'Organiser Name',
          default: 'STG ESPORTS',
          y: orgY,
          x: '20%',
          fontSize: 22,
          color: primaryColor,
          fontWeight: '900'
        },
        {
          name: 'eventName',
          label: 'Event Name',
          default: 'STG OP CHAMPIONSHIP',
          y: eventY,
          x: '20%',
          fontSize: 18,
          color: '#FFFFFF',
          fontWeight: '800'
        },
        {
          name: 'subName',
          label: 'Sub Name',
          default: 'GROUP 1',
          y: subY,
          x: '20%',
          fontSize: 14,
          color: '#E2E8F0',
          fontWeight: '700'
        },
        {
          name: 'headline',
          label: 'Headline',
          default: getCategoryHeadline(cat, i),
          y: headlineY,
          x: '15%',
          fontSize: 24,
          color: primaryColor,
          fontWeight: '900'
        },
        {
          name: 'subHeadline',
          label: 'Subtitle',
          default: getCategorySubHeadline(cat, i),
          y: subHeadlineY,
          x: '15%',
          fontSize: 13,
          color: '#FFFFFF',
          fontWeight: '600'
        }
      ];

      templates.push({
        id: `${slug}_${i}`,
        name: `${cat} #${i}`,
        category: cat,
        image: img,
        layoutVariant: variant,
        logoPos: { x: logoX, y: logoY, size: 42 },
        socialPos: { x: '15%', y: socialY, color: '#FFFFFF', size: 12 },
        fields
      });
    }
  });

  return templates;
};

export const ALL_FLYER_TEMPLATES = generateTemplates();
