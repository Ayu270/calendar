import React, { useState, useEffect, useMemo } from 'react';
import CalendarHeader from './CalendarHeader';
import HeroImage from './HeroImage';
import CalendarGrid from './CalendarGrid';
import { useDateRange } from '../hooks/useDateRange';
import { useNotes } from '../hooks/useNotes';
import { useDominantColor } from '../hooks/useDominantColor';
import { Search, Trash2, Edit2, Check, X } from 'lucide-react';
import { formatDateStr } from '../utils/dateHelpers';

export default function WallCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [uploadedImage, setUploadedImage] = useState(() => {
    try {
      return localStorage.getItem('calendar_custom_image') || null;
    } catch {
      return null;
    }
  });

  const { dominantColor, extractColor } = useDominantColor('#10b981');

  const {
    notes,
    addNote,
    deleteNote,
    updateNote,
    moveNote,
    getNotesForDay,
    getNotesForRange
  } = useNotes();

  const {
    startDate,
    endDate,
    hoveredDate,
    setHoveredDate,
    handleMouseDown,
    handleMouseEnter,
    handleDayClick
  } = useDateRange(dominantColor);

  const [isAnimatingCurl, setIsAnimatingCurl] = useState(false);
  const [curlDirection, setCurlDirection] = useState('next');

  // Edit state for inline notes editing in the sidebar
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editIsAllDay, setEditIsAllDay] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navMonth = (offset) => {
    setCurlDirection(offset > 0 ? 'next' : 'prev');
    setIsAnimatingCurl(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
      setIsAnimatingCurl(false);
    }, 400);
  };

  const navToday = () => {
    const today = new Date();
    setCurlDirection(currentDate.getFullYear() >= today.getFullYear() && currentDate.getMonth() >= today.getMonth() ? 'prev' : 'next');
    setIsAnimatingCurl(true);
    setTimeout(() => {
      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setIsAnimatingCurl(false);
    }, 400);
  };

  const copyRange = () => {
    if (!startDate) return;
    const end = endDate || startDate;
    const sDate = Math.min(startDate.getTime(), end.getTime());
    const eDate = Math.max(startDate.getTime(), end.getTime());

    const f = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const text = f.format(new Date(sDate)) + (sDate !== eDate ? ` – ${f.format(new Date(eDate))}` : '');
    navigator.clipboard.writeText(text);
  };

  // Get notes for the current month to display in the Notes section
  const currentMonthNotes = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = formatDateStr(new Date(year, month, 1));
    const lastDay = formatDateStr(new Date(year, month + 1, 0));

    let filtered = notes.filter(n => {
      // Note overlaps with the current month
      return !(n.end < firstDay || n.start > lastDay);
    });

    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(sq) ||
        (n.description && n.description.toLowerCase().includes(sq))
      );
    }

    return filtered.sort((a, b) => a.start.localeCompare(b.start));
  }, [notes, currentDate, searchQuery]);

  return (
    <div className={`flex flex-col items-center max-w-4xl mx-auto w-full p-4 md:p-8 font-sans ${isDarkMode ? 'dark text-white' : 'text-slate-800'}`}>

      {/* --- Calendar Card --- */}
      <div
        className="flex flex-col bg-white dark:bg-slate-800 rounded-xl relative z-10 w-full"
        style={{
          boxShadow: isDarkMode ? '0 32px 60px -12px rgba(0,0,0,0.75)' : '0 32px 60px -12px rgba(0,0,0,0.28), 0 0 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Spiral Binding Header */}
        <div className="absolute top-0 left-0 w-full h-8 -mt-4 flex justify-around px-6 md:px-12 z-30 pointer-events-none print:hidden">
          {[...Array(22)].map((_, i) => (
            <div
              key={i}
              className={`w-3 md:w-4 h-10 rounded-full border-4 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-md transform -rotate-12 ${i >= 10 ? 'hidden md:block' : 'block'}`}
            ></div>
          ))}
        </div>

        <div className="flex flex-col perspective-1000 z-10">
          <div className={`flex flex-col transition-all duration-500 transform-style-3d origin-top ${isAnimatingCurl ? (curlDirection === 'next' ? 'rotate-x-45 scale-95 opacity-0' : '-rotate-x-45 scale-95 opacity-0') : 'scale-100 opacity-100'}`}>
            <HeroImage
              currentDate={currentDate}
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              extractColor={extractColor}
              accentColor={dominantColor}
            />

            <CalendarHeader
              accentColor={dominantColor}
              navMonth={navMonth}
              navToday={navToday}
              copyRange={copyRange}
              isDarkMode={isDarkMode}
              toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              startDate={startDate}
              endDate={endDate}
              notes={notes}
              getNotesForRange={getNotesForRange}
            />

            {/* Grid + Notes Section */}
            <div className="p-2 md:p-5 pb-4 relative overflow-visible flex flex-col md:flex-row gap-3">
              {/* Notes sidebar — shows current month notes */}
              <div className="hidden md:flex flex-col gap-0 w-48 flex-shrink-0 border-r border-slate-100 dark:border-slate-700/50 pr-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex-grow">Notes</p>
                  <Search size={11} className="text-slate-400" />
                </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-[10px] p-1.5 mb-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 placeholder:text-slate-300"
                  style={{ '--tw-ring-color': dominantColor }}
                />

                {/* Notes list */}
                <div className="flex-grow overflow-y-auto no-scrollbar space-y-2 max-h-80">
                  {currentMonthNotes.length > 0 ? currentMonthNotes.map(note => (
                    <div key={note.id} className="relative group/note">
                      {editNoteId === note.id ? (
                        /* Edit mode */
                        <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-1.5">
                          <input type="text" className="w-full text-[10px] p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
                          <textarea className="w-full text-[9px] p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded resize-none h-12 focus:outline-none" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" />
                          <div className="flex gap-1 justify-end">
                            <button className="text-green-500 hover:text-green-600" onClick={() => { updateNote(note.id, editTitle, editDesc, editStartTime, editEndTime, editIsAllDay); setEditNoteId(null); }}><Check size={12} /></button>
                            <button className="text-slate-400 hover:text-slate-600" onClick={() => setEditNoteId(null)}><X size={12} /></button>
                          </div>
                        </div>
                      ) : (
                        /* Display mode */
                        <div className="p-2 rounded-lg border-l-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" style={{ borderLeftColor: dominantColor }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px] font-mono text-slate-400 leading-none">{note.start.slice(5)}</span>
                            <div className="opacity-0 group-hover/note:opacity-100 transition-opacity flex gap-1">
                              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => { setEditTitle(note.title); setEditDesc(note.description || ''); setEditStartTime(note.startTime || ''); setEditEndTime(note.endTime || ''); setEditIsAllDay(note.isAllDay || false); setEditNoteId(note.id); }}><Edit2 size={10} /></button>
                              <button className="text-red-400 hover:text-red-600" onClick={() => deleteNote(note.id)}><Trash2 size={10} /></button>
                            </div>
                          </div>
                          <h4 className="text-[10px] font-bold leading-tight">{note.title}</h4>
                          {note.description && <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">{note.description}</p>}
                          <div className="flex items-center gap-1 mt-0.5">
                            {note.isAllDay && <span className="text-[8px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1 rounded">All day</span>}
                            {!note.isAllDay && note.startTime && <span className="text-[8px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1 rounded">{note.startTime}{note.endTime ? ` - ${note.endTime}` : ''}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-[9px] text-slate-400 italic pt-4 text-center">
                      {searchQuery ? 'No matches' : 'No notes this month'}
                    </div>
                  )}
                </div>
              </div>

              {/* Calendar grid */}
              <div className="flex-grow relative overflow-visible">
                <CalendarGrid
                  currentDate={currentDate}
                  accentColor={dominantColor}
                  startDate={startDate}
                  endDate={endDate}
                  hoveredDate={hoveredDate}
                  setHoveredDate={setHoveredDate}
                  handleMouseDown={handleMouseDown}
                  handleMouseEnter={handleMouseEnter}
                  handleDayClick={handleDayClick}
                  getNotesForDay={getNotesForDay}
                  addNote={addNote}
                  deleteNote={deleteNote}
                  updateNote={updateNote}
                  moveNote={moveNote}
                  searchQuery={searchQuery}
                />
              </div>
            </div>

            {/* Mobile: notes strip below grid */}
            <div className="md:hidden px-3 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex-grow">Notes</p>
                <div className="relative flex-grow max-w-[180px]">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-[10px] p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 placeholder:text-slate-300 pl-6"
                  />
                  <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {currentMonthNotes.length > 0 ? currentMonthNotes.slice(0, 10).map(note => (
                  <div key={note.id} className="flex-shrink-0 w-44 p-2.5 rounded-lg border-l-2 bg-slate-50 dark:bg-slate-700/50" style={{ borderLeftColor: dominantColor }}>
                    <span className="text-[8px] font-mono text-slate-400">{note.start.slice(5)}</span>
                    <h4 className="text-[10px] font-bold leading-tight truncate">{note.title}</h4>
                    {note.description && <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">{note.description}</p>}
                    {note.isAllDay && <span className="text-[8px] font-mono text-slate-400">All day</span>}
                    {!note.isAllDay && note.startTime && <span className="text-[8px] font-mono text-slate-400">{note.startTime}{note.endTime ? ` - ${note.endTime}` : ''}</span>}
                  </div>
                )) : (
                  <div className="text-[9px] text-slate-400 italic py-2">{searchQuery ? 'No matches' : 'Click a date to add notes'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
