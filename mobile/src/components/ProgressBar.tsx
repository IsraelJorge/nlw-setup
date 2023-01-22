import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ProgressBar = {
  progress?: number;
};

export const ProgressBar = ({ progress = 0 }: ProgressBar) => {
  const sheredProgress = useSharedValue(progress);

  const style = useAnimatedStyle(() => {
    return {
      width: `${sheredProgress.value}%`,
    };
  });

  useEffect(() => {
    sheredProgress.value = withTiming(progress);
  }, [progress]);

  return (
    <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
      <Animated.View className="h-3 rounded-xl bg-violet-600 " style={style} />
    </View>
  );
};
