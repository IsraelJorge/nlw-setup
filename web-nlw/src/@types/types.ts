export type SummaryData = {
  amount: number;
  completed: number;
  date: string;
  id: string;
};

export type HabitsInfoData = {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
};
