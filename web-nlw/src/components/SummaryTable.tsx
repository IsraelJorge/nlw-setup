import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { SummaryData } from "../@types/types";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export const SummaryTable = () => {
  const [summary, setsummary] = useState<SummaryData[]>([]);

  const getSummary = async () => {
    try {
      const { data } = await api.get("/summary");
      setsummary(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => (
          <div
            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            key={index}
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInsummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayInsummary?.amount}
                defaultcompleted={dayInsummary?.completed}
              />
            );
          })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, index) => (
            <div
              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              key={index}
            />
          ))}
      </div>
    </div>
  );
};
