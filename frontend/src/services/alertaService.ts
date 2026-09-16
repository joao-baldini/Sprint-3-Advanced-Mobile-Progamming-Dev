import { Alerta, NovoAlerta } from "../types/Alerta";
import { api } from "./api";

export const alertaService = {
  async listar(): Promise<Alerta[]> {
    const resposta = await api.get<Alerta[]>("/alertas");
    return resposta.data;
  },

  async buscarPorId(id: number): Promise<Alerta> {
    const resposta = await api.get<Alerta>(`/alertas/${id}`);
    return resposta.data;
  },

  async criar(novoAlerta: NovoAlerta): Promise<Alerta> {
    const resposta = await api.post<Alerta>("/alertas", novoAlerta);
    return resposta.data;
  },
};
