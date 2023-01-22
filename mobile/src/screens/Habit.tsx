import { useRoute } from "@react-navigation/native";
import { Alert, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { HabitsInfoData } from "../@types/types";
import { generateProgressPercentage } from "../utils/generete-progress-percentage";
import { HabitHempty } from "../components/HabitHempty";
import clsx from "clsx";

type Params = {
  date: string;
};

export const Habit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfoData | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const { params } = useRoute();
  const { date } = params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());

  const habitsProgress = habitsInfo?.possibleHabits.length
    ? generateProgressPercentage(
        habitsInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  const getHabits = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<HabitsInfoData>("/day", {
        params: {
          date,
        },
      });

      setHabitsInfo(data);
      setCompletedHabits(data.completedHabits);
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "Não foi possivel carregar as informações do hábito");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await api.patch(`habits/${habitId}/toggle`);

      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((habit) => habit !== habitId)
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId]);
      }
    } catch (error) {
      Alert.alert("Ops", "Não foi possivel atualizar o status dos hábitos");
    }
  };

  useEffect(() => {
    getHabits();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <BackButton />

        <Text className="font-semibold text-white text-base lowercase mt-6">
          {dayOfWeek}
        </Text>

        <Text className="font-extrabold text-white text-3xl ">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {habitsInfo?.possibleHabits.length !== 0 ? (
            habitsInfo?.possibleHabits.map((habit) => (
              <CheckBox
                key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitHempty />
          )}

          {isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode editar hábitos de uma data passada
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
