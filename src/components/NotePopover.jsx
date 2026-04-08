import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NotePopover({ dateStr, dayNotes = [], onClose, onSave }) {
    const titleRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, []);

    return (
        <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[110%] w-56 bg-white dark:bg-slate-700 shadow-2xl rounded-xl p-3 z-50 border border-slate-200 dark:border-slate-600 animate-in zoom-in-95 origin-bottom"
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
            
            {dayNotes.length > 0 && (
                <div className="mb-3 max-h-32 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2">
                    {dayNotes.map(n => (
                        <div key={n.id} className="bg-slate-50 dark:bg-slate-800 p-2 rounded border-l-2 border-slate-300 dark:border-slate-500">
                            <h4 className="text-[10px] font-bold leading-tight mb-0.5">{n.title}</h4>
                            {n.description && <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight whitespace-pre-wrap">{n.description}</p>}
                        </div>
                    ))}
                </div>
            )}
            
            <input 
                ref={titleRef}
                type="text"
                className="w-full text-xs font-bold p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded mb-1 focus:outline-none focus:ring-1"
                placeholder="Title..."
                id={`popover-title-${dateStr}`}
            />
            <textarea 
                ref={inputRef}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded mb-2 resize-none h-16 focus:outline-none focus:ring-1"
                placeholder="Add a quick note..."
                id={`popover-note-${dateStr}`}
            ></textarea>
            <button 
                className="w-full py-1 text-[10px] font-bold text-white rounded bg-slate-800 dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-slate-400 transition"
                onClick={(e) => {
                    e.stopPropagation();
                    const titleVal = titleRef.current?.value || '';
                    const descVal = inputRef.current?.value || '';
                    if (titleVal.trim() || descVal.trim()) {
                        onSave(titleVal.trim(), descVal.trim());
                    }
                }}
            >
                Save
            </button>
        </div>
    );
}
