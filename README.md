# Sprint 3 — Integração Frontend e Backend

Entrega da Sprint 3 do projeto **SPI Alert / Metaindústria**. O aplicativo React Native com Expo consome registros reais da API Spring Boot; os dados mockados da Sprint 2 não são mais usados.

## O que foi integrado

- Lista de alertas com `GET /alertas` ao abrir ou voltar para a tela.
- Cadastro com `POST /alertas` e atualização da lista ao retornar.
- Detalhe com nova consulta em `GET /alertas/{id}`.
- Estados visuais de carregamento, lista vazia, sucesso e erro.
- Nova tentativa e atualização por gesto de arrastar na lista.
- Camada de serviços isolando Axios, URL e chamadas HTTP das telas.
- CORS liberado no controller com `@CrossOrigin`.
- Persistência em banco H2 no modo file.

## Estrutura

```text
Sprint-3-Integracao-Metaindustria/
├── backend/                         API Spring Boot
│   └── src/main/java/.../
│       ├── controller/
│       ├── model/
│       ├── repository/
│       └── service/
└── frontend/                        Aplicativo Expo
    └── src/
        ├── components/
        ├── screens/
        ├── services/
        │   ├── api.ts
        │   └── alertaService.ts
        └── types/
```

## Pré-requisitos

- Java 17
- Maven 3.9 ou compatível
- Node.js 20.19 ou superior
- Expo Go compatível com SDK 54, em caso de teste no celular

## Como subir o backend

Abra um terminal na pasta `backend`:

```bash
mvn spring-boot:run
```

A API fica disponível em `http://localhost:8080`. O H2 grava os dados em `backend/data/spidb` e mantém os registros após reiniciar a aplicação.

Antes de abrir o app, confirme no navegador, Postman ou Insomnia:

```text
GET http://localhost:8080/alertas
```

Uma API recém-iniciada pode responder `[]`; isso é válido.

## Como subir o frontend

Em outro terminal, abra a pasta `frontend`:

```bash
npm ci
npx expo start
```

O Axios já está registrado nas dependências e foi adicionado com `npx expo install axios`, conforme o padrão do Expo.

## BASE_URL por ambiente

O arquivo `frontend/src/services/api.ts` define `baseURL`, timeout de 10 segundos e o header `Content-Type: application/json`.

| Ambiente | URL padrão |
|---|---|
| Web | `http://localhost:8080` |
| Simulador iOS | `http://localhost:8080` |
| Emulador Android | `http://10.0.2.2:8080` |
| Celular físico | IP da máquina na rede local |

Para um celular físico, informe o IP da máquina antes de iniciar o Expo. Exemplo no PowerShell:

```powershell
$env:EXPO_PUBLIC_API_URL="http://192.168.0.10:8080"
npx expo start --clear
```

O computador e o celular devem estar na mesma rede. Troque `192.168.0.10` pelo IPv4 da máquina e permita a porta 8080 no firewall, se necessário.

## Camada de serviços

As telas não importam Axios e não montam URLs:

- `api.ts`: configura a instância Axios e escolhe a `BASE_URL`.
- `alertaService.ts`: expõe `listar`, `buscarPorId` e `criar`.
- `criar` recebe `NovoAlerta`, definido com `Omit<Alerta, "id" | "dataHoraRegistro">`; esses dois campos são gerados pelo backend.

## Endpoints

| Método | Endpoint | Uso no app |
|---|---|---|
| `GET` | `/alertas` | Listar registros |
| `GET` | `/alertas/{id}` | Consultar detalhe |
| `POST` | `/alertas` | Criar registro |
| `PUT` | `/alertas/{id}` | Atualizar, disponível na API |
| `DELETE` | `/alertas/{id}` | Excluir, disponível na API |

A API também mantém os filtros da Sprint 1:

```text
GET /alertas/severidade/{nivel}
GET /alertas/status/{status}
GET /alertas/localizacao/{local}
```

Exemplo de cadastro:

```json
{
  "tipo": "SEM_CAPACETE",
  "descricao": "Funcionário detectado sem capacete de proteção",
  "nivelSeveridade": "ALTO",
  "localizacao": "LINHA_PRODUCAO_3",
  "cameraId": "CAM-003",
  "status": "ABERTO",
  "dataHoraAlerta": "2026-05-21T14:30:00"
}
```

## Como testar a integração

1. Inicie o backend e confirme que `GET /alertas` retorna JSON.
2. Inicie o Expo no ambiente desejado.
3. Abra a lista; ela deve refletir os registros do H2.
4. Cadastre um alerta; o backend deve responder `201 Created`.
5. Ao voltar, confirme que o novo alerta aparece na lista.
6. Abra o registro; a tela de detalhe fará `GET /alertas/{id}`.
7. Pare o backend e atualize a lista para conferir o estado de indisponibilidade e o botão **Tentar novamente**.

Validações automatizadas:

```bash
cd backend
mvn test

cd ../frontend
npx tsc --noEmit
```

## Comportamento com o backend parado

O aplicativo encerra o carregamento após o timeout, informa que a API está indisponível e oferece nova tentativa. No cadastro, os dados digitados permanecem na tela para que o usuário possa reenviar depois de restabelecer o backend.
