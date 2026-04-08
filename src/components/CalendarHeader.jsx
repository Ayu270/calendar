import React from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Copy, Download } from 'lucide-react';
import { exportToICS } from '../utils/icsExport';

export default function CalendarHeader({ 
    accentColor, 
    navMonth, 
    navToday, 
    copyRange, 
    isDarkMode, 
    toggleDarkMode,
    startDate,
    endDate,
    notes,
    getNotesForRange
}) {
    const handleExport = () => {
        if (!startDate) return;
        const end = endDate || startDate;
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        const rangeNotes = getNotesForRange(startStr, endStr);
        const defaultTitle = 'Selected Date Range';
        const title = rangeNotes.length > 0 ? rangeNotes[0].title : defaultTitle;
        const desc = rangeNotes.length > 0 ? rangeNotes[0].description : '';
        exportToICS(startDate, end, title, desc);
    };

    return (
        <div className="p-4 md:p-6 pb-2 flex justify-between items-center bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700" style={{ borderTop: `4px solid ${accentColor}`}}>
           <div className="flex gap-1 md:gap-2 print:hidden items-center">
              <button onClick={() => navMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition" aria-label="Previous Month">
                <ChevronLeft size={20}/>
              </button>
              <button onClick={navToday} className="px-3 md:px-4 py-1.5 font-semibold text-sm rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                Today
              </button>
              <button onClick={() => navMonth(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition" aria-label="Next Month">
                <ChevronRight size={20}/>
              </button>
           </div>
           
           <div className="flex gap-2 print:hidden items-center text-slate-500">
              <button onClick={copyRange} disabled={!startDate} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-30" title="Copy Range text">
                 <Copy size={18} />
              </button>
              <button onClick={handleExport} disabled={!startDate} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-30" title="Export .ics file">
                 <Download size={18} />
              </button>
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition ml-2">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
           </div>
        </div>
    );
}
