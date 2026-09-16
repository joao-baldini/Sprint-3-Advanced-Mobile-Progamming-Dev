# SPI Alert API — Sprint 3 🏭

API REST para gestão de **alertas de risco industrial**, desenvolvida com Spring Boot como parte do **SPI Innovation Challenge 2026** — parceria FIAP + SPI.

Nesta Sprint 3, o controller permite requisições do aplicativo Expo por meio de `@CrossOrigin`. Para o roteiro completo de integração, configuração da `BASE_URL` e execução das duas stacks, consulte o `README.md` da raiz da entrega.

O sistema faz parte de uma solução de **Visão Computacional para Proteção Ativa de Funcionários em Ambientes Industriais**, onde câmeras detectam riscos em tempo real (ausência de EPI, posturas perigosas, aproximação de zonas restritas) e registram alertas para gestão e rastreabilidade.

---

## 🎯 Entidade Principal: `Alerta`

Representa um alerta de risco gerado pelo sistema de visão computacional ao identificar uma situação de perigo em ambiente industrial.

| Campo             | Tipo            | Descrição                                                   |
|-------------------|-----------------|-------------------------------------------------------------|
| `id`              | Long            | Identificador único (gerado automaticamente)                |
| `tipo`            | String          | Tipo do risco: `SEM_CAPACETE`, `POSTURA_RISCO`, `ZONA_PERIGOSA`, `SEM_COLETE` |
| `descricao`       | String          | Descrição detalhada do que foi detectado                    |
| `nivelSeveridade` | String          | Nível do risco: `BAIXO`, `MEDIO`, `ALTO`, `CRITICO`        |
| `localizacao`     | String          | Setor ou câmera: `SETOR_A`, `LINHA_PRODUCAO_3`             |
| `cameraId`        | String          | Identificador da câmera que gerou o alerta                  |
| `status`          | String          | Estado atual: `ABERTO`, `EM_ANALISE`, `RESOLVIDO`, `IGNORADO` |
| `dataHoraAlerta`  | LocalDateTime   | Momento em que o risco foi detectado                        |
| `dataHoraRegistro`| LocalDateTime   | Momento do registro no sistema (automático)                 |

---

## 🔗 Endpoints disponíveis

### CRUD Principal

| Método | Endpoint          | Descrição                      | Status de sucesso |
|--------|-------------------|--------------------------------|-------------------|
| POST   | `/alertas`        | Criar novo alerta              | `201 Created`     |
| GET    | `/alertas`        | Listar todos os alertas        | `200 OK`          |
| GET    | `/alertas/{id}`   | Buscar alerta por ID           | `200 OK`          |
| PUT    | `/alertas/{id}`   | Atualizar alerta existente     | `200 OK`          |
| DELETE | `/alertas/{id}`   | Remover alerta                 | `204 No Content`  |

### Filtros adicionais

| Método | Endpoint                          | Descrição                         |
|--------|-----------------------------------|-----------------------------------|
| GET    | `/alertas/severidade/{nivel}`     | Filtrar por nível de severidade   |
| GET    | `/alertas/status/{status}`        | Filtrar por status                |
| GET    | `/alertas/localizacao/{local}`    | Filtrar por localização           |

---

## 🏗️ Arquitetura em camadas

```
src/main/java/br/com/spi/alertapi/
├── AlertApiApplication.java     ← Classe principal (entry point)
├── controller/
│   └── AlertaController.java    ← Recebe requisições HTTP, retorna respostas
├── service/
│   └── AlertaService.java       ← Regras de negócio
├── repository/
│   └── AlertaRepository.java    ← Acesso ao banco de dados (JPA)
└── model/
    └── Alerta.java              ← Entidade / modelo de dados
```

---

## ⚙️ Tecnologias utilizadas

- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Web** — API REST
- **Spring Data JPA** — Persistência
- **Banco H2** — Modo file (dados persistem após reinicialização)
- **Maven** — Gerenciador de dependências

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Java 17 instalado → verificar com: `java -version`
- Maven instalado → verificar com: `mvn -version`
  - Alternativa: usar o Maven Wrapper incluído (`./mvnw`)

### Passo a passo

**1. Clone o repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd spi-alert-api
```

**2. Compile o projeto**
```bash
mvn clean install
```

**3. Execute a aplicação**
```bash
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

**4. Acesse o console do banco H2** *(opcional, para visualizar os dados)*
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/spidb`
- Username: `sa`
- Password: *(deixar em branco)*

---

## 🧪 Como testar no Postman / Insomnia

### 1. POST — Criar um alerta

**URL:** `POST http://localhost:8080/alertas`

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "tipo": "SEM_CAPACETE",
  "descricao": "Funcionário detectado sem capacete de proteção na linha de produção",
  "nivelSeveridade": "ALTO",
  "localizacao": "LINHA_PRODUCAO_3",
  "cameraId": "CAM-003",
  "status": "ABERTO",
  "dataHoraAlerta": "2026-05-21T14:30:00"
}
```
**Resposta esperada:** `201 Created` com o objeto salvo (incluindo `id` e `dataHoraRegistro`).

---

### 2. GET — Listar todos os alertas

**URL:** `GET http://localhost:8080/alertas`

**Resposta esperada:** `200 OK` com lista de alertas em JSON.

---

### 3. GET por ID — Buscar alerta específico

**URL:** `GET http://localhost:8080/alertas/1`

**Resposta esperada:** `200 OK` com o alerta de ID 1.

**Se não existir:** `404 Not Found`.

---

### 4. PUT — Atualizar um alerta

**URL:** `PUT http://localhost:8080/alertas/1`

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "tipo": "SEM_CAPACETE",
  "descricao": "Funcionário detectado sem capacete de proteção na linha de produção",
  "nivelSeveridade": "ALTO",
  "localizacao": "LINHA_PRODUCAO_3",
  "cameraId": "CAM-003",
  "status": "RESOLVIDO",
  "dataHoraAlerta": "2026-05-21T14:30:00"
}
```
**Resposta esperada:** `200 OK` com os dados atualizados.

---

### 5. DELETE — Remover um alerta

**URL:** `DELETE http://localhost:8080/alertas/1`

**Resposta esperada:** `204 No Content`.

**Se não existir:** `404 Not Found`.

---

### 6. GET — Filtros adicionais

```
GET http://localhost:8080/alertas/severidade/ALTO
GET http://localhost:8080/alertas/status/ABERTO
GET http://localhost:8080/alertas/localizacao/SETOR_A
```

---

## 💾 Persistência dos dados

O banco H2 está configurado em **modo file**. Os dados são salvos na pasta `./data/` dentro do projeto.

Isso significa que os dados **não são perdidos** ao reiniciar a aplicação.

---

## 📌 Valores válidos sugeridos

| Campo             | Valores sugeridos                                        |
|-------------------|----------------------------------------------------------|
| `tipo`            | `SEM_CAPACETE`, `SEM_COLETE`, `POSTURA_RISCO`, `ZONA_PERIGOSA`, `SEM_LUVA` |
| `nivelSeveridade` | `BAIXO`, `MEDIO`, `ALTO`, `CRITICO`                     |
| `status`          | `ABERTO`, `EM_ANALISE`, `RESOLVIDO`, `IGNORADO`         |
| `localizacao`     | `SETOR_A`, `SETOR_B`, `LINHA_PRODUCAO_1`, `ALMOXARIFADO` |
