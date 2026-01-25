# FoxCode Frontend 21 - Arquitectura Limpia

Este proyecto es una aplicación Angular 21 construida con **Arquitectura Limpia (Clean Architecture)**, utilizando las últimas características de Angular como Signals, componentes standalone y control flow moderno.

## 🚀 Características Principales

- ✨ **Angular 21** con componentes standalone
- 🎯 **Arquitectura Limpia** (4 capas: Domain, Application, Infrastructure, Presentation)
- 🔐 **Autenticación JWT** con refresh token automático
- 📊 **Signals** para gestión de estado reactivo
- 🔌 **WebSocket** para actualizaciones en tiempo real
- 🎨 **Tailwind CSS 4** para estilos
- 📱 **Diseño Responsive** con dark mode
- 🧩 **Componentes Reutilizables** (Card, Input, Button, etc.)
- ⚡ **Optimización** con lazy loading y preloading
- 🔄 **RxJS** para manejo de streams asíncronos

## 📚 Documentación

### Guías de Inicio
- [🚀 Quick Start Guide](docs/QUICK_START.md) - Inicio rápido en 5 minutos
- [🛠️ Comandos Útiles](docs/USEFUL_COMMANDS.md) - Comandos de desarrollo y debugging

### Arquitectura
- [📋 Estructura Completa de Usuarios](docs/USERS_COMPLETE_STRUCTURE.md) - Resumen visual completo
- [🏗️ Arquitectura de Usuarios](docs/USERS_ARCHITECTURE.md) - Detalles técnicos detallados
- [🔌 Especificación API Backend](docs/BACKEND_API_SPEC.md) - Endpoints y contratos

## 🏗️ Estructura del Proyecto

```
src/app/
├── core/                           # NÚCLEO DE LA APLICACIÓN
│   ├── domain/                     # Capa de Dominio (Contratos)
│   │   ├── interfaces/             # Entidades y DTOs
│   │   ├── repositories/           # Contratos de repositorios
│   │   └── services/               # Contratos de servicios
│   │
│   ├── application/                # Capa de Aplicación (Casos de Uso)
│   │   └── use-cases/              # Lógica de negocio
│   │       ├── auth/
│   │       └── users/
│   │
│   └── infrastructure/             # Capa de Infraestructura (Implementaciones)
│       ├── repositories/           # Implementaciones HTTP/Storage
│       ├── services/               # Servicios (Socket, etc.)
│       ├── interceptors/           # Interceptores HTTP
│       ├── guards/                 # Guards de rutas
│       └── config/                 # Configuraciones
│
├── features/                       # MÓDULOS DE FUNCIONALIDADES
│   ├── auth/                       # Autenticación
│   │   └── login/
│   ├── admin/                      # Módulo de Administración
│   │   └── users/                  # ✅ Gestión de Usuarios
│   └── business-units/             # Unidades de Negocio
│       ├── home/
│       ├── microsoft/
│       ├── lvo/
│       └── starr/
│
├── shared/                         # COMPONENTES COMPARTIDOS
│   ├── components/                 # Componentes reutilizables
│   │   ├── button/                 # ✅ Botón configurable
│   │   ├── card/                   # ✅ Tarjeta contenedora
│   │   ├── input/                  # ✅ Input con validaciones
│   │   └── header-tool/            # ✅ Header de herramientas
│   ├── layouts/                    # Layouts de aplicación
│   │   ├── layout-template/
│   │   ├── header/
│   │   └── sidebar/
│   └── validators/                 # Validadores custom
│
└── environments/                   # Configuraciones de entorno
    ├── environment.ts
    └── environment.prod.ts
```

## 🔄 Clean Architecture - Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Components, Templates)              │
│  features/admin/users/users.ts                           │
└────────────────────┬────────────────────────────────────┘
                     │ inject
                     ▼
┌─────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Use Cases)                           │
│  core/application/use-cases/users/get-users.use-case.ts │
└────────────────────┬────────────────────────────────────┘
                     │ inject
                     ▼
┌─────────────────────────────────────────────────────────┐
│  DOMAIN LAYER (Interfaces, Contracts)                    │
│  core/domain/repositories/user.repository.ts             │
└────────────────────┬────────────────────────────────────┘
                     │ implements
                     ▼
┌─────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE LAYER (Implementations)                  │
│  core/infrastructure/repositories/user-api.repository.ts │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm 11+
- Angular CLI 21+

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
cd FOXCODE_FRONTEND_21
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:14011`

### Variables de Entorno

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  userURL: 'http://localhost:20024',  // URL del backend
  mode: 'UAT',                        // UAT o PROD
  BUSINESS_UNIT: 'Microsoft',         // Microsoft, LVO, Starr
};
```

## 📦 Scripts Disponibles

```bash
npm start              # Inicia el servidor de desarrollo
npm run build          # Build de producción
npm run build:dev      # Build de desarrollo
npm test               # Ejecuta tests con Vitest
npm run lint           # Verifica código con ESLint
npm run optimize:images # Optimiza imágenes con Sharp
```

## 🧩 Componentes Principales

### Card Component
```typescript
<foxcode-card [padding]="'lg'" [shadow]="'md'" [rounded]="'lg'">
  <h2>Título</h2>
  <p>Contenido de la tarjeta</p>
</foxcode-card>
```

### Input Component
```typescript
<foxcode-input
  icon="ri-search-2-line"
  placeholder="Buscar usuario"
  [control]="searchControl"
  [showClear]="true"
  [showCopy]="true">
</foxcode-input>
```

### Button Component
```typescript
<foxcode-button 
  label="Guardar"
  variant="primary"
  size="md"
  icon="ri-save-line"
  [loading]="isLoading"
  (click)="save()">
</foxcode-button>
```

## 🔌 WebSocket en Tiempo Real

El sistema incluye soporte para WebSocket usando Socket.io:

```typescript
// Conectar al socket
this.userSocketService.connect(token);

// Escuchar eventos
this.userSocketService.onUserCreated()
  .subscribe(user => {
    this.users.update(users => [user, ...users]);
  });

// Emitir eventos
this.userSocketService.emit('custom-event', data);
```

## 🎨 Temas y Estilos

### Dark Mode
El proyecto incluye soporte completo para dark mode usando Tailwind CSS:

```html
<div class="bg-white dark:bg-[#3a3a3a]">
  <p class="text-gray-900 dark:text-white">Texto adaptable</p>
</div>
```

### Colores Personalizados
Definidos en `styles/_variables.scss`:

```scss
:root {
  --color-foxcode: #ff8c00;
  --color-content-bg: #f5f5f5;
}

.dark {
  --color-content-bg: #303030;
}
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:cov

# Tests en modo watch
npm run test:watch
```

## 🏗️ Build para Producción

```bash
# Build optimizado
npm run build

# Los archivos estarán en dist/
# Servir con cualquier servidor estático:
npx http-server dist/foxcode-frontend -p 8080
```

## 📖 Guías Adicionales

### Para Desarrolladores Nuevos
1. Lee [Quick Start Guide](docs/QUICK_START.md)
2. Revisa [Estructura Completa](docs/USERS_COMPLETE_STRUCTURE.md)
3. Explora [Comandos Útiles](docs/USEFUL_COMMANDS.md)

### Para Desarrolladores Experimentados
1. Lee [Arquitectura de Usuarios](docs/USERS_ARCHITECTURE.md)
2. Consulta [Especificación API](docs/BACKEND_API_SPEC.md)
3. Implementa nuevos módulos siguiendo el patrón establecido

## 🤝 Contribuir

1. Mantén la separación de capas de Clean Architecture
2. Usa TypeScript types en todo momento
3. Sigue las convenciones de nombrado establecidas
4. Documenta cambios importantes
5. Escribe tests para lógica crítica

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🆘 Soporte

Para preguntas o problemas:
- Consulta la [documentación completa](docs/)
- Revisa [Comandos Útiles](docs/USEFUL_COMMANDS.md)
- Contacta al equipo de desarrollo
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
