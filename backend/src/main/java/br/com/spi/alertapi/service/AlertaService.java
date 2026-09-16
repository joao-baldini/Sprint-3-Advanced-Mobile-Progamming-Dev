package br.com.spi.alertapi.service;

import br.com.spi.alertapi.model.Alerta;
import br.com.spi.alertapi.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service da entidade Alerta.
 *
 * Camada responsável pelas regras de negócio.
 * O Controller não acessa o Repository diretamente — sempre passa pelo Service.
 */
@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

    // ==========================================
    // CREATE
    // ==========================================

    /**
     * Registra um novo alerta no sistema.
     */
    public Alerta salvar(Alerta alerta) {
        return alertaRepository.save(alerta);
    }

    // ==========================================
    // READ - Listar todos
    // ==========================================

    /**
     * Retorna todos os alertas registrados.
     */
    public List<Alerta> listarTodos() {
        return alertaRepository.findAll();
    }

    // ==========================================
    // READ - Buscar por ID
    // ==========================================

    /**
     * Busca um alerta pelo seu ID.
     * Lança exceção se não encontrado.
     */
    public Alerta buscarPorId(Long id) {
        Optional<Alerta> optional = alertaRepository.findById(id);
        return optional.orElseThrow(() ->
                new RuntimeException("Alerta não encontrado com ID: " + id)
        );
    }

    // ==========================================
    // UPDATE
    // ==========================================

    /**
     * Atualiza os dados de um alerta existente.
     * Verifica se o alerta existe antes de atualizar.
     */
    public Alerta atualizar(Long id, Alerta alertaAtualizado) {
        Alerta alertaExistente = buscarPorId(id);

        alertaExistente.setTipo(alertaAtualizado.getTipo());
        alertaExistente.setDescricao(alertaAtualizado.getDescricao());
        alertaExistente.setNivelSeveridade(alertaAtualizado.getNivelSeveridade());
        alertaExistente.setLocalizacao(alertaAtualizado.getLocalizacao());
        alertaExistente.setCameraId(alertaAtualizado.getCameraId());
        alertaExistente.setStatus(alertaAtualizado.getStatus());
        alertaExistente.setDataHoraAlerta(alertaAtualizado.getDataHoraAlerta());

        return alertaRepository.save(alertaExistente);
    }

    // ==========================================
    // DELETE
    // ==========================================

    /**
     * Remove um alerta pelo ID.
     * Verifica se o alerta existe antes de remover.
     */
    public void deletar(Long id) {
        Alerta alerta = buscarPorId(id);
        alertaRepository.delete(alerta);
    }

    // ==========================================
    // Buscas adicionais (usando métodos do Repository)
    // ==========================================

    public List<Alerta> buscarPorSeveridade(String nivelSeveridade) {
        return alertaRepository.findByNivelSeveridade(nivelSeveridade);
    }

    public List<Alerta> buscarPorStatus(String status) {
        return alertaRepository.findByStatus(status);
    }

    public List<Alerta> buscarPorLocalizacao(String localizacao) {
        return alertaRepository.findByLocalizacao(localizacao);
    }
}
