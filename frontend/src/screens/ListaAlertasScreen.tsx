import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AlertaCard } from "../components/AlertaCard";
import { Alerta } from "../types/Alerta";
import { alertaService } from "../services/alertaService";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Lista">;

export function ListaAlertasScreen({ navigation }: Props) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarAlertas = useCallback(async (mostrarCarregamento = true) => {
    if (mostrarCarregamento) {
      setCarregando(true);
    }
    setErro(null);

    try {
      const dados = await alertaService.listar();
      setAlertas(dados);
    } catch {
      setErro(
        "Não foi possível carregar os alertas. Confirme se o backend está ativo e se a BASE_URL está correta.",
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    void carregarAlertas();
  }, [carregarAlertas]);

  useEffect(() => {
    const removerListener = navigation.addListener("focus", () => {
      void carregarAlertas(false);
    });

    return removerListener;
  }, [carregarAlertas, navigation]);

  const atualizarLista = () => {
    setAtualizando(true);
    void carregarAlertas(false);
  };

  if (carregando && alertas.length === 0) {
    return (
      <SafeAreaView style={[s.container, s.estadoCentral]}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={s.estadoTexto}>Carregando alertas...</Text>
      </SafeAreaView>
    );
  }

  if (erro && alertas.length === 0) {
    return (
      <SafeAreaView style={[s.container, s.estadoCentral]}>
        <Text style={s.estadoTitulo}>Backend indisponível</Text>
        <Text style={s.estadoTexto}>{erro}</Text>
        <TouchableOpacity style={s.btnTentar} onPress={() => void carregarAlertas()}>
          <Text style={s.btnTentarText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.titulo}>🏭 SPI Alert</Text>
          <Text style={s.sub}>{alertas.length} alertas registrados</Text>
        </View>
        <TouchableOpacity
          style={s.btnNovo}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={s.btnNovoText}>+ Novo</Text>
        </TouchableOpacity>
      </View>
      {erro ? <Text style={s.erroBanner}>{erro}</Text> : null}
      <FlatList
        data={alertas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AlertaCard
            alerta={item}
            onPress={() =>
              navigation.navigate("Detalhe", { alertaId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={s.vazio}>
            <Text style={s.estadoTitulo}>Nenhum alerta registrado</Text>
            <Text style={s.estadoTexto}>
              Use “+ Novo” para criar o primeiro registro na API.
            </Text>
          </View>
        }
        contentContainerStyle={{ padding:16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={atualizarLista}
            tintColor="#E53935"
            colors={["#E53935"]}
          />
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0D0D0D" },
  header: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:20, paddingTop:20, paddingBottom:16, borderBottomWidth:1, borderBottomColor:"#1F1F1F" },
  titulo: { color:"#fff", fontSize:22, fontWeight:"800" },
  sub: { color:"#666", fontSize:13, marginTop:2 },
  btnNovo: { backgroundColor:"#E53935", paddingHorizontal:16, paddingVertical:10, borderRadius:10 },
  btnNovoText: { color:"#fff", fontWeight:"700", fontSize:14 },
  estadoCentral: { alignItems:"center", justifyContent:"center", padding:24 },
  estadoTitulo: { color:"#fff", fontSize:18, fontWeight:"700", textAlign:"center", marginBottom:8 },
  estadoTexto: { color:"#999", fontSize:14, lineHeight:20, textAlign:"center", marginTop:12 },
  btnTentar: { backgroundColor:"#E53935", paddingHorizontal:18, paddingVertical:12, borderRadius:10, marginTop:20 },
  btnTentarText: { color:"#fff", fontWeight:"700" },
  erroBanner: { color:"#FFCDD2", backgroundColor:"#3A1717", paddingHorizontal:16, paddingVertical:10, fontSize:12 },
  vazio: { paddingHorizontal:24, paddingVertical:72, alignItems:"center" },
});
