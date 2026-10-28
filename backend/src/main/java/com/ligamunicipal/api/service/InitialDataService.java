package com.ligamunicipal.api.service;

import com.ligamunicipal.api.model.*;
import com.ligamunicipal.api.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InitialDataService {
    private static final String ADMIN_EMAIL = "admin@ligamunicipal.local";
    private static final String OLYMPICS_FC = "Olympics FC";

    private final UsuarioRepository usuarios;
    private final EquipoRepository equipos;
    private final MiembroEquipoRepository miembros;
    private final JugadorPlantillaRepository jugadores;

    private static final List<JugadorInicial> JUGADORES_INICIALES = List.of(
        new JugadorInicial("El Muro", Posicion.POR, null, "8"),
        new JugadorInicial("Manos Seguras", Posicion.POR, Posicion.DEF, "7"),
        new JugadorInicial("El Capi", Posicion.DEF, Posicion.CEN, "8"),
        new JugadorInicial("Rayo", Posicion.DEF, Posicion.DEL, "6"),
        new JugadorInicial("El Jefe", Posicion.DEF, Posicion.CEN, "7"),
        new JugadorInicial("Pulmon", Posicion.DEF, Posicion.CEN, "6"),
        new JugadorInicial("Mago", Posicion.CEN, Posicion.DEL, "9"),
        new JugadorInicial("El Zurdo", Posicion.CEN, Posicion.DEF, "7"),
        new JugadorInicial("Motor", Posicion.CEN, Posicion.DEF, "6"),
        new JugadorInicial("Brujula", Posicion.CEN, Posicion.DEL, "8"),
        new JugadorInicial("El 10", Posicion.CEN, Posicion.DEL, "9"),
        new JugadorInicial("Tanque", Posicion.DEL, Posicion.CEN, "8"),
        new JugadorInicial("Trueno", Posicion.DEL, Posicion.CEN, "7"),
        new JugadorInicial("El Pichichi", Posicion.DEL, null, "10"),
        new JugadorInicial("Comodin", Posicion.DEL, Posicion.DEF, "6")
    );

    public InitialDataService(UsuarioRepository usuarios, EquipoRepository equipos,
                              MiembroEquipoRepository miembros, JugadorPlantillaRepository jugadores) {
        this.usuarios = usuarios;
        this.equipos = equipos;
        this.miembros = miembros;
        this.jugadores = jugadores;
    }

    @Transactional
    public void seed() {
        Usuario admin = usuarios.findByEmailIgnoreCase(ADMIN_EMAIL).orElseGet(() -> {
            var nuevoAdmin = new Usuario();
            nuevoAdmin.nombre = "Administrador";
            nuevoAdmin.email = ADMIN_EMAIL;
            nuevoAdmin.password = "admin123";
            nuevoAdmin.administrador = true;
            return usuarios.save(nuevoAdmin);
        });

        Equipo equipo = equipos.findAll().stream()
            .filter(actual -> OLYMPICS_FC.equalsIgnoreCase(actual.nombre))
            .findFirst()
            .orElseGet(() -> {
                var nuevoEquipo = new Equipo();
                nuevoEquipo.nombre = OLYMPICS_FC;
                nuevoEquipo.codigoInvitacion = "OLYMPICS";
                return equipos.save(nuevoEquipo);
            });

        if (equipo.codigoInvitacion == null) {
            equipo.codigoInvitacion = "OLYMPICS";
        }
        equipo.presupuestoMaximo = BigDecimal.valueOf(100);
        equipos.save(equipo);
        if (miembros.findByEquipoIdAndUsuarioId(equipo.id, admin.id).isEmpty()) {
            var miembro = new MiembroEquipo();
            miembro.equipo = equipo;
            miembro.usuario = admin;
            miembro.rol = RolMiembro.ADMIN;
            miembro.esJugadorReal = false;
            miembros.save(miembro);
        }
        ensureInitialPlayers(equipo);
    }

    @Transactional
    public void ensureInitialPlayers(Equipo equipo) {
        var existentes = jugadores.findByEquipoId(equipo.id);
        for (int index = existentes.size(); index < JUGADORES_INICIALES.size(); index++) {
            var definicion = JUGADORES_INICIALES.get(index);
            var jugador = new JugadorPlantilla();
            jugador.equipo = equipo;
            jugador.apodo = definicion.apodo();
            jugador.posicionPrincipal = definicion.posicionPrincipal();
            jugador.posicionSecundaria = definicion.posicionSecundaria();
            jugador.valorMercadoActual = new BigDecimal(definicion.valorMercado());
            jugadores.save(jugador);
        }
    }

    private record JugadorInicial(String apodo, Posicion posicionPrincipal,
                                  Posicion posicionSecundaria, String valorMercado) { }
}