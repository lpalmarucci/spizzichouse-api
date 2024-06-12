export type MatchHistorySummary = {
  wins: number;
  loses: number;
};

export type SummaryHistoryDetail = {
  match_id: number;
  score: number;
  total_points: number;
};

export type DashboardRanking = {
  total_wins: number;
  username: string;
  user_id: number;
};
