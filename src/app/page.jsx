import WallCalendar from '../components/WallCalendar'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 py-6 md:py-12 px-2 md:px-4 flex items-start md:items-center justify-center font-sans relative overflow-hidden">
      <WallCalendar />
    </div>
  )
}
