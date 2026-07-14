# my-academic-os

Angular 21 standalone project, SSR disabled, zoneless mode (`ChangeDetectorRef` required for all async updates).
Dark theme via CSS variables in `styles.scss`, font: Poppins.
Git remote: `https://github.com/Reximon/my-app-lifestyle.git`

## Google OAuth2
- GIS library (`google.accounts.oauth2`) via `GoogleCalendar` service
- Scopes: `calendar` + `userinfo.email`
- `src/environments/` is gitignored (holds `googleClientId`)

## Components

### Clock (`components/clock/`)
- Analog SVG face + hands, hour ticks, digital 24h overlay, date
- Uses `ChangeDetectorRef` + `setInterval`

### ActionsPanel (`components/actions-panel/`)
- Form: type select, title, optional date
- `create()`: saves task locally + syncs to Google Calendar if connected and has `dueDate`

### TodoWeek (`components/todo-week/`)
- Lists tasks where `type === 'tarea'`
- Filter buttons: todas / pendientes / completadas
- Custom checkbox (border-radius 20px) toggles completion

### Pomodoro (`components/pomodoro/`)
- 25min focus / 5min break timer
- Start / Pause / Reset
- `Notification` API on completion

### CalendarView (`components/calendar-view/`)
- Month grid, prev/next navigation, today highlight
- Local tasks shown as colored chips in cells
- Google Calendar events shown as `.google` chips
- Click chip -> modal (edit/delete)
- `saveTask()`: local update + Google Calendar CRUD via `googleEventId`
- Tasks/events precomputed in `tasksByDay`/`eventsByDay` Maps (no function calls in template)

## Services

### TaskService (`services/task.service.ts`)
- localStorage-backed CRUD, `BehaviorSubject<Task[]>`

### GoogleCalendar (`services/google-calendar.ts`)
- `initTokenClient()`, `signIn()`, `signOut()`, `isConnected()`
- `listEvents()` (3-month window), `createEvent()`, `updateEvent()`, `deleteEvent()` — all via `fetch()`
- `fetchUserInfo()` sets `userEmail`
- `onStateChange` Subject notifies subscribers

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

## Debug Logs
- `ActionsPanel.create()`: `console.log('Google body', body)`, `console.log('Google event created:', event.id)`, `console.error('Google create failed', e)`
- `GoogleCalendar.listEvents()`: `console.log('Eventos recibidos:', data)`

## Next Move
User to reload app, create a task with a due date via ActionsPanel, check F12 for `Google body` and `Google event created` logs.
