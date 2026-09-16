package br.com.spi.alertapi.repository;

import br.com.spi.alertapi.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório da entidade Alerta.
 *
 * Extende JpaRepository, que já fornece os métodos básicos:
 *   - save()       → criar e atualizar
 *   - findById()   → buscar por ID
 *   - findAll()    → listar todos
 *   - deleteById() → remover por ID
 *   - existsById() → verificar existência
 */
@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    /**
     * Busca alertas por nível de severidade.
     * Ex: findByNivelSeveridade("CRITICO")
     */
    List<Alerta> findByNivelSeveridade(String nivelSeveridade);

    /**
     * Busca alertas por status.
     * Ex: findByStatus("ABERTO")
     */
    List<Alerta> findByStatus(String status);

    /**
     * Busca alertas por localização.
     * Ex: findByLocalizacao("SETOR_A")
     */
    List<Alerta> findByLocalizacao(String localizacao);
}
