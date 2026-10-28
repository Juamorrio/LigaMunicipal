# Liga Municipal / Onzegol

Monorepo para fantasy de equipos amateurs: backend Spring Boot 3.4 + Java 21 y frontend Angular standalone.

## Arranque rapido

```powershell
# Backend (H2 en memoria)
cd backend
mvn spring-boot:run

# Frontend (otra terminal)
cd frontend
npm install
npm start
```
Abre http://localhost:4200. La API queda en http://localhost:8080 y H2 en `/h2-console`.

## Login demo

La aplicación inicia con un usuario administrador dummy:

- Email: `admin@ligamunicipal.local`
- Contraseña: `admin123`

El login es una sesión básica de demostración almacenada en el navegador; no sustituye una autenticación de producción con hash de contraseñas, JWT o gestión de sesiones.

## Administración del equipo

Tras iniciar sesión, el panel inicial permite:

- Crear el equipo con nombre, color, formato, presupuesto e indicación de jugador activo.
- Añadir jugadores con posición principal, posición secundaria y precio inicial.
- Abrir o cerrar la encuesta de precios iniciales. Al cerrarla se calcula la media de las propuestas recibidas y se registra el valor inicial de mercado.
- Registrar jornadas con rival, ubicación y fecha/hora.

En esta iteración la autorización usa temporalmente la cabecera `X-User-Id`, obtenida del usuario demo guardado en el navegador. La migración a JWT/Spring Security queda pendiente para producción.

## PostgreSQL

`docker compose up -d postgres` y arranca con `mvn spring-boot:run -Dspring-boot.run.profiles=postgres`.

La API incluye equipos, checklist, plantilla, partidos, asistencia, alineaciones con bloqueo y presupuesto, votos -2..10 y MVP, historial de mercado/ranking y CORS para Angular.
