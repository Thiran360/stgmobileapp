const fs = require('fs');
let c = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const mapFunction = 
      if (apiData && Array.isArray(apiData)) {
          const mappedData = apiData.map(item => ({
            id: item.id ? item.id.toString() : '',
            user_id: item.user_id,
            name: item.name || '',
            organiserName: item.organiser_name || item.organiserName || '',
            sponsorName: item.sponsor_name || item.sponsorName || '',
            manageBy: item.manage_by || item.manageBy || '',
            socialMedia: [
              item.social_media_1 || '',
              item.social_media_2 || '',
              item.social_media_3 || '',
              item.social_media_4 || ''
            ],
            game: item.game || '',
            prize: item.prize || '',
            teamsLimit: item.teams_limit?.toString() || item.teamsLimit?.toString() || '0',
            totalSlots: item.total_slots?.toString() || item.totalSlots?.toString() || '0',
            teamsPerGroup: item.teams_per_group?.toString() || item.teamsPerGroup?.toString() || '0',
            numberOfGroups: item.number_of_groups?.toString() || item.numberOfGroups?.toString() || '0',
            regStartDate: item.registration_start_date || item.regStartDate || '',
            regEndDate: item.registration_end_date || item.regEndDate || '',
            roadmap: item.roadmap || '',
            time: item.time || '',
            matchDate: item.match_date || item.matchDate || '',
            bannerImage: item.banner_image || item.bannerImage || null,
            status: item.status || 'upcoming',
            selectedFlyers: item.selected_flyers || item.selectedFlyers || {},
            stages: item.stages || [],
            matchDatesObj: item.match_dates_obj || item.matchDatesObj || {},
            killsPoint: item.kills_point || item.killsPoint || 1,
            positions: item.positions || []
          }));
          setGlobalTournaments(mappedData);
          await AsyncStorage.setItem('tournaments', JSON.stringify(mappedData));
;

c = c.replace(
  "      if (apiData && Array.isArray(apiData)) {\r\n          setGlobalTournaments(apiData);\r\n          await AsyncStorage.setItem('tournaments', JSON.stringify(apiData));",
  mapFunction
);
c = c.replace(
  "      if (apiData && Array.isArray(apiData)) {\n          setGlobalTournaments(apiData);\n          await AsyncStorage.setItem('tournaments', JSON.stringify(apiData));",
  mapFunction
);

fs.writeFileSync('src/context/AppContext.tsx', c, 'utf8');
console.log('Done mapping in AppContext');
