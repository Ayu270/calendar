import WallCalendar from '../components/WallCalendar'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 py-12 px-4 flex items-center justify-center font-sans relative overflow-hidden">
      <WallCalendar />
    </div>
  )
}
