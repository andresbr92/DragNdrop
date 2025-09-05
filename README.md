# Bestseller Trello Lite Version

Un MVP de aplicación tipo Trello desarrollado con React, TypeScript y Material UI. Este proyecto demuestra el uso correcto de hooks de React y implementa funcionalidad de drag and drop para gestión de tareas.

##  Características Implementadas

### Core Features
- [X] **Drag & Drop entre columnas**: Mover cards entre diferentes columnas
- [X] **Reordenamiento dentro de columna**: Reorganizar cards dentro de la misma columna
- [X] **Estado reactivo**: Actualizaciones inmediatas de la UI
- [X] **Feedback visual**: Indicadores visuales durante el drag and drop

### Funcionalidades MVP
- **Tres columnas por defecto**: "Por hacer", "En progreso", "Completado"
- **Cards simplificadas**: Solo título de texto
- **Lógica de reordenamiento simplificada**: Mover al principio/final según posición actual

## Tecnologías Utilizadas

### Frontend Stack
- **React 19**
- **TypeScript**
- **Material UI**
- **Vite** 

### Drag & Drop
- **@atlaskit/pragmatic-drag-and-drop** - Librería de drag and drop de Atlassian

##  Arquitectura y Hooks

### Hooks Implementados (Demostración técnica)
- **`useState`**: Estado reactivo para las columnas y cards
- **`useCallback`**: Memoización de funciones core (`getColumns`, `reorderCard`, `moveCard`)
- **`useMemo`**: Memoización del contexto de board
- **`useEffect`**: Monitor global de drag and drop y sincronización de refs (propios de la libreria DnD)
- **`useRef`**: Referencia estable para el monitor y elementos DOM
- **`useContext`**: Gestión de estado compartido entre componentes

### Estructura de Componentes

```
App.tsx (Estado global + Monitor)
├── BoardContext (Funciones compartidas)
├── Board.tsx (Layout container)
├── Column.tsx (Drop target + Cards)
└── Card.tsx (Draggable items)
```


## Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Pasos de instalación

```bash
# Clonar el repositorio
git clone
cd trello-lite

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
# Vite mostrará la URL (normalmente http://localhost:5173)
```

