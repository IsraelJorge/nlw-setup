import { View, ActivityIndicator } from "react-native";

export const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090A",
      }}
    >
      <ActivityIndicator color="#7C3AED" size="large" />
    </View>
  );
};
