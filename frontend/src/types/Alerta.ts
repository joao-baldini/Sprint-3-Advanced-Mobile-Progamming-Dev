export type NivelSeveridade = "BAIXO" | "MEDIO" | "ALTO" | "CRITICO";
export type StatusAlerta = "ABERTO" | "EM_ANALISE" | "RESOLVIDO" | "IGNORADO";
export type TipoAlerta = "SEM_CAPACETE" | "SEM_COLETE" | "SEM_LUVA" | "POSTURA_RISCO" | "ZONA_PERIGOSA";

export type Alerta = {
  id: number;
  tipo: TipoAlerta;
  descricao: string;
  nivelSeveridade: NivelSeveridade;
  localizacao: string;
  cameraId: string;
  status: StatusAlerta;
  dataHoraAlerta: string;
  dataHoraRegistro: string;
};

export type NovoAlerta = Omit<Alerta, "id" | "dataHoraRegistro">;