import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ListaAlertasScreen } from "./src/screens/ListaAlertasScreen";
import { CadastroAlertaScreen } from "./src/screens/CadastroAlertaScreen";
import { DetalheAlertaScreen } from "./src/screens/DetalheAlertaScreen";

export type RootStackParamList = {
  Lista: undefined;
  Cadastro: undefined;
  Detalhe: { alertaId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#0D0D0D" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#0D0D0D" },
        }}
      >
        <Stack.Screen
          name="Lista"
          component={ListaAlertasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroAlertaScreen}
          options={{ title: "Novo Alerta" }}
        />
        <Stack.Screen
          name="Detalhe"
          component={DetalheAlertaScreen}
          options={{ title: "Detalhe do Alerta" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
