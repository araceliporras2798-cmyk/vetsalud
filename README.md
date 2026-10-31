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
- **Mascotas:** registro asociado a un dueño, **código de paciente** (MAS-0001), especie **“Otro” con campo manual**, cálculo automático de la **edad** y búsqueda por código, nombre, especie o raza.
- **Citas:** **horarios predefinidos** en bloques de 30 minutos (08:00–20:00), con combo y grilla de disponibilidad (libre, ocupado o pasado), **servicio con tarifa y costo**, cambio de estado (Pendiente, Confirmada, Atendida, Cancelada), filtro por estado y resaltado de citas de hoy, próximas y vencidas.
- **Historial clínico:** la consulta se registra **seleccionando la cita**, y se cargan automáticamente los datos de la mascota, del dueño y del horario (la cita pasa a *Atendida*). Las atenciones se muestran en una **tabla con buscador por código o nombre** de la mascota y con el total cobrado.
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
2. **Mascotas →** “+ Registrar mascota”, elige el dueño y una fecha de nacimiento: la edad se calcula al instante. Prueba la especie **Otro** para ver el campo manual.
3. **Citas →** elige el servicio (el costo se completa solo) y un horario de la lista. Agenda otra cita el mismo día: el horario ya tomado aparece **bloqueado**.
4. Cambia el estado de una cita a *Cancelada* y verás que el horario vuelve a quedar libre.
5. **Historial →** elige la cita en “Cita a atender” (se cargan la mascota, el dueño y el horario), registra el diagnóstico y busca la atención por código (MAS-0001) en la tabla.
6. **Inicio →** revisa los indicadores y las próximas citas resaltadas.

> Para reiniciar los datos: DevTools (F12) → *Application* → *Local Storage* → borrar las claves `vetsalud_*`.

## 6. Pruebas

```bash
npm test                                          # modo observador
npx ng test --watch=false                         # una sola ejecución
npx ng test --watch=false --reporters=verbose     # detalle de cada prueba
```

Resultado actual: **14 archivos de prueba, 45 pruebas aprobadas.**

| Archivo | Qué se prueba |
|---|---|
| `shared/pipes/pipes.spec.ts` | `fechaLegible`, `estadoCita`, `edadMascota`, `tiempoRestante`, `moneda`, `codigoMascota`, `rangoHorario` |
| `shared/directives/directivas.spec.ts` | Resaltado de citas, campo solo numérico y clases `is-valid`/`is-invalid` |
| `shared/validators/vetsalud.validators.spec.ts` | DNI, celular, letras, fechas, horario de atención y horario disponible |
| `services/base/repositorio-local.spec.ts` | Herencia (los 4 servicios son `RepositorioLocal`), polimorfismo de `describir()` y reglas sobrescritas |
| `shared/services/servicios-ui.spec.ts` | Modal de confirmación (`Promise<boolean>`) y toasts |
| `services/*.spec.ts` | Registro, búsqueda, horario ocupado, cancelación que libera horario, orden de citas |
| `pages/citas/citas.spec.ts` | Error de grupo `horarioOcupado`, `fueraDeHorario`, tarifa automática y estado de los horarios |
| `pages/mascotas/mascotas.spec.ts` | Campo de especie manual cuando se elige “Otro” |
| `pages/historial/historial.spec.ts` | Registro desde la cita (autollenado y cita atendida) y búsqueda por código o nombre |
| `pages/duenos/duenos.spec.ts` | Validaciones del formulario y DNI duplicado |
| `pages/*/*.spec.ts`, `app.spec.ts` | Creación de cada componente y menú principal |

```
 Test Files  14 passed (14)
      Tests  45 passed (45)
```

## 7. Estructura del proyecto

```
src/app/
├── models/                 Interfaces Dueno, Mascota, Cita, RegistroClinico + servicios (tarifas) y horarios
├── services/               Servicios de datos (localStorage)
│   ├── base/               RepositorioLocal<T>: clase abstracta genérica
│   └── dueno, mascota, cita, historial   → heredan de RepositorioLocal
├── pages/                  Componentes de cada funcionalidad (rutas)
│   ├── dashboard/          Inicio con indicadores y próximas citas
│   ├── duenos/             Registro de propietarios
│   ├── mascotas/           Registro y búsqueda de mascotas
│   ├── citas/              Agenda de citas
│   └── historial/          Historial clínico (timeline)
├── shared/                 Elementos reutilizables
│   ├── pipes/              fechaLegible, estadoCita, edadMascota, tiempoRestante, moneda, codigoMascota, rangoHorario
│   ├── directives/         appResaltarCitaProxima, appSoloNumeros, appValidacionVisual
│   ├── validators/         VetValidators (validadores personalizados de ReactiveForms)
│   ├── components/         app-alerta, app-error-campo, app-progreso-formulario, app-tarjeta-resumen,
│   │                       app-dialogo-confirmacion (modal), app-contenedor-toasts
│   ├── services/           ConfirmacionService, NotificacionService (signals)
│   ├── utils/              FechaUtil (manejo de fechas en hora local)
│   └── index.ts            Barrel de exportación + FORMULARIO_SHARED
├── app.routes.ts           Rutas con carga diferida (loadComponent): '', duenos, mascotas, citas, historial
└── app.config.ts           Configuración (router, listeners de errores)
```

## 8. Elementos de Angular implementados

### POO: herencia y polimorfismo
- `RepositorioLocal<T extends Entidad>` es una **clase abstracta genérica** con la lógica común (cargar y guardar en localStorage, generar ids, listar, actualizar, eliminar).
- `DuenoService`, `MascotaService`, `CitaService` e `HistorialService` la **heredan** (`extends`) y **sobrescriben** (`override`) `describir()`, `validar()` y `validarEliminacion()` (patrón Template Method). Por ejemplo, no se repite un DNI, no se agenda en un horario ocupado y no se elimina una cita atendida.
- El Dashboard recorre los 4 servicios como `RepositorioLocal<Entidad>[]` y llama a `describir()`: **polimorfismo** visible en la sección “Últimos registros”.

### Bootstrap avanzado: modal y toasts
- `<app-dialogo-confirmacion>` reemplaza a `confirm()` con un modal de Bootstrap. `ConfirmacionService.confirmar()` devuelve `Promise<boolean>`, se cierra con Esc o con clic fuera y pone el foco en el botón principal.
- `<app-contenedor-toasts>` muestra notificaciones de éxito o error (`NotificacionService`) que se cierran solas.

### Carga diferida (lazy loading)
Cada módulo se carga con `loadComponent` solo al entrar a su ruta: el paquete inicial bajó de 621 kB a 489 kB y `ng build` genera un archivo por módulo.

### Pipes personalizados
| Pipe | Ejemplo | Resultado |
|---|---|---|
| `fechaLegible` | `{{ '2026-11-03' \| fechaLegible:'larga' }}` | Martes, 3 de noviembre de 2026 |
| `estadoCita` | `{{ cita.estado \| estadoCita }}` / `[class]="cita.estado \| estadoCita:'clase'"` | ⏳ Pendiente de confirmar / `badge text-bg-warning` |
| `edadMascota` | `{{ mascota.fechaNacimiento \| edadMascota }}` | 3 años y 5 meses |
| `tiempoRestante` | `{{ cita.fecha \| tiempoRestante:cita.hora }}` | En 30 min · Mañana · En 6 días |
| `moneda` | `{{ cita.costo \| moneda }}` | S/ 40.00 |
| `codigoMascota` | `{{ mascota.id \| codigoMascota }}` | MAS-0003 |
| `rangoHorario` | `{{ '09:00' \| rangoHorario }}` | 09:00 – 09:30 |

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

## 9. Ajustes de la revisión del docente (30/10/2026)

| Observación | Implementación |
|---|---|
| Especie “Otro” debe permitir escribirla | Campo **¿Qué especie es?** que aparece y se vuelve obligatorio solo con “Otro” (validadores dinámicos) |
| Fecha de la cita no anterior a hoy | `[min]` + validador `fechaNoPasada` (ya estaba implementado) |
| Horarios preestablecidos, no hora libre | Combo y grilla de bloques de 30 min; ocupados o pasados deshabilitados |
| La cita tiene un costo según el servicio | Servicios con tarifa en `models/servicio.ts`; el costo se completa al elegir el servicio |
| El historial se registra desde la cita | Selección de la cita con autollenado de mascota, dueño y horario; la cita queda *Atendida* |
| Tabla de historial con buscador | Tabla de atenciones con buscador por código (MAS-0001) o nombre |

## 10. Repositorio y créditos

- Repositorio: https://github.com/araceliporras2798-cmyk/vetsalud
- Imágenes de encabezado: Unsplash (requieren conexión a internet).
