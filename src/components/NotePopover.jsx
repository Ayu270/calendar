import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function NotePopover({ dateStr, dayNotes = [], onClose, onSave }) {
    const titleRef = useRef(null);
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);
    const inputRef = useRef(null);
    const [isAllDay, setIsAllDay] = useState(false);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, []);

    const sortedNotes = [...dayNotes].sort((a, b) => {
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
    });

    return (
        <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[110%] w-64 bg-white dark:bg-slate-700 shadow-2xl rounded-xl p-3 z-50 border border-slate-200 dark:border-slate-600 animate-in zoom-in-95 origin-bottom"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }} 
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
                <X size={16} />
            </button>
            <div className="text-xs font-bold mb-3 border-b border-slate-100 dark:border-slate-600 pb-1 pr-4">{dateStr}</div>
            
            {sortedNotes.length > 0 && (
                <div className="mb-3 max-h-40 overflow-y-auto custom-scrollbar pr-1 flex flex-col relative pl-2 border-l-2 border-slate-200 dark:border-slate-600 ml-1">
                    {sortedNotes.map(n => (
                        <div key={n.id} className="relative pb-3 last:pb-1">
                            <div className="absolute -left-[13px] top-1.5 w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 border-2 border-white dark:border-slate-700"></div>
                            <div className="pl-2 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                {n.isAllDay ? (
                                    <div className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-0.5">All Day</div>
                                ) : n.startTime ? (
                                    <div className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-0.5">{n.startTime} {n.endTime ? `- ${n.endTime}` : ''}</div>
                                ) : null}
                                <h4 className="text-[10px] font-bold leading-tight mb-0.5">{n.title}</h4>
                                {n.description && <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight whitespace-pre-wrap">{n.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <label className="text-[10px] font-semibold flex items-center gap-1 mb-1 cursor-pointer select-none">
                <input type="checkbox" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} className="rounded" />
                All Day
            </label>
            <div className="flex gap-1 mb-1">
                <input 
                    ref={titleRef}
                    type="text"
                    className="flex-grow text-xs font-bold p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1"
                    placeholder="Title..."
                />
            </div>
            {!isAllDay && (
                <div className="flex gap-1 mb-1">
                    <input 
                        ref={startTimeRef}
                        type="time"
                        className="flex-grow text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1"
                    />
                    <span className="self-center text-slate-400 font-bold">-</span>
                    <input 
                        ref={endTimeRef}
                        type="time"
                        className="flex-grow text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1"
                    />
                </div>
            )}
            <textarea 
                ref={inputRef}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded mb-2 resize-none h-16 focus:outline-none focus:ring-1"
                placeholder="Add a quick note..."
            ></textarea>
            <button 
                className="w-full py-1.5 text-[10px] font-bold text-white rounded bg-slate-800 dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-slate-400 transition"
                onClick={(e) => {
                    e.stopPropagation();
                    const titleVal = titleRef.current?.value || '';
                    const descVal = inputRef.current?.value || '';
                    const startVal = startTimeRef.current?.value || '';
                    const endVal = endTimeRef.current?.value || '';
                    if (titleVal.trim() || descVal.trim()) {
                        onSave(titleVal.trim(), descVal.trim(), startVal, endVal, isAllDay);
                    }
                }}
            >
                Save
            </button>
        </div>
    );
}
