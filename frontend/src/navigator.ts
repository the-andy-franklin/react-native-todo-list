import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
}

export function useAppNavigation() {
  return useNavigation<NavigationProp<RootStackParamList>>();
}

export const Stack = createStackNavigator<RootStackParamList>();
