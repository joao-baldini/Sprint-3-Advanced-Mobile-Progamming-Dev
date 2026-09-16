import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Alerta, NivelSeveridade, StatusAlerta } from "../types/Alerta";

type Props = { alerta: Alerta; onPress: () => void; };

const corSev: Record<NivelSeveridade, string> = { BAIXO:"#4CAF50", MEDIO:"#FF9800", ALTO:"#F44336", CRITICO:"#B71C1C" };
const corSt: Record<StatusAlerta, string> = { ABERTO:"#F44336", EM_ANALISE:"#FF9800", RESOLVIDO:"#4CAF50", IGNORADO:"#757575" };
const labelTipo: Record<string, string> = { SEM_CAPACETE:"Sem Capacete", SEM_COLETE:"Sem Colete", SEM_LUVA:"Sem Luva", POSTURA_RISCO:"Postura de Risco", ZONA_PERIGOSA:"Zona Perigosa" };

export function AlertaCard({ alerta, onPress }: Props) {
  return (
    <TouchableOpacity style={[s.card, { borderLeftColor: corSev[alerta.nivelSeveridade] }]} onPress={onPress} activeOpacity={0.85}>
      <View style={s.header}>
        <Text style={s.tipo}>{labelTipo[alerta.tipo]}</Text>
        <View style={[s.badge, { backgroundColor: corSev[alerta.nivelSeveridade] }]}>
          <Text style={s.badgeText}>{alerta.nivelSeveridade}</Text>
        </View>
      </View>
      <Text style={s.desc} numberOfLines={2}>{alerta.descricao}</Text>
      <View style={s.footer}>
        <Text style={s.local}>📍 {alerta.localizacao.replace(/_/g," ")}</Text>
        <View style={[s.badge, { backgroundColor: corSt[alerta.status] }]}>
          <Text style={s.badgeText}>{alerta.status.replace(/_/g," ")}</Text>
        </View>
      </View>
      <View style={s.meta}>
        <Text style={s.metaText}>🎥 {alerta.cameraId}</Text>
        <Text style={s.metaText}>{new Date(alerta.dataHoraAlerta).toLocaleString("pt-BR")}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor:"#1A1A1A", borderRadius:12, padding:16, marginBottom:12, borderLeftWidth:4, elevation:3, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.3, shadowRadius:4 },
  header: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
  tipo: { color:"#fff", fontSize:16, fontWeight:"700", flex:1 },
  badge: { borderRadius:6, paddingHorizontal:8, paddingVertical:3, marginLeft:8 },
  badgeText: { color:"#fff", fontSize:11, fontWeight:"700" },
  desc: { color:"#AAA", fontSize:13, lineHeight:19, marginBottom:10 },
  footer: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  local: { color:"#CCC", fontSize:12 },
  meta: { flexDirection:"row", justifyContent:"space-between", marginTop:4 },
  metaText: { color:"#666", fontSize:11 },
});