# Avance: Mi equipo y Ranking

**Fecha:** 27 de octubre de 2026  
**Alcance:** estado actual de las funcionalidades **Mi equipo** y **Ranking** en frontend y backend.

## Resumen

Las dos funcionalidades ya tienen navegación y conexión con la API:

- **Mi equipo** cuenta con una pantalla interactiva para preparar la alineación de una jornada, gestionar la asistencia y guardar la alineación.
- **Ranking** consulta los miembros del equipo y muestra su clasificación acumulada por puntos.

El flujo de Mi equipo está más desarrollado. Ranking dispone de la consulta y visualización básica, pero todavía necesita completar la variación de puestos, el historial y algunos estados de interfaz.

## Mi equipo

### Funcionalidad implementada

La pantalla está implementada en `frontend/src/app/pages/plantilla.component.ts` como `PlantillaComponent`.

Actualmente permite:

- Cargar el primer equipo disponible del usuario.
- Cargar los partidos del equipo y seleccionar la primera jornada disponible.
- Mostrar rival, jornada, fecha, hora y ubicación del partido.
- Mostrar una cuenta atrás hasta el comienzo del partido.
- Bloquear la edición cuando la jornada ya ha comenzado.
- Consultar el estado de todos los jugadores de la plantilla.
- Marcar la asistencia del jugador propio como `JUEGA` o `NO_JUEGA`.
- Seleccionar jugadores compatibles con cada posición:
  - `POR`: portero.
  - `DEF`: defensa.
  - `CEN`: centro.
  - `DEL`: delantero.
- Seleccionar formaciones según el formato del equipo.
- Mostrar los huecos disponibles sobre el campo.
- Controlar el presupuesto gastado y el presupuesto restante.
- Impedir la selección de jugadores cuyo valor exceda el presupuesto disponible.
- Seleccionar o quitar jugadores de la alineación.
- Designar un capitán pulsando sobre un jugador situado en el campo.
- Mostrar jugadores que no juegan y marcar su ausencia visualmente.
- Validar que exista un capitán antes de guardar.
- Mostrar mensajes de éxito o error después de guardar la alineación.

### Flujo frontend

1. `LigaApi.equipos()` obtiene los equipos disponibles.
2. `LigaApi.partidos(equipo.id)` obtiene las jornadas del equipo.
3. Se selecciona el primer partido devuelto.
4. `LigaApi.estadoPartido(partido.id)` obtiene jugadores, asistencias e historial de mercado.
5. El usuario configura formación, jugadores y capitán.
6. `LigaApi.actualizarAsistencia(...)` actualiza la disponibilidad del jugador propio.
7. `LigaApi.guardarAlineacion(...)` envía la formación y los detalles seleccionados.

### Reglas aplicadas en frontend

- La edición se deshabilita cuando la cuenta atrás llega a `CERRADO`.
- Un jugador solo puede aparecer una vez en la alineación.
- Un jugador debe ser compatible con la posición seleccionada.
- No se puede superar el presupuesto máximo del equipo.
- No se puede guardar sin capitán.
- Al cambiar de formación, se eliminan los jugadores que ya no caben en los nuevos huecos.
- La pantalla avisa cuando faltan jugadores para completar la alineación.

### Backend y persistencia

Los endpoints están definidos en `backend/src/main/java/com/ligamunicipal/api/web/ManagerController.java`:

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/api/partidos/{partidoId}/estado` | Consulta jugadores, asistencia e historial de mercado. |
| `POST` | `/api/partidos/{partidoId}/alineacion` | Guarda la alineación de un miembro para una jornada. |
| `POST` | `/api/partidos/{partidoId}/jugadores/{jugadorId}/asistencia` | Actualiza la asistencia de un jugador. |

La lógica está en `backend/src/main/java/com/ligamunicipal/api/service/LigaService.java`.

El guardado de alineación actualmente valida que:

- La jornada todavía no haya comenzado.
- El miembro pertenezca al equipo de la jornada.
- La alineación tenga exactamente un capitán.
- Los jugadores existan y pertenezcan al equipo.
- No haya jugadores repetidos.
- El presupuesto total no supere `Equipo.presupuestoMaximo`.

La información se persiste principalmente mediante:

- `AlineacionFantasy`: formación, presupuesto gastado, puntos de jornada y fecha de guardado.
- `DetalleAlineacion`: jugador, posición asignada, capitán y puntos obtenidos.
- `AsistenciaPartido`: estado de asistencia y fecha de respuesta.
- `JugadorPlantilla`: posición, valor de mercado, media de puntos y variación de mercado.
- `MiembroEquipo`: relación del usuario con el equipo y jugador propio.

## Ranking

### Funcionalidad implementada

La pantalla está implementada en `frontend/src/app/pages/ranking.component.ts` como `RankingComponent`.

Actualmente permite:

- Acceder a Ranking desde la navegación inferior de `AppComponent`.
- Obtener los equipos disponibles mediante `LigaApi.equipos()`.
- Consultar el ranking del primer equipo disponible.
- Mostrar una lista de miembros con:
  - Puesto visual calculado por el índice de la lista.
  - Nombre del usuario.
  - Puntos totales.
  - Indicador de variación de puestos.
- Mostrar un estado vacío cuando no hay registros: `Aún no hay puntos registrados.`

El método utilizado en el servicio frontend es:

```typescript
ranking(id: string) {
  return this.http.get<any[]>(`${this.base}/equipos/${id}/ranking`, this.options());
}
```

### Backend del ranking

El endpoint está definido en `ManagerController`:

```text
GET /api/equipos/{equipoId}/ranking
```

`LigaService.ranking(equipoId)`:

- Obtiene los miembros del equipo.
- Los ordena de mayor a menor por `MiembroEquipo.puntosTotales`.
- Devuelve el identificador del miembro, el nombre, los puntos totales y `posicionActualRanking`.

Los campos principales del modelo son:

- `MiembroEquipo.puntosTotales`: puntuación acumulada.
- `MiembroEquipo.posicionActualRanking`: posición almacenada actualmente.
- `HistorialRanking.puntosAcumulados`: puntos acumulados en una jornada histórica.
- `HistorialRanking.puestoRanking`: puesto histórico.
- `HistorialRanking.variacionPuestos`: variación histórica de puestos.

## Pendientes y diferencias detectadas

### 1. Diferencia entre la respuesta backend y la vista frontend

La vista de Ranking intenta leer `variacionPuestos`, pero `LigaService.ranking(...)` devuelve `puesto` y no devuelve `variacionPuestos`.

Resultado actual:

- El nombre y los puntos se muestran correctamente.
- El indicador de variación termina mostrando `0 puestos` porque el campo esperado no llega en la respuesta.

**Pendiente:** decidir si el endpoint debe devolver `variacionPuestos` desde el historial o si la vista debe mostrar el puesto actual.

### 2. El historial de ranking todavía no participa en el cálculo

Existe la entidad `HistorialRanking` y su repositorio, pero el método actual `LigaService.ranking(...)` calcula la respuesta directamente desde `MiembroEquipo`.

**Pendiente:** registrar y consultar el historial por jornada si se quiere mostrar evolución real, puesto anterior y variación.

### 3. Selección del equipo actual

Tanto Mi equipo como Ranking utilizan el primer elemento de la respuesta de `equipos()`:

```typescript
const equipo = equipos[0];
```

**Pendiente:** incorporar un selector o un contexto de equipo activo si un usuario puede pertenecer a varios equipos.

### 4. Estados de carga y error en Ranking

Ranking no muestra un estado de carga ni un mensaje específico cuando falla la petición HTTP.

**Pendiente:** añadir estados `loading`, `error` y una acción de reintento.

### 5. Autorización de operaciones

El guardado de alineación valida la pertenencia del miembro al equipo. La actualización de asistencia y la consulta de ranking tienen una validación más limitada en los controladores actuales.

**Pendiente:** revisar las reglas de autorización para garantizar que un usuario solo pueda modificar su propia asistencia y consultar equipos permitidos.

### 6. Cálculo de puntos

La estructura de datos para puntos está preparada, pero en el código revisado no se observa todavía un proceso completo que calcule los puntos de una jornada, actualice `puntosTotales` y genere `HistorialRanking`.

**Pendiente:** implementar o completar el cierre de jornada y la actualización de la clasificación.

## Archivos clave

| Área | Archivo | Responsabilidad |
|---|---|---|
| Mi equipo | `frontend/src/app/pages/plantilla.component.ts` | Interfaz y reglas de selección de alineación. |
| Ranking | `frontend/src/app/pages/ranking.component.ts` | Consulta y visualización de la clasificación. |
| API frontend | `frontend/src/app/services/liga-api.service.ts` | Métodos HTTP para equipos, jornadas, asistencia, alineación y ranking. |
| Navegación | `frontend/src/app/app.component.ts` | Enlaces a Mi equipo y Ranking. |
| API backend | `backend/src/main/java/com/ligamunicipal/api/web/ManagerController.java` | Endpoints de gestión de jornada, alineación y ranking. |
| Servicios | `backend/src/main/java/com/ligamunicipal/api/service/LigaService.java` | Reglas de negocio y persistencia. |
| Alineación | `backend/src/main/java/com/ligamunicipal/api/model/AlineacionFantasy.java` | Cabecera de la alineación guardada. |
| Detalle | `backend/src/main/java/com/ligamunicipal/api/model/DetalleAlineacion.java` | Jugadores y posiciones de la alineación. |
| Equipo | `backend/src/main/java/com/ligamunicipal/api/model/MiembroEquipo.java` | Usuario, jugador propio y puntos del ranking. |
| Historial | `backend/src/main/java/com/ligamunicipal/api/model/HistorialRanking.java` | Datos históricos de puesto y variación. |

## Próximos pasos recomendados

1. Corregir el contrato de Ranking para que frontend y backend utilicen los mismos nombres de campos.
2. Implementar la generación de puntos y del historial al cerrar una jornada.
3. Añadir pruebas para presupuesto, capitán, jugadores repetidos, jornada bloqueada y actualización de asistencia.
4. Añadir pruebas de contrato para la respuesta de Ranking.
5. Añadir selección de equipo activo y estados de carga/error en Ranking.
6. Revisar la autorización de los endpoints de asistencia y ranking.
