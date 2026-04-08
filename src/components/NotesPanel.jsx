import React, { useRef, useState } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDisplay, formatDateStr } from '../utils/dateHelpers';

export default function NotesPanel({ 
    startDate, 
    endDate, 
    accentColor, 
    notes, 
    addNote,
    updateNote, 
    deleteNote 
}) {
    const [editNoteId, setEditNoteId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [showAllNotes, setShowAllNotes] = useState(false);
    const titleRef = useRef(null);
    const textareaRef = useRef(null);
    const activeEnd = endDate || startDate;

    let daysSpanBadge = 0;
    if (startDate && activeEnd) {
        const diff = Math.ceil(Math.abs(activeEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        daysSpanBadge = diff + 1;
    }

    const handleSaveNote = () => {
        const titleVal = titleRef.current?.value || '';
        const descVal = textareaRef.current?.value || '';
        if (!descVal.trim() && !titleVal.trim()) return;
        if (!startDate) return;

        const startStr = formatDateStr(new Date(Math.min(startDate.getTime(), activeEnd.getTime())));
        const endStr = formatDateStr(new Date(Math.max(startDate.getTime(), activeEnd.getTime())));
        
        addNote(startStr, endStr, titleVal.trim() || 'Event', descVal.trim());
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [accentColor || '#10b981', '#ffffff', '#e2e8f0']
        });
        if (titleRef.current) titleRef.current.value = '';
        if (textareaRef.current) textareaRef.current.value = '';
    };

    const startStr = startDate ? formatDateStr(new Date(Math.min(startDate.getTime(), activeEnd.getTime()))) : null;
    const endStr = activeEnd ? formatDateStr(new Date(Math.max(startDate.getTime(), activeEnd.getTime()))) : null;

    const visibleNotes = notes.filter(n => {
        if (showAllNotes) return true;
        if (!startStr || !endStr) return true; // If no range selected, show all by default
        return !(n.end < startStr || n.start > endStr); // overlap logic
    });

    return (
        <div className="w-full lg:w-80 flex flex-col gap-4 print:hidden">
            
            {/* Box 1: Event Notes Form */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl shadow-lg border border-white/20 dark:border-slate-700/30 backdrop-blur-sm p-5 h-fit">
                <div className="flex items-center gap-3 mb-5 shadow-sm pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Event Notes</h2>
                        <p className="text-xs text-slate-500">Attach notes to selected range</p>
                    </div>
                </div>

                {startDate ? (
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-2">
                        <div className="text-sm font-semibold mb-1 flex justify-between">
                            <span>Selected Range:</span>
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 rounded-full py-0.5" style={{color: accentColor}}>{daysSpanBadge} day(s)</span>
                        </div>
                        <div className="text-xs text-slate-500 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
                     {formatDisplay(startDate)} {startDate.getTime() !== activeEnd.getTime() ? ` to ${formatDisplay(activeEnd)}` : ''}
                 </div>
                 
                 <input 
                     ref={titleRef}
                     type="text"
                     className="w-full text-sm font-bold p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2"
                     placeholder="Event Title..."
                     style={{ focusRingColor: accentColor }}
                 />

                 <textarea 
                     ref={textareaRef}
                     className="w-full text-sm p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 resize-none h-20"
                     placeholder="Event description..."
                     style={{ focusRingColor: accentColor }}
                 ></textarea>
                 
                 <button 
                    className="w-full py-2 mt-1 text-sm font-bold text-white rounded-lg shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2"
                    style={{ backgroundColor: accentColor }}
                    onClick={handleSaveNote}
                 >
                     <Plus size={16} /> Save Note
                 </button>
             </div>
         ) : (
             <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl mb-6">
                 Select a date range on the calendar to add a note.
             </div>
         )}
         </div>

         {/* Box 2: Saved Notes List */}
         <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl shadow-lg border border-white/20 dark:border-slate-700/30 backdrop-blur-sm p-6 flex flex-col max-h-[600px]">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Saved Notes ({visibleNotes.length})</h3>
                 <button 
                     onClick={() => setShowAllNotes(!showAllNotes)}
                     className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition px-2 py-1 rounded bg-slate-100 dark:bg-slate-700"
                 >
                     {showAllNotes || !startDate ? 'Showing All' : 'Show All'}
                 </button>
             </div>
             
             <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3">
                 {visibleNotes.map(note => (
                     <div key={note.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border-l-4 border-slate-100 dark:border-slate-700 relative group" style={{ borderLeftColor: accentColor }}>
                     {editNoteId === note.id ? (
                         <div className="flex flex-col gap-2">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="text-[10px] font-mono text-slate-400">{note.start} {note.start !== note.end ? ` - ${note.end}` : ''}</span>
                                 <div className="flex gap-2">
                                     <button className="text-green-500 hover:text-green-600 transition" onClick={() => {
                                         updateNote(note.id, editTitle, editDesc);
                                         setEditNoteId(null);
                                     }}><Check size={14}/></button>
                                     <button className="text-slate-400 hover:text-slate-600 transition" onClick={() => setEditNoteId(null)}><X size={14}/></button>
                                 </div>
                             </div>
                             <input 
                                 type="text" 
                                 className="w-full text-sm font-bold p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1"
                                 style={{ focusRingColor: accentColor }}
                                 value={editTitle}
                                 onChange={(e) => setEditTitle(e.target.value)}
                                 placeholder="Event Title..."
                             />
                             <textarea 
                                 className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded resize-none h-16 focus:outline-none focus:ring-1"
                                 style={{ focusRingColor: accentColor }}
                                 value={editDesc}
                                 onChange={(e) => setEditDesc(e.target.value)}
                                 placeholder="Event description..."
                             />
                         </div>
                     ) : (
                         <>
                             <div className="text-[10px] font-mono text-slate-400 mb-1 flex justify-between">
                                 <span>{note.start} {note.start !== note.end ? ` - ${note.end}` : ''}</span>
                                 <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                     <button 
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        onClick={() => {
                                            setEditTitle(note.title);
                                            setEditDesc(note.description);
                                            setEditNoteId(note.id);
                                        }}
                                     >
                                         <Edit2 size={12} />
                                     </button>
                                     <button 
                                        className="text-red-400 hover:text-red-600"
                                        onClick={() => deleteNote(note.id)}
                                     >
                                         <Trash2 size={12} />
                                     </button>
                                 </div>
                             </div>
                             <h4 className="font-bold text-sm mb-1">{note.title}</h4>
                             {note.description && <p className="text-xs whitespace-pre-wrap text-slate-600 dark:text-slate-300">{note.description}</p>}
                         </>
                     )}
                 </div>
             ))}
             {visibleNotes.length === 0 && (
                 <div className="text-xs text-slate-400 text-center italic mt-4">No notes match current filter.</div>
             )}
             </div>
         </div>
        </div>
    );
}
