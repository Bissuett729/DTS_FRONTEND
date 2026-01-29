# Foxcode Frontend | Manual Extenso del Desarrollador 📘🚀

Este documento proporciona una visión detallada de la arquitectura, configuración y herramientas disponibles en el proyecto Foxcode Frontend. Está diseñado para servir como referencia principal para cualquier desarrollador que trabaje en el sistema.

---

## 🏗️ 1. Arquitectura del Proyecto

El proyecto se basa en una estructura **Clean Architecture** adaptada para Angular, separando responsabilidades en capas lógicas:

### 📂 Capa de Dominio (`src/app/core/domain`)

Define "el qué" del negocio sin preocuparse por "el cómo".

- **`interfaces/`**: Contratos de datos (User, Tool, Department, etc.).
- **`repositories/`**: Clases abstractas que definen los métodos de acceso a datos.

### 📂 Capa de Aplicación (`src/app/core/application`)

Contiene la lógica de negocio y los orquestadores.

- **`services/`**: Servicios globales como `AuthService` y `GlobalStateService`.
- **`use-cases/`**: Clases con una única responsabilidad (ej: `LoginUseCase`, `GetProfileUseCase`).

### 📂 Capa de Infraestructura (`src/app/core/infrastructure`)

Implementaciones técnicas y herramientas de bajo nivel.

- **`repositories/`**: Implementaciones concretas de los contratos de dominio (usualmente llamadas HTTP).
- **`services/socket.service.ts`**: Motor base para WebSockets.
- **`guards/`**: Lógica de protección de rutas (`auth.guard`, `no-auth.guard`).

### 📂 Capa Compartida (`src/app/shared`)

Recursos reutilizables.

- **`components/`**: UI Genérica (loaders, botones, etc.).
- **`layouts/`**: Estructuras de página (Header, Sidebar, Layout Template).
- **`services/`**: Managers de sockets específicos y utilidades como `AlertService`.

---

## ⚙️ 2. Configuración y Variables Globales

### 🌍 Environment (`src/environments/environment.ts`)

El sistema utiliza una configuración dinámica basada en la IP de acceso:

| Variable          | Propósito                              | Valor Común          |
| :---------------- | :------------------------------------- | :------------------- |
| `IP`              | IP detectada del cliente               | Dinámico             |
| `BUSINESS_UNIT`   | Unidad de negocio actual               | 'Microsoft' / 'LVO'  |
| `mode`            | Entorno de despliegue                  | 'UAT' / 'PROD'       |
| `userURL`         | Endpoint del microservicio de usuarios | `http://${ip}:20024` |
| `environmentName` | Etiqueta de entorno                    | 'development'        |

### 🔑 LocalStorage

El proyecto utiliza claves específicas para persistir el estado entre recargas:

- `user`: Datos del perfil del usuario (JSON).
- `accessToken`: JWT para peticiones autenticadas.
- `theme`: Preferencia visual ('light' / 'dark').
- `language`: Idioma preferido ('es', 'en').

---

## 🧠 3. Gestión de Estado Global (Signals)

Ubicación: `src/app/core/application/services/global-state.service.ts`

El `GlobalStateService` es el **Single Source of Truth** del frontend. Utiliza Angular Signals para reactividad de alto rendimiento.

### 💠 Auth Slice

- `currentUser`: Signal con el objeto `IUser`.
- `isAuthenticated`: Booleano derivado de la presencia del usuario.
- `authLoading`: Estado de carga para formularios de login.

### 💠 App Slice

- `theme`: Controla si estamos en modo oscuro o claro.
- `sidebarCollapsed`: Estado del menú lateral.
- `isLoadingPage`: Controla el loader de pantalla completa.
- `isRouting`: Indica si Angular está navegando entre rutas.

### 🔄 Persistencia Automática

El servicio usa la función `effect()` para sincronizar automáticamente cualquier cambio en los Signals con el `localStorage`. **No necesitas llamar a localStorage manualmente.**

---

## 🔌 4. WebSockets y Tiempo Real

El sistema de sockets está diseñado para ser modular y tipado.

### 🏗️ Clase Base: `GenericSocketManager`

Ubicación: `src/app/core/infrastructure/services/generic-socket-manager.service.ts`

Todos los managers de sockets (`UsersSocketManager`, `ToolsSocketManager`, etc.) heredan de esta clase, la cual provee:

- Conexión automática con Token.
- Auto-unión a "Rooms".
- Gestión de ciclo de vida (auto-desuscripción en `destroy$`).

### 📡 Sockets Disponibles

| Manager                          | Room            | Eventos Principales                            |
| :------------------------------- | :-------------- | :--------------------------------------------- |
| **`UsersSocketManager`**         | `users`         | `user:created`, `user:updated`, `user:deleted` |
| **`ToolsSocketManager`**         | `tools`         | `tool:created`, `tool:updated`, `tool:deleted` |
| **`NotificationsSocketManager`** | `notifications` | `notification:received`, `notification:read`   |
| **`DeptsSocketManager`**         | `departments`   | `dept:updated`                                 |

### 🚀 Ejemplo de Implementación

```typescript
// Vincular en el OnInit de un Layout o Componente global
this.toolsSocket.connect();
this.toolsSocket.onToolUpdated((data) => {
  devLog('Tool actualizada!', data);
});
```

---

## 🛠️ 5. Helpers y Servicios de Utilidad

### 📢 `AlertService` (SweetAlert2)

Un wrapper estandarizado para notificaciones visuales.

- `success(title, msg)`: Alerta modal de éxito.
- `error(title, msg)`: Alerta modal de error.
- `infoToast(msg)`: Notificación pequeña y rápida en la parte superior.
- `confirm(title, msg)`: Diálogo que devuelve una promesa (resolve en 'confirmar', reject en 'cancelar').

### 📝 `devLog`

- Ubicación: `src/app/shared/helpers/dev-logs.log.ts`
- Uso: `devLog('Mensaje', data)`.
- **Ventaja**: El log desaparece automáticamente en el build de producción, manteniendo la consola del usuario final limpia.

---

## 🧩 6. Flujos de Trabajo Comunes

### Sincronización de Perfil

Si necesitas forzar una actualización de los datos del usuario desde el servidor (por ejemplo, después de una edición):

```typescript
private authService = inject(AuthService);

this.authService.refreshUserData(); // Esto dispara la petición y actualiza el GlobalState automáticamente.
```

### Cambio de Tema

```typescript
private globalState = inject(GlobalStateService);

this.globalState.toggleTheme(); // Cambia el switch y aplica la clase .dark al HTML.
```

### Navegación con Loading

El `LayoutTemplate` detecta automáticamente los eventos del router. Sin embargo, para procesos manuales largos:

```typescript
this.globalState.setLoadingPage(true); // Muestra el loader de Foxcode
// ... proceso ...
this.globalState.setLoadingPage(false); // Oculta el loader
```

---

## 📝 7. Guía de Estilo y Mejores Prácticas

1.  **Inyección**: Usa `inject()` de `@angular/core` en lugar del constructor siempre que sea posible. Es más limpio y compatible con funciones standalone.
2.  **Signals vs Observables**:
    - Usa **Signals** para estado síncrono que la UI consume.
    - Usa **Observables** (RxJS) para flujos asíncronos (HTTP, Sockets).
3.  **Desacoplamiento**: Los componentes deben obtener el usuario de `GlobalStateService`, no de `AuthService`. `AuthService` solo se inyecta para disparar **acciones** (login, logout, refresh).

---

© 2026 Foxcode Development Team | Advanced Architecture Division.
