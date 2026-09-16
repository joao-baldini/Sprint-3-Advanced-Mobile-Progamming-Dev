package br.com.spi.alertapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * Entidade principal do sistema.
 *
 * Representa um alerta gerado pelo sistema de visão computacional
 * ao detectar risco de segurança em ambiente industrial.
 *
 * Exemplos de alertas:
 *   - Funcionário sem capacete detectado
 *   - Postura de risco ergonômico identificada
 *   - Aproximação de zona perigosa
 */
@Entity
@Table(name = "alertas")
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tipo do alerta detectado pela câmera.
     * Ex: "SEM_CAPACETE", "POSTURA_RISCO", "ZONA_PERIGOSA", "SEM_COLETE"
     */
    @NotBlank(message = "O tipo do alerta é obrigatório")
    @Column(nullable = false)
    private String tipo;

    /**
     * Descrição detalhada do que foi detectado.
     */
    @NotBlank(message = "A descrição é obrigatória")
    @Column(nullable = false, length = 500)
    private String descricao;

    /**
     * Nível de severidade do risco detectado.
     * Ex: "BAIXO", "MEDIO", "ALTO", "CRITICO"
     */
    @NotBlank(message = "O nível de severidade é obrigatório")
    @Column(nullable = false)
    private String nivelSeveridade;

    /**
     * Localização da câmera ou setor da fábrica onde o alerta foi gerado.
     * Ex: "SETOR_A", "LINHA_PRODUCAO_3", "ALMOXARIFADO"
     */
    @NotBlank(message = "A localização é obrigatória")
    @Column(nullable = false)
    private String localizacao;

    /**
     * Identificador da câmera que gerou o alerta.
     */
    @Column(name = "camera_id")
    private String cameraId;

    /**
     * Status atual do alerta.
     * Ex: "ABERTO", "EM_ANALISE", "RESOLVIDO", "IGNORADO"
     */
    @NotBlank(message = "O status é obrigatório")
    @Column(nullable = false)
    private String status;

    /**
     * Momento exato em que o alerta foi gerado pelo sistema.
     */
    @NotNull
    @Column(name = "data_hora_alerta", nullable = false)
    private LocalDateTime dataHoraAlerta;

    /**
     * Momento em que o alerta foi registrado no sistema (preenchido automaticamente).
     */
    @Column(name = "data_hora_registro", updatable = false)
    private LocalDateTime dataHoraRegistro;

    // ==========================================
    // Lifecycle callbacks
    // ==========================================

    @PrePersist
    public void prePersist() {
        this.dataHoraRegistro = LocalDateTime.now();
        if (this.dataHoraAlerta == null) {
            this.dataHoraAlerta = LocalDateTime.now();
        }
    }

    // ==========================================
    // Construtores
    // ==========================================

    public Alerta() {}

    public Alerta(String tipo, String descricao, String nivelSeveridade,
                  String localizacao, String cameraId, String status,
                  LocalDateTime dataHoraAlerta) {
        this.tipo = tipo;
        this.descricao = descricao;
        this.nivelSeveridade = nivelSeveridade;
        this.localizacao = localizacao;
        this.cameraId = cameraId;
        this.status = status;
        this.dataHoraAlerta = dataHoraAlerta;
    }

    // ==========================================
    // Getters e Setters
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getNivelSeveridade() {
        return nivelSeveridade;
    }

    public void setNivelSeveridade(String nivelSeveridade) {
        this.nivelSeveridade = nivelSeveridade;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getCameraId() {
        return cameraId;
    }

    public void setCameraId(String cameraId) {
        this.cameraId = cameraId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDataHoraAlerta() {
        return dataHoraAlerta;
    }

    public void setDataHoraAlerta(LocalDateTime dataHoraAlerta) {
        this.dataHoraAlerta = dataHoraAlerta;
    }

    public LocalDateTime getDataHoraRegistro() {
        return dataHoraRegistro;
    }

    public void setDataHoraRegistro(LocalDateTime dataHoraRegistro) {
        this.dataHoraRegistro = dataHoraRegistro;
    }
}
