# 🐾 VetSalud · Sistema de gestión veterinaria

Aplicación web desarrollada en **Angular 22 + TypeScript** para digitalizar la atención de una clínica veterinaria: registro de dueños y mascotas, agenda de citas con control de horarios y historial clínico por mascota.

> Proyecto de la evaluación parcial del curso **Desarrollo de Interfaces 3** — Instituto IDAT, carrera Desarrollo de Sistemas Front-end y Back-end (2026).
> Integrantes: Grisel Dayana Merino Garcia · Araceli Yobana Porras Leon · Rodrigo Enrique Pichilingue Valverde.
> Docente: José Manuel Inga Nerio.

---

## 1. Problema que resuelve

| Situación actual en la clínica | Solución en VetSalud |
|---|---|
| Las citas se agendan por teléfono y las líneas se saturan | Módulo **Citas** con formulario reactivo y agenda ordenada por fecha y hora |
| No hay control digital de horarios: se cruzan turnos | Validador de grupo que **bloquea horarios ocupados** en tiempo real y muestra las horas tomadas del día |
| No existe historial de las mascotas | Módulo **Historial clínico** con línea de tiempo filtrable por mascota |
| Datos de clientes incompletos o mal escritos | Validaciones de DNI, celular, correo, fechas y textos con mensajes claros |

## 2. Funcionalidades

- **Inicio (Dashboard):** indicadores del día (dueños, mascotas, citas de hoy, consultas) y lista de **próximas citas** resaltadas por cercanía.
- **Dueños:** registro con validaciones (DNI de 8 dígitos y no repetido, celular peruano, correo), listado y eliminación protegida (no se elimina un dueño con mascotas).
- **Mascotas:** registro asociado a un dueño, cálculo automático de la **edad**, búsqueda por nombre/especie/raza.
- **Citas:** agenda con horario de atención 08:00–20:00, detección de **horario ocupado**, cambio de estado (Pendiente, Confirmada, Atendida, Cancelada), filtro por estado y resaltado de citas de hoy, próximas y vencidas.
- **Historial clínico:** registro de consultas (vacunación, desparasitación, cirugía, etc.), ficha resumida de la mascota y **timeline** cronológico.
- Diseño **responsive** (escritorio, tablet y celular).

## 3. Tecnologías y dependencias

| Herramienta | Versión | Uso |
|---|---|---|
| Node.js | 22 LTS o superior (probado con 22.23) | Entorno de ejecución |
| npm | 10+ | Gestor de paquetes |
| Angular CLI / Angular | 22.2 | Framework (componentes standalone, router, ReactiveForms) |
| TypeScript | 6.0 | Tipado estático, interfaces, clases y genéricos |
| Bootstrap | 5.3.3 | Alertas, badges, barras de progreso y clases de validación |
| RxJS | 7.8 | `valueChanges`, `events` de formularios |
| Vitest + jsdom | 5.x | Pruebas unitarias (`ng test`) |

> Los datos se guardan en el **localStorage** del navegador, por lo que no se necesita base de datos ni backend para ejecutar la aplicación.

## 4. Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/araceliporras2798-cmyk/vetsalud.git
cd vetsalud

# 2. Instalar dependencias (Angular, Bootstrap, Vitest, etc.)
npm install
```

Verifica las versiones con `node -v` y `npx ng version`.

## 5. Ejecución

```bash
npm start            # equivale a: ng serve
```

Abre **http://localhost:4200/**. La aplicación se recarga automáticamente al modificar el código.

Compilación de producción:

```bash
npm run build        # genera la carpeta dist/vetsalud
```

### Flujo sugerido para probar la app

1. **Dueños →** registra un propietario (prueba un DNI con 5 dígitos o un celular que no empiece con 9 para ver las validaciones).
2. **Mascotas →** “+ Registrar mascota”, elige el dueño y una fecha de nacimiento: la edad se calcula al instante.
3. **Citas →** agenda una cita; luego intenta agendar otra en la **misma fecha y hora** → aparece “Ese horario ya está reservado”.
4. Cambia el estado de una cita a *Cancelada* y verás que el horario vuelve a quedar libre.
5. **Historial →** registra una consulta y filtra por mascota para ver su línea de tiempo.
6. **Inicio →** revisa los indicadores y las próximas citas resaltadas.

> Para reiniciar los datos: DevTools (F12) → *Application* → *Local Storage* → borrar las claves `vetsalud_*`.

## 6. Pruebas

```bash
npm test                                          # modo observador
npx ng test --watch=false                         # una sola ejecución
npx ng test --watch=false --reporters=verbose     # detalle de cada prueba
```

Resultado actual: **12 archivos de prueba, 31 pruebas aprobadas.**

| Archivo | Qué se prueba |
|---|---|
| `shared/pipes/pipes.spec.ts` | `fechaLegible`, `estadoCita`, `edadMascota`, `tiempoRestante` |
| `shared/directives/directivas.spec.ts` | Resaltado de citas, campo solo numérico y clases `is-valid`/`is-invalid` |
| `shared/validators/vetsalud.validators.spec.ts` | DNI, celular, letras, fechas, horario de atención y horario disponible |
| `services/*.spec.ts` | Registro, búsqueda, horario ocupado, cancelación que libera horario, orden de citas |
| `pages/citas/citas.spec.ts` | Formulario reactivo: error de grupo `horarioOcupado` y `fueraDeHorario` |
| `pages/duenos/duenos.spec.ts` | Validaciones del formulario y DNI duplicado |
| `pages/*/*.spec.ts`, `app.spec.ts` | Creación de cada componente y menú principal |

```
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

## 7. Estructura del proyecto

```
src/app/
├── models/                 Interfaces: Dueno, Mascota, Cita, RegistroClinico
├── services/               MascotaService, CitaService, HistorialService (localStorage)
├── pages/                  Componentes de cada funcionalidad (rutas)
│   ├── dashboard/          Inicio con indicadores y próximas citas
│   ├── duenos/             Registro de propietarios
│   ├── mascotas/           Registro y búsqueda de mascotas
│   ├── citas/              Agenda de citas
│   └── historial/          Historial clínico (timeline)
├── shared/                 Elementos reutilizables
│   ├── pipes/              fechaLegible, estadoCita, edadMascota, tiempoRestante
│   ├── directives/         appResaltarCitaProxima, appSoloNumeros, appValidacionVisual
│   ├── validators/         VetValidators (validadores personalizados de ReactiveForms)
│   ├── components/         app-alerta, app-error-campo, app-progreso-formulario, app-tarjeta-resumen
│   ├── utils/              FechaUtil (manejo de fechas en hora local)
│   └── index.ts            Barrel de exportación + FORMULARIO_SHARED
├── app.routes.ts           Rutas: '', duenos, mascotas, citas, historial
└── app.config.ts           Configuración (router, listeners de errores)
```

## 8. Elementos de Angular implementados

### Pipes personalizados
| Pipe | Ejemplo | Resultado |
|---|---|---|
| `fechaLegible` | `{{ '2026-11-03' \| fechaLegible:'larga' }}` | Martes, 3 de noviembre de 2026 |
| `estadoCita` | `{{ cita.estado \| estadoCita }}` / `[class]="cita.estado \| estadoCita:'clase'"` | ⏳ Pendiente de confirmar / `badge text-bg-warning` |
| `edadMascota` | `{{ mascota.fechaNacimiento \| edadMascota }}` | 3 años y 5 meses |
| `tiempoRestante` | `{{ cita.fecha \| tiempoRestante:cita.hora }}` | En 30 min · Mañana · En 6 días |

### Directivas personalizadas
| Directiva | Uso | Efecto |
|---|---|---|
| `appResaltarCitaProxima` | `<tr [appResaltarCitaProxima]="cita" [horasAviso]="48">` | Resalta citas de **hoy** (ámbar), **próximas** (azul) y **vencidas sin atender** (rojo) |
| `appSoloNumeros` | `<input formControlName="dni" appSoloNumeros [maxDigitos]="8">` | Bloquea letras y limita dígitos (DNI, celular) |
| `appValidacionVisual` | `<input formControlName="nombre" appValidacionVisual>` | Aplica `is-valid` / `is-invalid` de Bootstrap según el estado del control |

### ReactiveForms y validaciones
- `FormBuilder.nonNullable.group(...)` en los 4 formularios (Dueños, Mascotas, Citas, Historial).
- Validadores de Angular (`required`, `minLength`, `maxLength`, `min`, `max`, `email`) + personalizados de `VetValidators` (`dni`, `celularPeru`, `soloLetras`, `noSoloEspacios`, `fechaNoPasada`, `fechaNoFutura`, `horarioAtencion`, `valorUnico`).
- **Validador de grupo** `horarioDisponible` en Citas (fecha + hora libres y no pasadas).
- Control del estado: botón deshabilitado mientras el formulario es inválido, `markAllAsTouched()`, `reset()`, `valueChanges` para recalcular horas ocupadas, `FormControl` independientes para buscador y filtros, barra de progreso que escucha `formulario.events`.

### Componentes reutilizables (`@Input` / `@Output`)
| Componente | Entradas | Salidas |
|---|---|---|
| `<app-alerta>` | `tipo`, `mensaje`, `titulo`, `cerrable` | `(cerrar)` |
| `<app-error-campo>` | `control`, `etiqueta` | — |
| `<app-progreso-formulario>` | `formulario` | — |
| `<app-tarjeta-resumen>` | `titulo`, `valor`, `icono`, `detalle`, `color`, `accion` | `(seleccionar)` |

## 9. Repositorio y créditos

- Repositorio: https://github.com/araceliporras2798-cmyk/vetsalud
- Imágenes de encabezado: Unsplash (requieren conexión a internet).
