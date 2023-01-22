import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SummaryData } from "../@types/types";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const daysFeromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - daysFeromYearStart.length;

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData[]>([]);

  const { navigate } = useNavigation();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/summary");

      setSummary(data);
    } catch (error) {
      Alert.alert("Error", "Não foi possivel carregar o sumário de hábitos.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-xl text-zinc-400 font-bold text-center m-1"
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {daysFeromYearStart.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });

              return (
                <HabitDay
                  key={date.toString()}
                  date={date}
                  amountCompleted={dayWithHabits?.completed}
                  amountOfHabits={dayWithHabits?.amount}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                />
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
