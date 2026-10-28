package com.ligamunicipal.api.web;

import java.math.BigDecimal;
import java.util.UUID;

public record RankingItemDto(
        UUID miembroId,
        String nombre,
        String avatar,
        BigDecimal puntosTotales,
        int puesto,
        boolean esUsuarioActual,
        int variacionPuestos) {
}
