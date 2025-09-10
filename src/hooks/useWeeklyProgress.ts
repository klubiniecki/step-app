interface WeeklyCompletion {
  [key: string]: boolean;
}

export function useWeeklyProgress(weeklyCompletion: WeeklyCompletion) {
  const getWeekDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();

      days.push({
        date: dateStr,
        dayName,
        dayNumber,
        completed: weeklyCompletion[dateStr] || false,
      });
    }

    return days;
  };

  const getCompletionRate = () => {
    const days = getWeekDays();
    const completed = days.filter(day => day.completed).length;
    return completed / days.length;
  };

  return {
    getWeekDays,
    getCompletionRate,
  };
}
