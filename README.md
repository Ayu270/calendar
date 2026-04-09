# 🗓️ Wall Calendar 3D

A high-fidelity, interactive 3D calendar application built with React and Vite. This project transforms the traditional calendar experience into a physical "wall calendar" digital twin, featuring smooth vertical 3D page-flip transitions, dynamic layout adjustments, and rich event management.

![Calendar Preview](public/preview-screenshot.png)

Live - https://calendar-ttask.vercel.app/

## ✨ Key Features

- **3D Vertical Flip Transition**: A native CSS 3D animation (`perspective`, `rotateX`) that mimics a real wall calendar page turn with depth and realistic shadows.
- **Dynamic Color Extraction**: Automatically samples colors from the month's hero image using a custom hook (`useDominantColor`) to theme the UI highlights, date ranges, and notes.
- **Rich Note Management**: 
  - Create, edit, and delete notes for any day.
  - Drag-and-drop notes between days.
  - Interactive timeline view in a responsive sidebar.
- **Smart Date Selection**: Multi-day range selection with immediate visual feedback.
- **Responsive Architecture**: Fully optimized for both desktop (sidebar timeline) and mobile (horizontal strip view).
- **Dark Mode Support**: Deep integration with system settings and manual toggle.
- **Holiday & Progress Tracking**: Integrated holiday highlighting and "days remaining" tooltips.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Native CSS 3D Transforms & Keyframes
- **Feedback**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

## 🧠 Technical Choices & Decisions

As the developer of this project, I made several strategic architectural choices to ensure a premium, performance-first experience:

### 1. Native CSS 3D vs. Animation Libraries
Instead of relying on heavy libraries like `Framer Motion` or specialized flipping libraries (which often struggle with interactive nested content), I opted for **Native CSS 3D Transforms** (`perspective`, `transform-style: preserve-3d`, `rotateX`). This allows for:
- **Zero JS overhead** once the animation starts.
- **Perfect interaction**: Since the page remains a DOM element, accessibility and selection work natively until the flip triggers.
- **Physical Realism**: Custom keyframes allow for subtle "bounce" and shadow effects that libraries often abstract away.

### 2. Canvas-Based Color Extraction
To make the calendar feel truly "alive," I implemented a custom `useDominantColor` hook that uses the HTML5 Canvas API to sample colors from the month's hero image. This ensures a cohesive visual identity that updates automatically as you flip through the months.

### 3. Modular Hook Logic
The state management is split into focused custom hooks (`useNotes`, `useDateRange`) rather than one giant context. This keeps the `WallCalendar` component clean and makes the logic for complex interactions (like multi-day drag selection) much easier to test and maintain.

### 4. Vite over Create-React-App
Vite was chosen for its nearly instantaneous Hot Module Replacement (HMR). Working on 3D physics and CSS transitions requires constant visual feedback; Vite provides the speed necessary for that iterative workflow.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/calendar.git
   cd calendar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will typically be available at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be in the `dist/` directory.

## 📂 Project Structure

- `src/components/`: Core UI components (`WallCalendar.jsx`, `CalendarGrid.jsx`, etc.)
- `src/hooks/`: Custom state logic and color extraction.
- `src/utils/`: Date helpers and holiday data.
- `src/app/globals.css`: Custom 3D perspective and flip animation definitions.

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve the 3D physics, color sampling accuracy, or feature set!

---
*Built with ❤️ by Ayu270*

