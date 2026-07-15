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
- Form: type `<select>`, title `<input>`, date `<input>`
- `create()`: saves task locally + syncs to Google Calendar if `isConnected()` and `dueDate` exists

### TodoWeek (`components/todo-week/`)
- Lists tasks where `type === 'tarea'` in a **table** (columns: checkbox, Tarea, Vence, Creada, Estado)
- **Default filter**: `'pendiente'` (shows only pending on load)
- Filter buttons with icons: Todas (list-check), Pendientes (clock), Completadas (check-double)
- **Status badge**: naranja `#f59e0b` (pendiente), verde `#22c55e` (completado)
- Checkbox: square (3px border-radius), 16px
- Sort: pending first, completed last (in "Todas" view)

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
5. Galería de diagramas subidos
6. Assignments / Proyectos semanales (con proyecto, tipo, estado, fecha)
7. Objetivos (diarios, semanales, semestres)
8. ~~Calendario con Google Calendar API~~ ✔️
9. ~~Pomodoro~~ ✔️
10. Notas de clase (AWS, carnet de conducir, etc.)
11. Lista de Topics (sidebar derecha)

## Last Commits
- `865a95e fix: CalendarView escucha cambios del TaskService`
- `c3580a1 fix: badge completado en verde (#22c55e)`
- `f400086 fix: badge pendiente vuelve a naranja`
- `6a0e32f feat: esquema de colores blanco y negro (monocromo)`
- `425b24d fix: cachear SafeResourceUrl para evitar recarga del iframe`
- `182bf2f feat: modal para añadir playlists + botón dashed`
- `a8c31b1 feat: cambiar playlist default de Spotify`
- `8436acb refactor: volver a embeds de Spotify sin API`
