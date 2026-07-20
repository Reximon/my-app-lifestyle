# my-academic-os

Angular 21 standalone, SSR disabled, zoneless mode (`ChangeDetectorRef` for all async updates).
Dark theme, font: Poppins.
Git remote: `https://github.com/Reximon/my-app-lifestyle.git`

## Design System (Blanco y Negro)
- **Background**: `radial-gradient(ellipse at 50% 0%, #121225 0%, #0a0a0a 70%)` fixed
- **Cards**: `--bg-card: #1a1a1a`, `--bg-card-hover: #222222`
- **Accent**: `--accent: #ffffff` (blanco puro), `--accent-glow: rgba(255,255,255,0.15)`
- **Section headers**: Left accent bar (3px) + `rgba(255,255,255,0.04)` translucent bg
- **Selects**: Inset shadow 3D effect, focus glow + scale(1.01), custom white chevron
- **Scrollbar**: 6px thin, `--border (#333)` color
- **::selection**: white bg
- **Status badges**: `#f59e0b` (naranja) pendiente, `#22c55e` (verde) completado
- **Colors variables**: `--green: #ccc`, `--blue: #aaa`, `--orange: #999`, `--red: #888`

## Font Awesome
- `@fortawesome/angular-fontawesome@4` + free-solid/regular/brands
- Global library in `app.ts` constructor via `FaIconLibrary.addIcons()`
- `FaIconComponent` imported in each component that uses `<fa-icon>`

## Components

### Clock (`components/clock/`)
- Analog SVG (240x240px), hands + hour ticks, digital overlay with date
- `setInterval` + `ChangeDetectorRef`
- **Favicon**: Dynamic canvas renders current day number (22px Poppins, dark bg, white text)

### ActionsPanel (`components/actions-panel/`)
- Form: type `<select>`, title `<input>`, description `<input>`, date `<input>`
- `create()`: saves task locally + syncs to Google Calendar if `isConnected()` and `dueDate` exists

### TodoWeek (`components/todo-week/`)
- Lists tasks where `type === 'tarea'` in a **table** (columns: checkbox, Tarea, Estado, Vence, Creada, ✎)
- **Default filter**: `'pendiente'` (shows only pending on load)
- Filter buttons with icons: Todas (list-check), Pendientes (clock), Completadas (check-double)
- **Status badge**: naranja `#f59e0b` (pendiente), verde `#22c55e` (completado)
- Checkbox: square (3px border-radius), 16px
- Sort: pending first, completed last (in "Todas" view)
- **Edición**: botón lápiz hover + doble click en título → modal (título, descripción, fecha, estado)

### Pomodoro (`components/pomodoro/`)
- 25min work / 5min break
- **Marble gradient**: 5 radial-gradient layers (white veins on dark bg, both modes)
- Timer: 3.2rem, weight 300, letter-spacing 4px, debossed text-shadow
- Status: pill badge white-on-dark (work/break)
- Buttons: accent bg + black text (play/pause), ghost (reset)
- `Notification` API on completion

### CalendarView (`components/calendar-view/`)
- Month grid, prev/next, today highlight with **"HOY" bookmark tab**
- **Grid lines**: via `gap: 1px` + `background: var(--border)` on container
- **Task chips**: sticky-note style with alternating rotation, shadow, hover scale
- **Google events**: gray-tinted bg (before: red), italic, no rotation
- **Type filters**: Todas/Tarea/Clase/Asign/Topic/Nota with icons
- Click chip → modal (edit/delete)
- `saveTask()`: local + Google Calendar CRUD via `googleEventId`
- Precomputed `tasksByDay`/`eventsByDay` Maps
- **Imporante**: También escucha `taskService.tasks$` (no solo Google Calendar) para refrescar tareas locales al instante
- **Modal**: backdrop-filter blur, 12px radius, deep shadow

### TopicsList (`components/topics-list/`)
- Lista de topics (tasks con `type: 'topic'`) en la sidebar derecha
- Checkbox para marcar completado (tachado + opacidad)
- Botón eliminar (hover reveal) + botón lápiz hover
- Doble click en título o click en lápiz → modal (título, descripción, fecha, estado)
- Botón "Añadir topic" abre modal para crear
- **Color picker**: paleta de 12 colores en el modal de crear/editar. Círculo de color en la lista.
- **Diagramas vinculados**: muestra contador de diagramas (`faImage N`) en la lista y miniaturas con botón desvincular en el modal de edición
- Se sincera con `TaskService.tasks$` + `DiagramService.diagrams$` en tiempo real

### Objectives (`components/objectives/`)
- Sección en main-content con 3 tabs: Diario (sun), Semanal (calendar-week), Semestral (graduation-cap)
- Cada tab filtra objetivos por `scope` y muestra contador
- Checkbox para toggle pendiente/completado (tachado)
- Botón lápiz hover + doble click en título → modal de edición (ámbito, título, descripción, fecha)
- Botón "Añadir objetivo" abre modal para crear
- Persistencia propia en localStorage via `ObjectiveService`

### Assignments (`components/assignments/`)
- Tabla en main-content: checkbox, Título, Curso, Tipo, Estado, Vence, acciones
- Badge tipo: gris (assignment) / blanco (proyecto)
- Badge estado: naranja (pendiente), azul (entregado), verde (revisado)
- Checkbox toggle: pendiente ↔ entregado
- Botón lápiz + eliminar hover
- Modal con campos: curso, tipo, título, descripción, fecha, estado
- Persistencia en localStorage via `AssignmentService`

### ClassNotes (`components/class-notes/`)
- Notas de clase en main-content
- **Tarjetas** con preview de 2 líneas, click para expandir contenido completo
- Filtro por materia (select)
- Modal para crear/editar: materia, título, textarea grande
- Botón editar/eliminar visibles al expandir

### DiagramGallery (`components/diagram-gallery/`)
- Cuadrícula de thumbnails (auto-fill, min 140px)
- Subida de imágenes → redimensiona a 800px max via canvas → guarda como base64 en localStorage
- **Vinculación con topics**: selector de topic al subir, filtro por topic, badge con dot de color en cada card
- Lightbox modal a tamaño completo con backdrop-filter blur y nombre del topic
- Nombre editable antes de subir
- Botón eliminar por hover en cada thumbnail

### Spotify (`components/spotify/`)
- Biblioteca multi-playlist vía **embeds de Spotify** (no requiere API OAuth ni Premium)
- Playlists guardadas en localStorage como array `{ id, label }`
- Reproductor grande (352px), reproduce canciones completas con cuenta Spotify en navegador
- **Modal** para añadir: botón dashed → modal con URL + nombre opcional
- Lista numerada de playlists guardadas, click para cambiar
- Botón eliminar individual, indicador activo (barra verde izquierda)
- **Importante**: `SafeResourceUrl` cachead (`cachedEmbedUrl`) para evitar recarga del iframe en cada detección de cambios
- Default: playlist del usuario

## Services

### TaskService (`services/task.service.ts`)
- localStorage (`academic-os-task`), BehaviorSubject (`tasks$`)

### ObjectiveService (`services/objective.service.ts`)
- localStorage (`academic-os-objectives`), BehaviorSubject (`objectives$`)
- CRUD: `getObjectives()`, `addObjective()`, `updateObjective()`, `deleteObjective()`

### AssignmentService (`services/assignment.service.ts`)
- localStorage (`academic-os-assignments`), BehaviorSubject (`assignments$`)
- CRUD: `getAssignments()`, `addAssignment()`, `updateAssignment()`, `deleteAssignment()`

### ClassNoteService (`services/class-note.service.ts`)
- localStorage (`academic-os-class-notes`), BehaviorSubject (`classNotes$`)
- CRUD: `getNotes()`, `addNote()`, `updateNote()`, `deleteNote()`

### DiagramService (`services/diagram.service.ts`)
- localStorage (`academic-os-diagrams`), BehaviorSubject (`diagrams$`)
- CRUD: `getDiagrams()`, `addDiagram()`, `updateDiagram()`, `deleteDiagram()`

### GoogleCalendar (`services/google-calendar.ts`)
- GIS `google.accounts.oauth2`, scopes: calendar + userinfo.email
- `isConnected()`, `signIn()`, `signOut()`, `listEvents()`, `createEvent()`, `updateEvent()`, `deleteEvent()`
- CRUD returns Promise with data
- `onStateChange` Subject

## Models

### Task (`models/task.model.ts`)
```ts
interface Task {
  id: string;
  type: 'tarea' | 'clase' | 'topic' | 'nota' | 'assignment';
  title: string;
  description?: string;
  status: 'pendiente' | 'en progreso' | 'completado';
  color?: string;
  dueDate?: string;
  createdAt: string;
  googleEventId?: string;
}
```

### Objective (`models/objective.model.ts`)
```ts
interface Objective {
  id: string;
  scope: 'daily' | 'weekly' | 'semester';
  title: string;
  description?: string;
  status: 'pendiente' | 'completado';
  createdAt: string;
  dueDate?: string;
}
```

### Assignment (`models/assignment.model.ts`)
```ts
interface Assignment {
  id: string;
  title: string;
  course: string;
  type: 'assignment' | 'project';
  status: 'pendiente' | 'entregado' | 'revisado';
  dueDate?: string;
  description?: string;
  createdAt: string;
}
```

### ClassNote (`models/class-note.model.ts`)
```ts
interface ClassNote {
  id: string;
  course: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}
```

### Diagram (`models/diagram.model.ts`)
```ts
interface Diagram {
  id: string;
  title: string;
  dataUrl: string;
  topicId?: string;
  createdAt: string;
}
```

## Assets
- **Banner**: `src/img/bg.jpg`, 220px height, object-fit cover, object-position 0% 30%
- `public/favicon.ico` removed (dynamic favicon via clock canvas)

## Debug Logs
- `ActionsPanel.create()`: `'Google body'`, `'Google event created:'`, `'Google create failed'`
- `GoogleCalendar.listEvents()`: `'Eventos recibidos:'`

## Componentes Faltantes (del prompt original)
1. ~~Reloj~~ ✔️
2. ~~Actions (crear tareas/clases/topics/notas/assignments)~~ ✔️
3. ~~Spotify / YouTube~~ ✔️
4. ~~Tareas de la semana (todo)~~ ✔️
5. ~~Galería de diagramas subidos~~ ✔️
6. ~~Assignments / Proyectos semanales~~ ✔️
7. ~~Objetivos (diarios, semanales, semestres)~~ ✔️
8. ~~Calendario con Google Calendar API~~ ✔️
9. ~~Pomodoro~~ ✔️
10. ~~Notas de clase (AWS, carnet de conducir, etc.)~~ ✔️
11. ~~Lista de Topics (sidebar derecha)~~ ✔️

## Last Commits
- `a7e8ca7 feat: color picker para topics con paleta de 12 colores + dot en lista y galería`
- `7e75391 feat: vincular diagramas con topics - selector en upload, filtro en galería, miniaturas en modal de topic`
- `d743320 fix: circular infinite loop en TaskService.getTasks() al emitir next()`
- `8033a49 feat: DiagramGallery con upload, grid thumbnails y lightbox`
- `4499a22 feat: ClassNotes con diseño de click en tarjeta, filtro por materia, modal crear/editar`
- `d28de52 fix: reordenar Assignments debajo de Objetivos con header`
- `81f11af fix: Assignments component adaptado correctamente al modelo`
- `b3ac6a0 feat: edición inline con lápiz hover y doble click en Tareas, Objetivos, Topics`
- `3502b9d feat: sección Objetivos (daily/weekly/semester) con tabs, checkbox y modal`
- `c380710 feat: campos completos en TopicsList + descripción en ActionsPanel`
- `865a95e fix: CalendarView escucha cambios del TaskService`
- `c3580a1 fix: badge completado en verde (#22c55e)`
- `f400086 fix: badge pendiente vuelve a naranja`
- `6a0e32f feat: esquema de colores blanco y negro (monocromo)`
- `425b24d fix: cachear SafeResourceUrl para evitar recarga del iframe`
- `182bf2f feat: modal para añadir playlists + botón dashed`
- `a8c31b1 feat: cambiar playlist default de Spotify`
- `8436acb refactor: volver a embeds de Spotify sin API`
