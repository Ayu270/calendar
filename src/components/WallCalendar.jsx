import React, { useState, useEffect, useMemo } from 'react';
import CalendarHeader from './CalendarHeader';
import HeroImage from './HeroImage';
import CalendarGrid from './CalendarGrid';
import { useDateRange } from '../hooks/useDateRange';
import { useNotes } from '../hooks/useNotes';
import { useDominantColor } from '../hooks/useDominantColor';
import { Search, Trash2, Edit2, Check, X } from 'lucide-react';
import { formatDateStr } from '../utils/dateHelpers';

// Sub-component to render a single month layer for the 3D transition
const MonthLayer = ({
  date,
  notes,
  addNote,
  deleteNote,
  updateNote,
  moveNote,
  getNotesForDay,
  getNotesForRange,
  searchQuery,
  setSearchQuery,
  startDate,
  endDate,
  hoveredDate,
  setHoveredDate,
  handleMouseDown,
  handleMouseEnter,
  handleDayClick,
  uploadedImage,
  setUploadedImage,
  navMonth,
  navToday,
  copyRange,
  isDarkMode,
  setIsDarkMode,
  editNoteId,
  setEditNoteId,
  editTitle,
  setEditTitle,
  editDesc,
  setEditDesc,
  editStartTime,
  setEditStartTime,
  editEndTime,
  setEditEndTime,
  editIsAllDay,
  setEditIsAllDay,
  isFlippingLayer = false,
  onColorSelected,
  fallbackColor = '#10b981'
}) => {
  const { dominantColor, extractColor } = useDominantColor(fallbackColor);

  // Notify parent of color update if this is the primary layer
  useEffect(() => {
    if (!isFlippingLayer && onColorSelected) {
      onColorSelected(dominantColor);
    }
  }, [dominantColor, isFlippingLayer, onColorSelected]);

  // Get notes for the month displayed in this layer
  const monthNotes = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = formatDateStr(new Date(year, month, 1));
    const lastDay = formatDateStr(new Date(year, month + 1, 0));

    let filtered = notes.filter(n => !(n.end < firstDay || n.start > lastDay));

    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(sq) ||
        (n.description && n.description.toLowerCase().includes(sq))
      );
    }
    return filtered.sort((a, b) => a.start.localeCompare(b.start));
  }, [notes, date, searchQuery]);

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-800 rounded-xl relative w-full h-full overflow-hidden ${isFlippingLayer ? 'shadow-2xl' : ''}`}>
      <HeroImage
        currentDate={date}
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
        currentDate={date}
      />

      <div className="p-2 md:p-5 pb-4 relative overflow-visible flex flex-col md:flex-row gap-3 flex-grow min-h-0">
        <div className="hidden md:flex flex-col gap-0 w-48 flex-shrink-0 border-r border-slate-100 dark:border-slate-700/50 pr-3 overflow-hidden pt-1">
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex-grow">Notes</p>
            <Search size={11} className="text-slate-400" />
          </div>

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[10px] pl-3 pr-1.5 py-1.5 mt-1 mb-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 placeholder:text-slate-300"
            style={{ '--tw-ring-color': dominantColor }}
          />

          <div className="flex-grow overflow-y-auto no-scrollbar space-y-2">
            {monthNotes.length > 0 ? monthNotes.map(note => (
              <div key={note.id} className="relative group/note">
                {editNoteId === note.id ? (
                  <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-1.5">
                    <input type="text" className="w-full text-[10px] p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
                    <textarea className="w-full text-[9px] p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded resize-none h-12 focus:outline-none" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" />
                    <div className="flex gap-1 justify-end">
                      <button className="text-green-500 hover:text-green-600" onClick={() => { updateNote(note.id, editTitle, editDesc, editStartTime, editEndTime, editIsAllDay); setEditNoteId(null); }}><Check size={12} /></button>
                      <button className="text-slate-400 hover:text-slate-600" onClick={() => setEditNoteId(null)}><X size={12} /></button>
                    </div>
                  </div>
                ) : (
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

        <div className="flex-grow relative overflow-visible">
          <CalendarGrid
            currentDate={date}
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

      <div className="md:hidden px-3 pb-2 flex-shrink-0">
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
          {monthNotes.length > 0 ? monthNotes.slice(0, 10).map(note => (
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
  );
};

export default function WallCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // 3D Flip States
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('up'); // 'up' for next, 'down' for prev
  const [stagedDate, setStagedDate] = useState(null);

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

  // Track the primary active color for the Date Range selection component
  const [activeColor, setActiveColor] = useState('#10b981');

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
  } = useDateRange(activeColor);

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
    if (isFlipping) return;

    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);

    if (offset > 0) {
      // Flip UP (Reveal next underneath)
      setFlipDirection('up');
      setStagedDate(currentDate); // The one that flips up
      setCurrentDate(nextDate);   // The one revealed underneath
    } else {
      // Flip DOWN (Reveal prev from above)
      setFlipDirection('down');
      setStagedDate(nextDate);    // The one that flips down
      setCurrentDate(nextDate);
    }

    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
      setStagedDate(null);
    }, 800);
  };

  const navToday = () => {
    const today = new Date();
    const target = new Date(today.getFullYear(), today.getMonth(), 1);
    if (target.getTime() === currentDate.getTime()) return;

    const offset = target > currentDate ? 1 : -1;
    navMonth(offset === 1 ? 1 : -1);
    setCurrentDate(target);
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

  const layerProps = {
    notes,
    addNote,
    deleteNote,
    updateNote,
    moveNote,
    getNotesForDay,
    getNotesForRange,
    searchQuery,
    setSearchQuery,
    startDate,
    endDate,
    hoveredDate,
    setHoveredDate,
    handleMouseDown,
    handleMouseEnter,
    handleDayClick,
    uploadedImage,
    setUploadedImage,
    navMonth,
    navToday,
    copyRange,
    isDarkMode,
    setIsDarkMode,
    editNoteId,
    setEditNoteId,
    editTitle,
    setEditTitle,
    editDesc,
    setEditDesc,
    editStartTime,
    setEditStartTime,
    editEndTime,
    setEditEndTime,
    editIsAllDay,
    setEditIsAllDay,
    fallbackColor: activeColor
  };

  return (
    <div className={`flex flex-col items-center max-w-4xl mx-auto w-full p-4 md:p-8 font-sans ${isDarkMode ? 'dark text-white' : 'text-slate-800'}`}>

      {/* Perspective Container for 3D Flip */}
      <div className="relative w-full perspective-1500 preserve-3d">

        {/* Spiral Binding Header - Stays static on top */}
        <div className="absolute top-0 left-0 w-full h-8 -mt-4 flex justify-around px-6 md:px-12 z-50 pointer-events-none print:hidden">
          {[...Array(22)].map((_, i) => (
            <div
              key={i}
              className={`w-3 md:w-4 h-10 rounded-full border-4 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-md transform -rotate-12 ${i >= 10 ? 'hidden md:block' : 'block'}`}
            ></div>
          ))}
        </div>

        {/* --- Lower Layer (The date we are moving TO) --- */}
        <div className="w-full relative z-10 shadow-xl rounded-xl overflow-visible">
          <MonthLayer
            {...layerProps}
            date={currentDate}
            onColorSelected={setActiveColor}
          />

          {/* Shadow Overlay during Flip */}
          {isFlipping && (
            <div className="absolute inset-0 z-20 bg-black rounded-xl animate-shadow-fade pointer-events-none" />
          )}
        </div>

        {/* --- Flipping Layer (The physical "page" that turns) --- */}
        {isFlipping && stagedDate && (
          <div
            className={`absolute inset-0 z-30 origin-top transform-style-3d backface-hidden pointer-events-none
              ${flipDirection === 'up' ? 'animate-flip-up' : 'animate-flip-down'}`}
          >
            <MonthLayer
              {...layerProps}
              date={stagedDate}
              isFlippingLayer={true}
            />
            {/* Backside of the page (simulated) */}
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 backface-hidden rotate-x-180 rounded-xl z-0"
              style={{ transform: 'rotateX(180deg)' }} />
          </div>
        )}

      </div>
    </div>
  );
}
