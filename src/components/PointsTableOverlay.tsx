import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PointCalcTeam } from './PointCalcModal';

interface PointsTableOverlayProps {
  teams: PointCalcTeam[];
  eventName?: string;
  subName?: string;
  matchInfo?: string;
  mapName?: string;
}

const PointsTableOverlay: React.FC<PointsTableOverlayProps> = ({
  teams,
  eventName = 'STG OP CHAMPIONSHIP',
  subName = 'FINALS - OVERALL STANDINGS',
  matchInfo = 'Match 5',
  mapName = 'Erangel'
}) => {
  // Show top 8 or 10 teams cleanly fitted on the poster
  const displayTeams = (teams && teams.length > 0 ? teams : []).slice(0, 10);

  return (
    <View style={styles.tableCard} pointerEvents="none">
      {/* Table Header Bar */}
      <View style={styles.headerBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSubName} numberOfLines={1}>{subName.toUpperCase()}</Text>
          <Text style={styles.headerEventName} numberOfLines={1}>{eventName}</Text>
        </View>
        <View style={styles.metaBadge}>
          <Text style={styles.metaBadgeText}>{matchInfo} • {mapName}</Text>
        </View>
      </View>

      {/* Columns Header */}
      <View style={styles.columnsHeaderRow}>
        <Text style={[styles.colHeadText, { width: 28 }]}>#</Text>
        <Text style={[styles.colHeadText, { flex: 1.8, textAlign: 'left', paddingLeft: 6 }]}>TEAM</Text>
        <Text style={[styles.colHeadText, { width: 34 }]}>M</Text>
        <Text style={[styles.colHeadText, { width: 38 }]}>WWCD</Text>
        <Text style={[styles.colHeadText, { width: 42 }]}>FINISH</Text>
        <Text style={[styles.colHeadText, { width: 44, color: '#FFD700' }]}>TOTAL</Text>
      </View>

      {/* Team Rows */}
      {displayTeams.map((team, idx) => {
        const isFirst = team.rank === 1;
        const isSecond = team.rank === 2;
        const isThird = team.rank === 3;

        return (
          <View
            key={team.id}
            style={[
              styles.row,
              idx % 2 === 1 && styles.rowAlt,
              isFirst && styles.rowFirst,
            ]}
          >
            {/* Rank badge */}
            <View
              style={[
                styles.rankBadge,
                isFirst && styles.rankBadgeFirst,
                isSecond && styles.rankBadgeSecond,
                isThird && styles.rankBadgeThird,
              ]}
            >
              <Text
                style={[
                  styles.rankBadgeText,
                  (isFirst || isSecond || isThird) && styles.rankBadgeTextHighlight
                ]}
              >
                #{team.rank}
              </Text>
            </View>

            {/* Team Name */}
            <View style={{ flex: 1.8, paddingLeft: 6 }}>
              <Text style={[styles.teamNameText, isFirst && { color: '#FFD700' }]} numberOfLines={1}>
                {team.name}
              </Text>
            </View>

            {/* Matches */}
            <Text style={[styles.cellText, { width: 34 }]}>{team.matches}</Text>

            {/* WWCD */}
            <View style={[styles.cellWrap, { width: 38 }]}>
              {team.wwcd > 0 ? (
                <View style={styles.wwcdPill}>
                  <Text style={styles.wwcdPillText}>🍗 {team.wwcd}</Text>
                </View>
              ) : (
                <Text style={styles.cellText}>0</Text>
              )}
            </View>

            {/* Finishes */}
            <Text style={[styles.cellText, { width: 42 }]}>{team.kills}</Text>

            {/* Total Points */}
            <View style={[styles.totalCell, { width: 44 }]}>
              <Text style={[styles.totalText, isFirst && styles.totalTextFirst]}>
                {team.totalPts}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Branding Footer */}
      <View style={styles.tableFooter}>
        <Text style={styles.footerBrand}>CALCULATED BY POINTCALC • STG ESPORTS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableCard: {
    width: '94%',
    alignSelf: 'center',
    backgroundColor: 'rgba(10, 15, 29, 0.92)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    overflow: 'hidden',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    marginBottom: 6,
  },
  headerSubName: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 1,
  },
  headerEventName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  metaBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  metaBadgeText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '700',
  },
  columnsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  colHeadText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94A3B8',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  rowAlt: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  rowFirst: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
  },
  rankBadge: {
    width: 24,
    height: 18,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  rankBadgeFirst: {
    backgroundColor: '#F59E0B',
  },
  rankBadgeSecond: {
    backgroundColor: '#94A3B8',
  },
  rankBadgeThird: {
    backgroundColor: '#D97706',
  },
  rankBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#CBD5E1',
  },
  rankBadgeTextHighlight: {
    color: '#000000',
  },
  teamNameText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cellText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E2E8F0',
    textAlign: 'center',
  },
  cellWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wwcdPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  wwcdPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FCD34D',
  },
  totalCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#A78BFA',
  },
  totalTextFirst: {
    color: '#FFD700',
  },
  tableFooter: {
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  footerBrand: {
    fontSize: 7.5,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1,
  },
});

export default PointsTableOverlay;
