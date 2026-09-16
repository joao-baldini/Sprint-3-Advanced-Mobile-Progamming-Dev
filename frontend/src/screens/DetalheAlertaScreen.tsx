import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alerta, NivelSeveridade, StatusAlerta } from "../types/Alerta";
import { alertaService } from "../services/alertaService";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Detalhe">;

const corSev: Record<NivelSeveridade, string> = { BAIXO:"#4CAF50", MEDIO:"#FF9800", ALTO:"#F44336", CRITICO:"#B71C1C" };
const corSt: Record<StatusAlerta, string> = { ABERTO:"#F44336", EM_ANALISE:"#FF9800", RESOLVIDO:"#4CAF50", IGNORADO:"#757575" };
const labelTipo: Record<string,string> = { SEM_CAPACETE:"Sem Capacete", SEM_COLETE:"Sem Colete", SEM_LUVA:"Sem Luva", POSTURA_RISCO:"Postura de Risco", ZONA_PERIGOSA:"Zona Perigosa" };

export function DetalheAlertaScreen({ navigation, route }: Props) {
  const { alertaId } = route.params;
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarAlerta = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await alertaService.buscarPorId(alertaId);
      setAlerta(dados);
    } catch {
      setErro(
        "Não foi possível consultar este alerta. O registro pode não existir ou o backend pode estar indisponível.",
      );
    } finally {
      setCarregando(false);
    }
  }, [alertaId]);

  useEffect(() => {
    void carregarAlerta();
  }, [carregarAlerta]);

  if (carregando) {
    return (
      <SafeAreaView style={[s.container, s.estadoCentral]}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={s.estadoTexto}>Consultando alerta...</Text>
      </SafeAreaView>
    );
  }

  if (erro || !alerta) {
    return (
      <SafeAreaView style={[s.container, s.estadoCentral]}>
        <Text style={s.estadoTitulo}>Alerta não carregado</Text>
        <Text style={s.estadoTexto}>{erro}</Text>
        <TouchableOpacity style={s.btnTentar} onPress={() => void carregarAlerta()}>
          <Text style={s.btnTentarText}>Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnVoltarErro} onPress={() => navigation.goBack()}>
          <Text style={s.btnVoltarText}>Voltar para a lista</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const a = alerta;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[s.banner, { backgroundColor: corSev[a.nivelSeveridade] }]}>
          <Text style={s.bannerTipo}>{labelTipo[a.tipo]}</Text>
          <Text style={s.bannerNivel}>{a.nivelSeveridade}</Text>
        </View>
        <View style={s.card}>
          <Text style={s.secTitulo}>Informações do Alerta</Text>
          {([["ID", `#${a.id}`], ["Status", a.status, corSt[a.status]], ["Localização", a.localizacao.replace(/_/g," ")], ["Câmera", a.cameraId], ["Data / Hora", new Date(a.dataHoraAlerta).toLocaleString("pt-BR")], ["Registrado em", new Date(a.dataHoraRegistro).toLocaleString("pt-BR")]] as [string,string,string?][]).map(([r,v,c]) => (
            <View key={r} style={s.row}>
              <Text style={s.rotulo}>{r}</Text>
              <Text style={[s.valor, c ? {color:c} : {}]}>{v}</Text>
            </View>
          ))}
        </View>
        <View style={[s.card, {marginTop:16}]}>
          <Text style={s.secTitulo}>Descrição</Text>
          <Text style={s.desc}>{a.descricao}</Text>
        </View>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={s.btnVoltarText}>← Voltar para Lista</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0D0D0D" },
  banner: { paddingHorizontal:24, paddingVertical:28, flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  bannerTipo: { color:"#fff", fontSize:20, fontWeight:"800", flex:1 },
  bannerNivel: { color:"rgba(255,255,255,0.85)", fontSize:14, fontWeight:"700", backgroundColor:"rgba(0,0,0,0.2)", paddingHorizontal:10, paddingVertical:5, borderRadius:8 },
  card: { backgroundColor:"#1A1A1A", borderRadius:12, margin:16, marginBottom:0, padding:16 },
  secTitulo: { color:"#fff", fontSize:15, fontWeight:"700", marginBottom:8 },
  row: { flexDirection:"row", justifyContent:"space-between", paddingVertical:14, borderBottomWidth:1, borderBottomColor:"#1F1F1F" },
  rotulo: { color:"#666", fontSize:12, fontWeight:"600", textTransform:"uppercase", flex:1 },
  valor: { color:"#fff", fontSize:13, fontWeight:"500", flex:2, textAlign:"right" },
  desc: { color:"#CCC", fontSize:15, lineHeight:22, marginTop:4 },
  btnVoltar: { margin:16, marginTop:24, paddingVertical:14, borderRadius:12, borderWidth:1, borderColor:"#2A2A2A", alignItems:"center" },
  btnVoltarText: { color:"#777", fontSize:15, fontWeight:"600" },
  estadoCentral: { alignItems:"center", justifyContent:"center", padding:24 },
  estadoTitulo: { color:"#fff", fontSize:18, fontWeight:"700", textAlign:"center" },
  estadoTexto: { color:"#999", fontSize:14, lineHeight:20, textAlign:"center", marginTop:12 },
  btnTentar: { backgroundColor:"#E53935", paddingHorizontal:18, paddingVertical:12, borderRadius:10, marginTop:20 },
  btnTentarText: { color:"#fff", fontWeight:"700" },
  btnVoltarErro: { paddingHorizontal:18, paddingVertical:12, marginTop:8 },
});
