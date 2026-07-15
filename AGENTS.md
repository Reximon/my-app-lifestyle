# my-academic-os

Angular 21 standalone, SSR disabled, zoneless mode (`ChangeDetectorRef` for all async updates).
Dark theme with custom CSS variables (`styles.scss`), font: Poppins.
Git remote: `https://github.com/Reximon/my-app-lifestyle.git`

## Design System
- **Background**: `radial-gradient(ellipse at 50% 0%, #121225, #0a0a0f 70%)` fixed
- **Cards**: `--bg-card: #1a1a2e`, border-radius 8-12px, shadow hover lift
- **Accent**: `#7c5cfc` (purple), glow: `rgba(124,92,252,0.2)`
- **Section headers**: Left accent bar (3px) + translucent bg (no full purple bg)
- **Selects**: Inset shadow 3D effect, focus glow + scale(1.01), custom purple chevron
- **Scrollbar**: 6px thin, `--border` color
- **::selection**: accent purple bg

## Font Awesome
- `@fortawesome/angular-fontawesome@4` + free-solid/regular/brands
- Global library in `app.ts` constructor via `FaIconLibrary.addIcons()`
- `FaIconComponent` imported in each component that uses `<fa-icon>`
- Icons: check, plus, play, pause, rotate, trash, save, times, filter, calendar, clock, upload, list-check, mosquito, book, chalkboard, clipboard-list, file-lines, check-double

## Components

### Clock (`components/clock/`)
- Analog SVG (240x240px), hands + hour ticks, digital overlay with date
- `setInterval` + `ChangeDetectorRef`
- **Favicon**: Dynamic canvas renders current day number (22px Poppins, dark bg, white text)

### ActionsPanel (`components/actions-panel/`)
- Form: type `<select>`, title `<input>`, date `<input>`
- `create()`: saves task locally + syncs to Google Calendar if `isConnected()` and `dueDate` exists

### TodoWeek (`components/todo-week/`)
- Lists tasks where `type === 'tarea'` in a **table** (columns: checkbox, Tarea, Vence, Creada, Estado)
- **Default filter**: `'pendiente'` (shows only pending on load)
- Filter buttons with icons: Todas (list-check), Pendientes (clock), Completadas (check-double)
- **Status badge**: orange (`#f59e0b`) for pendiente, green (accent) for completado
- Checkbox: square (3px border-radius), 16px
- Sort: pending first, completed last (in "Todas" view)

### Pomodoro (`components/pomodoro/`)
- 25min work / 5min break
- **Marble gradient background**: 5 radial-gradient layers (violet veins for work, amber for break)
- Timer: 3.2rem, weight 300, letter-spacing 4px, debossed text-shadow
- Status: pill badge (violet / orange)
- Buttons: play/pause (accent with shadow), reset (ghost)
- `Notification` API on completion

### CalendarView (`components/calendar-view/`)
- Month grid, prev/next, today highlight with **"HOY" bookmark tab**
- **Grid lines**: via `gap: 1px` + `background: var(--border)` on container
- **Task chips**: sticky-note style with alternating rotation (-0.3° / +0.3°), shadow, hover scale
- **Google events**: red-tinted bg, italic, no rotation
- **Type filters**: Todas/Tarea/Clase/Asign/Topic/Nota with icons
- Click chip → modal (edit/delete)
- `saveTask()`: local + Google Calendar CRUD via `googleEventId`
- Precomputed `tasksByDay`/`eventsByDay` Maps
- **Modal**: backdrop-filter blur, 12px radius, deep shadow

## Services

### TaskService (`services/task.service.ts`)
- localStorage (`academic-os-task`), BehaviorSubject

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
  dueDate?: string;
  createdAt: string;
  googleEventId?: string;
}
```

## Assets
- **Banner**: `src/img/bg.jpg` served via `"src/img"` in angular.json assets
- **Banner CSS**: 220px height, object-fit cover, object-position 0% 30%
- `public/favicon.ico` removed (dynamic favicon via clock canvas)

## Debug Logs
- `ActionsPanel.create()`: `'Google body'`, `'Google event created:'`, `'Google create failed'`
- `GoogleCalendar.listEvents()`: `'Eventos recibidos:'`

## Componentes Faltantes (del prompt original)
1. ~~Reloj~~ ✔️
2. ~~Actions (crear tareas/clases/topics/notas/assignments)~~ ✔️
3. ~~Spotify / YouTube~~ ✔️ (debajo del reloj)
4. ~~Tareas de la semana (todo)~~ ✔️
5. Galería de diagramas subidos
6. Assignments / Proyectos semanales (con proyecto, tipo, estado, fecha)
7. Objetivos (diarios, semanales, semestres)
8. ~~Calendario con Google Calendar API~~ ✔️
9. ~~Pomodoro~~ ✔️
10. Notas de clase (AWS, carnet de conducir, etc.)
11. Lista de Topics (sidebar derecha)

## Spotify (`components/spotify/`)
- Biblioteca multi-playlist vía **embeds de Spotify** (no requiere API ni Premium)
- Playlists guardadas en localStorage como array `{ id, label }`
- Reproductor grande (352px) con controles completos de Spotify (reproducción completa si tienes cuenta Spotify logueada en el navegador)
- Lista numerada de playlists guardadas, click para cambiar
- Input para añadir: nombre opcional + URL de Spotify (playlist/track/album/episode)
- Botón eliminar individual, indicador activo (barra verde izquierda)
- Default: Peaceful Piano playlist

## Last Commits
- (next commit)
- `861f55e style: ajustar padding bookmark HOY en calendario`
- `eda5d8d feat: rediseño visual completo con marmolado, planner y tarjetas mejoradas`
- `46aa96d feat: agrandar reloj, agregar Font Awesome y banner`
- `685a72f build: agregar Font Awesome como librería de iconos`
- `e90a6aa feat: agregar imagen de banner y configurar assets img`
