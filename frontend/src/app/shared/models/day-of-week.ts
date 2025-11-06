interface DayOfWeek {
  key: string;
  label: string;
  short: string;
  capability?: {
    max: number;
  };
  children: { id: string; name: string; assignmentId: string; group: string }[];
}
