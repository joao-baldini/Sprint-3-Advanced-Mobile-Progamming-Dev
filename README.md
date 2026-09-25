# SPI Alert / FutureVision — entrega final (Sprint 4)

Aplicativo React Native com Expo integrado a uma API Spring Boot para registrar e consultar **alertas de segurança na Metaindústria**. Esta é a versão final do trabalho de Advanced Programming & Mobile Dev, construída a partir do backend da Sprint 1, do frontend da Sprint 2 e da integração da Sprint 3.

O regulamento do SPI Innovation Challenge propõe proteção ativa de funcionários: antecipar situações de risco antes que se tornem infrações ou acidentes, evoluindo de detecção de EPIs e análise de comportamento até alertas proativos. Nesta entrega da disciplina, o SPI Alert implementa a **parte de registro e consulta dos alertas** no app e na API. **Este repositório não executa visão computacional nem previsão automática em tempo real.**

## Integrantes

| Nome | RM |
| --- | --- |
| Lucas Costa Sanson | 556042 |
| João Viviani Baldini | 558596 |
| Giuliano Ferreira Venceslau | 558674 |
| Eric Perez Martinez Melillo Siciliano | 558651 |
| Enrico Nikolay Meirelles Zeronian | 558557 |

## Repositórios

| Etapa | Repositório |
| --- | --- |
| Backend, Sprint 1 | [Backend-Sprint-1-Advanced-Programming-Mobile-Dev](https://github.com/joao-baldini/Backend-Sprint-1-Advanced-Programming-Mobile-Dev) |
| Frontend, Sprint 2 | [Frontend-Sprint-2-Advanced-Programming-Mobile-Dev](https://github.com/joao-baldini/Frontend-Sprint-2-Advanced-Programming-Mobile-Dev) |
| **Código final integrado, Sprints 3 e 4** | **[Sprint-3-Advanced-Mobile-Progamming-Dev](https://github.com/joao-baldini/Sprint-3-Advanced-Mobile-Progamming-Dev)** |

Para reproduzir a entrega final, clone apenas o último repositório: ele já contém `backend/` e `frontend/`.

## O que foi entregue

- Backend em camadas (`controller`, `service`, `repository`, `model`) com CRUD de alertas, validação, CORS e banco H2 em modo file.
- App Expo com lista, cadastro e detalhe ligados à API. A pasta `frontend/src/services/` concentra a configuração HTTP e as operações da entidade.
- A lista e o cadastro usam dados reais da API; o mock da Sprint 2 saiu do fluxo principal. Quando a API falha, o app mostra o erro e oferece nova tentativa.

### Entidade `Alerta`

| Campo | Tipo no JSON | Descrição |
| --- | --- | --- |
| `id` | número | Identificador gerado pelo backend |
| `tipo` | texto | Ex.: `SEM_CAPACETE`, `SEM_COLETE`, `SEM_LUVA`, `POSTURA_RISCO`, `ZONA_PERIGOSA` |
| `descricao` | texto | Ocorrência observada |
| `nivelSeveridade` | texto | `BAIXO`, `MEDIO`, `ALTO` ou `CRITICO` |
| `localizacao` | texto | Setor da ocorrência |
| `cameraId` | texto | Identificação da câmera informada no cadastro |
| `status` | texto | `ABERTO`, `EM_ANALISE`, `RESOLVIDO` ou `IGNORADO` |
| `dataHoraAlerta` | data e hora | Momento da ocorrência, no formato `YYYY-MM-DDTHH:mm:ss` |
| `dataHoraRegistro` | data e hora | Momento do registro, preenchido pelo backend |

## Como executar do zero

### 1. Pré-requisitos

- **JDK 17** com compilador, não apenas JRE: `java -version` e `javac -version` devem mostrar a versão 17.
- **Maven 3.9+**: `mvn -version` deve indicar que está usando o JDK 17.
- **Node.js 22.13+** e npm: confira com `node --version` e `npm --version`.
- **Expo Go compatível com SDK 57** no celular, ou um simulador/emulador compatível.

### 2. Clonar e subir o backend

```bash
git clone https://github.com/joao-baldini/Sprint-3-Advanced-Mobile-Progamming-Dev.git
cd Sprint-3-Advanced-Mobile-Progamming-Dev/backend
mvn spring-boot:run
```

Deixe esse terminal aberto. A API responde em `http://localhost:8080`. Antes de iniciar o app, abra [http://localhost:8080/alertas](http://localhost:8080/alertas) no navegador ou faça `GET` nessa URL no Postman/Insomnia. A resposta deve ser JSON: `[]` em um banco novo ou uma lista de alertas já registrados.

O H2 usa `jdbc:h2:file:./data/spidb;AUTO_SERVER=TRUE`; a pasta `backend/data/` é criada localmente e os alertas persistem após reiniciar o backend. O console opcional fica em [http://localhost:8080/h2-console](http://localhost:8080/h2-console), usuário `sa`, senha vazia e URL JDBC igual à acima. O terminal do backend deve estar aberto na pasta `backend/` para que o caminho relativo do banco corresponda ao indicado.

### 3. Configurar a URL da API para o dispositivo

O arquivo `frontend/src/services/api.ts` define `BASE_URL`, timeout de 10 segundos e `Content-Type: application/json`. A variável `EXPO_PUBLIC_API_URL`, quando fornecida, substitui a URL padrão.

| Onde o app roda | URL da API |
| --- | --- |
| Web no mesmo computador | `http://localhost:8080` (padrão) |
| Simulador iOS no mesmo computador | `http://localhost:8080` (padrão) |
| Emulador Android | `http://10.0.2.2:8080` (padrão) |
| iPhone ou Android físico | `http://IP-DO-COMPUTADOR:8080` (configurar) |

Em um **celular físico**, `localhost` aponta para o próprio telefone. Conecte o telefone e o computador à mesma rede Wi-Fi, descubra o IPv4 do computador com `ipconfig` no Windows e, em outro terminal PowerShell, configure a variável antes de iniciar o Expo:

```powershell
cd Sprint-3-Advanced-Mobile-Progamming-Dev/frontend
$env:EXPO_PUBLIC_API_URL="http://192.168.0.10:8080"
npm ci
npx expo start --clear
```

Substitua `192.168.0.10` pelo IP real do computador. Como alternativa, crie `frontend/.env.local` com `EXPO_PUBLIC_API_URL=http://IP-DO-COMPUTADOR:8080`; esse arquivo é ignorado pelo Git. Se o IP mudar, atualize a configuração e reinicie o Expo. Confira no navegador do próprio celular se `http://IP-DO-COMPUTADOR:8080/alertas` retorna JSON; se não abrir, verifique Wi-Fi e firewall da porta 8080.

Para **web, simulador iOS ou emulador Android**, com os padrões da tabela, basta iniciar o frontend em outro terminal:

```bash
cd Sprint-3-Advanced-Mobile-Progamming-Dev/frontend
npm ci
npx expo start
```

Leia o QR Code com o Expo Go no celular. Depois de mudar dependências ou `EXPO_PUBLIC_API_URL`, pare o servidor anterior e use `npx expo start --clear`.

## Telas, serviços e endpoints

As telas não fazem chamadas Axios diretamente. `frontend/src/services/api.ts` configura o cliente; `frontend/src/services/alertaService.ts` implementa `listar`, `buscarPorId` e `criar`.

| Fluxo no app | Serviço | Endpoint | Resultado esperado |
| --- | --- | --- | --- |
| Abrir/atualizar a lista | `alertaService.listar()` | `GET /alertas` | `200 OK` e array JSON |
| Registrar no formulário | `alertaService.criar(novoAlerta)` | `POST /alertas` | `201 Created`, com `id` e `dataHoraRegistro` |
| Abrir um item | `alertaService.buscarPorId(id)` | `GET /alertas/{id}` | `200 OK` e objeto JSON |

O backend também oferece `PUT /alertas/{id}`, `DELETE /alertas/{id}` e filtros `GET /alertas/severidade/{nivel}`, `GET /alertas/status/{status}` e `GET /alertas/localizacao/{local}`. Essas rotas não são usadas pelas três telas principais.

## Como comprovar a integração

1. Com as duas aplicações em execução, confira `GET /alertas` no navegador/Postman/Insomnia. `[]` significa que ainda não há registros.
2. No app, toque em **+ Novo**, escolha tipo, severidade e status, preencha descrição, localização e ID da câmera e toque em **Registrar Alerta**.
3. Ao retornar, veja o novo alerta na lista e abra seu detalhe. O detalhe faz uma nova consulta pelo ID; o app não depende do objeto da lista para montar a tela.
4. Repita `GET /alertas` ou acesse `GET /alertas/{id}` na API. O JSON deve conter o mesmo alerta, agora com `id` e `dataHoraRegistro` atribuídos pelo backend.
5. Pare o backend com `Ctrl+C`. Feche e reabra o app (ou reinicie o Expo Go) para recarregar a lista do zero: em até 10 segundos aparecerá **Backend indisponível** e **Tentar novamente**, sem dados de mock. Se apenas atualizar a lista enquanto ela já mostrava registros, os últimos itens podem continuar visíveis junto do aviso de erro até a próxima abertura do app.
6. Inicie novamente `mvn spring-boot:run` e use **Tentar novamente**. Os registros anteriores devem reaparecer porque o H2 está em modo file.

O cadastro mantém os campos digitados quando o `POST` falha, permitindo tentar novamente após restaurar a API. Uma lista vazia com o backend ativo é diferente de um erro de conexão: ela mostra **Nenhum alerta registrado**.

### Verificação do código

```bash
cd backend
mvn test

cd ../frontend
npm ci
npx tsc --noEmit
npx expo-doctor
```

## Vídeo da apresentação

**Link do YouTube: pendente de gravação e publicação como Não listado.** Antes da entrega, substituir esta linha pela URL do vídeo; vídeos configurados como **Privado** não poderão ser assistidos pelo professor. Duração máxima: **5 minutos**.

Roteiro sugerido:

1. Mostrar este README, os três repositórios e os integrantes.
2. Iniciar o backend e mostrar `GET /alertas` retornando JSON.
3. Abrir o app e mostrar a lista carregada pela API.
4. Criar um alerta no app e conferir o mesmo registro em `GET /alertas` ou `GET /alertas/{id}`.
5. Parar o backend com `Ctrl+C`.
6. Reabrir o app e mostrar a mensagem de indisponibilidade, sem dados de mock.
