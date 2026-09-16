package br.com.spi.alertapi.controller;

import br.com.spi.alertapi.model.Alerta;
import br.com.spi.alertapi.service.AlertaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller da entidade Alerta.
 *
 * Responsável por receber as requisições HTTP e retornar as respostas.
 * Não contém regras de negócio — delega tudo ao Service.
 *
 * Base URL: /alertas
 */
@RestController
@RequestMapping("/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    // ==========================================
    // POST /alertas
    // Criar um novo alerta
    // ==========================================

    @PostMapping
    public ResponseEntity<Alerta> criar(@Valid @RequestBody Alerta alerta) {
        Alerta salvo = alertaService.salvar(alerta);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // ==========================================
    // GET /alertas
    // Listar todos os alertas
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Alerta>> listarTodos() {
        List<Alerta> alertas = alertaService.listarTodos();
        return ResponseEntity.ok(alertas);
    }

    // ==========================================
    // GET /alertas/{id}
    // Buscar alerta por ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Alerta> buscarPorId(@PathVariable Long id) {
        try {
            Alerta alerta = alertaService.buscarPorId(id);
            return ResponseEntity.ok(alerta);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==========================================
    // PUT /alertas/{id}
    // Atualizar um alerta existente
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<Alerta> atualizar(@PathVariable Long id,
                                             @Valid @RequestBody Alerta alerta) {
        try {
            Alerta atualizado = alertaService.atualizar(id, alerta);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==========================================
    // DELETE /alertas/{id}
    // Remover um alerta
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            alertaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==========================================
    // GET /alertas/severidade/{nivel}
    // Buscar alertas por nível de severidade
    // ==========================================

    @GetMapping("/severidade/{nivel}")
    public ResponseEntity<List<Alerta>> buscarPorSeveridade(@PathVariable String nivel) {
        List<Alerta> alertas = alertaService.buscarPorSeveridade(nivel);
        return ResponseEntity.ok(alertas);
    }

    // ==========================================
    // GET /alertas/status/{status}
    // Buscar alertas por status
    // ==========================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Alerta>> buscarPorStatus(@PathVariable String status) {
        List<Alerta> alertas = alertaService.buscarPorStatus(status);
        return ResponseEntity.ok(alertas);
    }

    // ==========================================
    // GET /alertas/localizacao/{local}
    // Buscar alertas por localização
    // ==========================================

    @GetMapping("/localizacao/{local}")
    public ResponseEntity<List<Alerta>> buscarPorLocalizacao(@PathVariable String local) {
        List<Alerta> alertas = alertaService.buscarPorLocalizacao(local);
        return ResponseEntity.ok(alertas);
    }
}
