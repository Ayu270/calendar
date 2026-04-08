import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import HeroImage from './HeroImage';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import { useDateRange } from '../hooks/useDateRange';
import { useNotes } from '../hooks/useNotes';
import { useDominantColor } from '../hooks/useDominantColor';

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

  const { dominantColor, extractColor } = useDominantColor('#10b981'); // fallback is spring green

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

  return (
    <div className={`flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full p-4 md:p-8 font-sans ${isDarkMode ? 'dark text-white' : 'text-slate-800'}`}>
      
      {/* --- Calendar Area --- */}
      <div 
        className="flex-grow flex flex-col bg-white dark:bg-slate-800 rounded-xl relative z-10 w-full max-w-3xl"
        style={{
          boxShadow: isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0,0,0,0.05)'
        }}
      >
        {/* Spiral Binding Header */}
        <div className="absolute top-0 left-0 w-full h-8 -mt-4 flex justify-around px-12 z-30 pointer-events-none print:hidden">
            {[...Array(22)].map((_, i) => (
                <div key={i} className="w-3 md:w-4 h-10 rounded-full border-4 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 block shadow-md transform -rotate-12"></div>
            ))}
        </div>

        <div className="flex-grow flex flex-col perspective-1000 z-10">
            <div className={`flex-grow flex flex-col transition-all duration-500 transform-style-3d origin-top ${isAnimatingCurl ? (curlDirection === 'next' ? 'rotate-x-45 scale-95 opacity-0' : '-rotate-x-45 scale-95 opacity-0') : 'scale-100 opacity-100'}`}>
                <HeroImage 
                    currentDate={currentDate} 
                    uploadedImage={uploadedImage} 
                    setUploadedImage={setUploadedImage} 
                    extractColor={extractColor} 
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

                {/* Grid Container */}
                <div className="flex-grow p-2 md:p-6 pb-8 relative overflow-visible">
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
                        moveNote={moveNote}
                        searchQuery={searchQuery}
                     />
                </div>
            </div>
        </div>
      </div>

      {/* --- Notes Panel --- */}
      <NotesPanel 
         startDate={startDate}
         endDate={endDate}
         accentColor={dominantColor}
         notes={notes}
         addNote={addNote}
         updateNote={updateNote}
         deleteNote={deleteNote}
         searchQuery={searchQuery}
         setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
