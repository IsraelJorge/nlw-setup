import { Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import { HabitsInfoData } from "../@types/types";
import dayjs from "dayjs";

type HabitsListProps = {
  date: Date;
  onCompletedChanged: (completed: number) => void;
};

export const HabitsList = ({ date, onCompletedChanged }: HabitsListProps) => {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfoData>();

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  const getDayHabits = async () => {
    try {
      const { data } = await api.get("/day", {
        params: {
          date: date.toISOString(),
        },
      });
      setHabitsInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    await api.patch(`habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted =
      habitsInfo?.completedHabits.includes(habitId);

    let completedHabits: string[];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      completedHabits: completedHabits,
      possibleHabits: habitsInfo!.possibleHabits,
    });

    onCompletedChanged(completedHabits.length);
  };

  useEffect(() => {
    getDayHabits();
  }, []);

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        return (
          <Checkbox.Root
            key={habit.id}
            className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
            checked={habitsInfo.completedHabits.includes(habit.id)}
            disabled={isDateInPast}
            onCheckedChange={() => handleToggleHabit(habit.id)}
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500  group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.CheckboxIndicator>
                <Check size={20} className="text-white " />
              </Checkbox.CheckboxIndicator>
            </div>

            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        );
      })}
    </div>
  );
};
