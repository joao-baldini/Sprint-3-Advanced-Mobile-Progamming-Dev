package br.com.spi.alertapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:alertas-test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class AlertApiApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void contextLoads() {
    }

    @Test
    void deveCriarListarEBuscarAlertaPorId() throws Exception {
        String novoAlerta = """
                {
                  "tipo": "SEM_CAPACETE",
                  "descricao": "Funcionário detectado sem capacete",
                  "nivelSeveridade": "ALTO",
                  "localizacao": "LINHA_PRODUCAO_3",
                  "cameraId": "CAM-003",
                  "status": "ABERTO",
                  "dataHoraAlerta": "2026-05-21T14:30:00"
                }
                """;

        MvcResult criacao = mockMvc.perform(post("/alertas")
                        .header("Origin", "http://localhost:8081")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(novoAlerta))
                .andExpect(status().isCreated())
                .andExpect(header().string("Access-Control-Allow-Origin", "*"))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.dataHoraRegistro").isNotEmpty())
                .andReturn();

        JsonNode alertaCriado = objectMapper.readTree(criacao.getResponse().getContentAsString());
        long id = alertaCriado.get("id").asLong();

        mockMvc.perform(get("/alertas"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());

        mockMvc.perform(get("/alertas/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.tipo").value("SEM_CAPACETE"))
                .andExpect(jsonPath("$.cameraId").value("CAM-003"));
    }
}
