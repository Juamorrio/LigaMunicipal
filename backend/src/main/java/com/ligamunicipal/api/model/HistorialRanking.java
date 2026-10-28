package com.ligamunicipal.api.model; import jakarta.persistence.*; import java.math.*;
@Entity public class HistorialRanking extends BaseEntity { @ManyToOne(optional=false) public MiembroEquipo miembro; @ManyToOne(optional=false) public PartidoJornada partido; public BigDecimal puntosAcumulados; public int puestoRanking; public int variacionPuestos; }
