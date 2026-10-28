package com.ligamunicipal.api.web;

import com.ligamunicipal.api.model.AlineacionFantasy;
import com.ligamunicipal.api.service.LigaService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ManagerController {
    private final LigaService service;

    public ManagerController(LigaService service) {
        this.service = service;
    }

    @GetMapping("/partidos/{partidoId}/estado")
    public List<Map<String, Object>> estado(@PathVariable UUID partidoId, @RequestHeader("X-User-Id") UUID usuarioId) {
        return service.estadoPartido(partidoId, usuarioId);
    }

    @PostMapping("/partidos/{partidoId}/alineacion")
    public AlineacionFantasy alineacion(@PathVariable UUID partidoId, @RequestBody AlineacionFantasy alineacion, @RequestHeader("X-User-Id") UUID usuarioId) {
        var partido = service.partidos.findById(partidoId).orElseThrow();
        var miembro = service.miembros.findByEquipoIdAndUsuarioId(partido.equipo.id, usuarioId).orElseThrow();
        return service.guardarAlineacion(partidoId, miembro.id, alineacion, usuarioId);
    }

    @GetMapping("/equipos/{equipoId}/ranking")
    public List<RankingItemDto> ranking(@PathVariable UUID equipoId, @RequestHeader("X-User-Id") UUID usuarioId) {
        return service.ranking(equipoId, usuarioId);
    }

    @PostMapping("/partidos/{partidoId}/cerrar-jornada")
    public Object cerrarJornada(@PathVariable UUID partidoId, @RequestHeader("X-User-Id") UUID usuarioId) {
        return service.cerrarJornada(partidoId, usuarioId);
    }
}
