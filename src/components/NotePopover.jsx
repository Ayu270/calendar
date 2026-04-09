import React, { useRef, useEffect, useState } from 'react';
import { X, Trash2, Edit2, Check, Clock, CalendarDays } from 'lucide-react';

export default function NotePopover({ 
    dateStr, 
    rangeLabel,
    dayNotes = [], 
    onClose, 
    onSave,
    onDelete,
    onUpdate,
    accentColor,
    dIdx // column index 0-6
}) {
    const titleRef = useRef(null);
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);
    const inputRef = useRef(null);
    const [isAllDay, setIsAllDay] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editStartTime, setEditStartTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');
    const [editIsAllDay, setEditIsAllDay] = useState(false);

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

    const accent = accentColor || '#64748b';

    return (
        <>
        {/* Mobile overlay backdrop */}
        <div 
            className="md:hidden fixed inset-0 bg-black/20 z-40"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        />
        <div 
            className={`fixed md:absolute inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:top-1/2 w-auto md:w-72 max-w-sm mx-auto md:mx-0 bg-white dark:bg-slate-700 shadow-2xl rounded-xl p-4 z-50 border border-slate-200 dark:border-slate-600 animate-in zoom-in-95 max-h-[90vh] md:max-h-[450px] overflow-y-auto custom-scrollbar
                ${dIdx >= 5 
                    ? 'md:right-0 md:left-auto md:translate-x-0 md:-translate-y-[100%] md:origin-bottom-right' 
                    : dIdx <= 1
                    ? 'md:left-0 md:right-auto md:translate-x-0 md:-translate-y-[100%] md:origin-bottom-left'
                    : 'md:left-1/2 md:right-auto md:-translate-x-1/2 md:-translate-y-[100%] md:origin-bottom'
                }
            `}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }} 
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 z-10"
            >
                <X size={16} />
            </button>
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 dark:border-slate-600 pb-2 pr-6">
                <CalendarDays size={14} style={{ color: accent }} />
                <div>
                    <div className="text-xs font-bold">{rangeLabel || dateStr}</div>
                </div>
            </div>
            
            {/* Existing Notes Timeline */}
            {sortedNotes.length > 0 && (
                <div className="mb-3 max-h-48 overflow-y-auto no-scrollbar pr-1 flex flex-col relative pl-2 border-l-2 ml-1" style={{ borderColor: accent + '40' }}>
                    {sortedNotes.map(n => (
                        <div key={n.id} className="relative pb-3 last:pb-1 group/note">
                            <div className="absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-700" style={{ backgroundColor: accent }}></div>
                            
                            {editingId === n.id ? (
                                /* Inline edit mode */
                                <div className="pl-2 bg-slate-50 dark:bg-slate-800 p-2 rounded flex flex-col gap-1.5">
                                    <input 
                                        type="text"
                                        className="w-full text-[11px] font-bold p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Title..."
                                    />
                                    <label className="text-[9px] font-semibold flex items-center gap-1 cursor-pointer select-none">
                                        <input type="checkbox" checked={editIsAllDay} onChange={(e) => setEditIsAllDay(e.target.checked)} className="rounded" />
                                        All Day
                                    </label>
                                    {!editIsAllDay && (
                                        <div className="flex gap-1">
                                            <input type="time" className="flex-grow text-[10px] p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded focus:outline-none" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} />
                                            <span className="self-center text-slate-400 text-[10px]">-</span>
                                            <input type="time" className="flex-grow text-[10px] p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded focus:outline-none" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
                                        </div>
                                    )}
                                    <textarea 
                                        className="w-full text-[10px] p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded resize-none h-12 focus:outline-none"
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        placeholder="Description..."
                                    />
                                    <div className="flex gap-1 justify-end">
                                        <button className="text-green-500 hover:text-green-600 p-1" onClick={() => { onUpdate(n.id, editTitle, editDesc, editStartTime, editEndTime, editIsAllDay); setEditingId(null); }}><Check size={12} /></button>
                                        <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setEditingId(null)}><X size={12} /></button>
                                    </div>
                                </div>
                            ) : (
                                /* Read mode */
                                <div className="pl-2 bg-slate-50 dark:bg-slate-800 p-2 rounded relative">
                                    <div className="absolute top-1 right-1 opacity-0 group-hover/note:opacity-100 transition-opacity flex gap-1">
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5" onClick={() => { setEditTitle(n.title); setEditDesc(n.description || ''); setEditStartTime(n.startTime || ''); setEditEndTime(n.endTime || ''); setEditIsAllDay(n.isAllDay || false); setEditingId(n.id); }} ><Edit2 size={10} /></button>
                                        <button className="text-red-400 hover:text-red-600 p-0.5" onClick={() => onDelete(n.id)}><Trash2 size={10} /></button>
                                    </div>
                                    {n.isAllDay ? (
                                        <div className="text-[9px] font-mono font-bold mb-0.5" style={{ color: accent }}>All Day</div>
                                    ) : n.startTime ? (
                                        <div className="text-[9px] font-mono font-bold mb-0.5" style={{ color: accent }}>{n.startTime}{n.endTime ? ` - ${n.endTime}` : ''}</div>
                                    ) : null}
                                    <h4 className="text-[11px] font-bold leading-tight mb-0.5 pr-8">{n.title}</h4>
                                    {n.description && <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight whitespace-pre-wrap">{n.description}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Add Note Form */}
            <div className={`${sortedNotes.length > 0 ? 'border-t border-slate-100 dark:border-slate-600' : ''} pt-3`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-slate-500 select-none">All Day</span>
                    <button
                        type="button"
                        onClick={() => setIsAllDay(!isAllDay)}
                        className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none ${isAllDay ? '' : 'bg-slate-300 dark:bg-slate-600'}`}
                        style={{ backgroundColor: isAllDay ? accent : undefined }}
                    >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${isAllDay ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                </div>
                <input 
                    ref={titleRef}
                    type="text"
                    className="w-full text-xs font-bold p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded mb-1.5 focus:outline-none focus:ring-1"
                    placeholder="Event title..."
                    style={{ '--tw-ring-color': accent }}
                />
                {!isAllDay && (
                    <div className="flex gap-1 mb-1.5 items-center">
                        <Clock size={10} className="text-slate-400 flex-shrink-0" />
                        <input 
                            ref={startTimeRef}
                            type="time"
                            className="flex-grow text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1"
                        />
                        <span className="text-slate-400 font-bold text-xs">—</span>
                        <input 
                            ref={endTimeRef}
                            type="time"
                            className="flex-grow text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded focus:outline-none focus:ring-1"
                        />
                    </div>
                )}
                <textarea 
                    ref={inputRef}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded mb-2 resize-none h-14 focus:outline-none focus:ring-1"
                    placeholder="Description (optional)..."
                ></textarea>
                <button 
                    className="w-full py-2 text-[11px] font-bold text-white rounded-lg transition-all active:scale-95 shadow-sm"
                    style={{ backgroundColor: accent }}
                    onClick={(e) => {
                        e.stopPropagation();
                        const titleVal = titleRef.current?.value || '';
                        const descVal = inputRef.current?.value || '';
                        const startVal = startTimeRef.current?.value || '';
                        const endVal = endTimeRef.current?.value || '';
                        if (titleVal.trim() || descVal.trim()) {
                            onSave(titleVal.trim(), descVal.trim(), startVal, endVal, isAllDay);
                            if (titleRef.current) titleRef.current.value = '';
                            if (inputRef.current) inputRef.current.value = '';
                            if (startTimeRef.current) startTimeRef.current.value = '';
                            if (endTimeRef.current) endTimeRef.current.value = '';
                            setIsAllDay(false);
                        }
                    }}
                >
                    + Save Note
                </button>
            </div>
        </div>
        </>
    );
}
