import React, { useMemo, useState, useRef } from 'react';
import DateCell from './DateCell';
import NotePopover from './NotePopover';
import { getDaysInMonth, getFirstDayOfMonth, getISOWeekNumber, isSameDay, isInRange, formatDateStr, formatDisplay } from '../utils/dateHelpers';
import { HOLIDAYS } from '../utils/holidays';
import confetti from 'canvas-confetti';

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarGrid({ 
    currentDate, 
    accentColor,
    startDate,
    endDate,
    hoveredDate,
    setHoveredDate,
    handleMouseDown,
    handleMouseEnter,
    handleDayClick,
    getNotesForDay,
    addNote,
    deleteNote,
    updateNote,
    moveNote,
    searchQuery,
    onRangePopoverOpen,
    onRangePopoverClose
}) {
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const [activePopoverDateStr, setActivePopoverDateStr] = useState(null);
    const [rangePopoverDateStr, setRangePopoverDateStr] = useState(null);
    const mouseDownDateRef = useRef(null);
    const prevPopoverRef = useRef(null);

    const days = useMemo(() => {
        const daysInMonthCount = getDaysInMonth(currentYear, currentMonth).length;
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const daysArr = [];

        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            daysArr.push({ date: new Date(currentYear, currentMonth - 1, prevMonthDays - firstDay + i + 1), isCurrentMonth: false });
        }
        
        for (let i = 1; i <= daysInMonthCount; i++) {
            daysArr.push({ date: new Date(currentYear, currentMonth, i), isCurrentMonth: true });
        }

        const remaining = 42 - daysArr.length;
        for (let i = 1; i <= remaining; i++) {
            daysArr.push({ date: new Date(currentYear, currentMonth + 1, i), isCurrentMonth: false });
        }

        const weeks = [];
        for(let i=0; i<daysArr.length; i+=7) {
            weeks.push(daysArr.slice(i, i+7));
        }
        return weeks;
    }, [currentYear, currentMonth]);

    const getHolidayName = (date) => {
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const hol = HOLIDAYS.find(h => h.month === m && h.day === d);
        return hol ? hol.name : null;
    };

    const getTooltipStr = (date, hoverDate) => {
        if (!hoverDate || !isSameDay(date, hoverDate)) return "";
        const diffTime = (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) return `in ${diffDays} day${diffDays>1?'s':''}`;
        if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays)>1?'s':''} ago`;
        return "Today";
    };

    // Gather notes for the whole range when showing range popover
    const getRangeNotes = () => {
        if (!startDate || !endDate) return [];
        const s = new Date(Math.min(startDate.getTime(), endDate.getTime()));
        const e = new Date(Math.max(startDate.getTime(), endDate.getTime()));
        const allNotes = [];
        const seen = new Set();
        let cur = new Date(s);
        while (cur <= e) {
            const ds = formatDateStr(cur);
            const dayN = getNotesForDay(ds);
            dayN.forEach(n => {
                if (!seen.has(n.id)) { seen.add(n.id); allNotes.push(n); }
            });
            cur.setDate(cur.getDate() + 1);
        }
        return allNotes;
    };

    const getRangeLabel = () => {
        if (!startDate) return '';
        const activeEnd = endDate || startDate;
        const s = new Date(Math.min(startDate.getTime(), activeEnd.getTime()));
        const e = new Date(Math.max(startDate.getTime(), activeEnd.getTime()));
        if (s.getTime() === e.getTime()) return formatDisplay(s);
        const diff = Math.ceil((e - s) / (1000*60*60*24)) + 1;
        return `${formatDisplay(s)} – ${formatDisplay(e)} (${diff} days)`;
    };

    return (
        <div className="grid grid-cols-[30px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-y-1 md:gap-y-2 gap-x-0.5 md:gap-x-1" onMouseLeave={() => setHoveredDate(null)}>
            {/* Grid Header */}
            <div className="col-span-8 grid grid-cols-[30px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 mb-2 text-[10px] md:text-sm font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                <div className="text-center py-2 opacity-50">W#</div>
                {DAY_NAMES.map((d, i) => (
                    <div key={d} className="text-center py-2" style={{ color: i >= 5 ? accentColor : undefined }}>{d}</div>
                ))}
            </div>

            {/* Grid Body */}
            {days.map((week, wIdx) => {
                const weekNum = getISOWeekNumber(week[0].date);
                return (
                    <React.Fragment key={`week-${wIdx}`}>
                        <div className="flex items-center justify-center text-[10px] leading-tight md:text-xs text-slate-300 dark:text-slate-600 border-r border-slate-100 dark:border-slate-700/30 pr-1 md:pr-2 font-mono">
                            {weekNum}
                        </div>
                        
                        {week.map((day, dIdx) => {
                            const dateStr = formatDateStr(day.date);
                            const inRange = isInRange(day.date, startDate, endDate || hoveredDate);
                            const activeEnd = endDate || hoveredDate;
                            const isStart = isSameDay(day.date, startDate);
                            const isEnd = activeEnd ? isSameDay(day.date, activeEnd) : isStart;
                            
                            let daysSpanBadge = 0;
                            if (isEnd && startDate && !isSameDay(startDate, activeEnd)) {
                                const diff = Math.ceil(Math.abs(activeEnd - startDate) / (1000 * 60 * 60 * 24));
                                daysSpanBadge = diff + 1;
                            }

                            const handleClick = (e) => {
                                handleDayClick(day.date);
                            };

                            // Determine which popover to show
                            const showSinglePopover = activePopoverDateStr === dateStr;
                            const showRangePopover = rangePopoverDateStr === dateStr && endDate;

                            return (
                                <DateCell 
                                    key={dIdx}
                                    dateStr={dateStr}
                                    date={day.date}
                                    dayOfMonth={day.date.getDate()}
                                    dIdx={dIdx}
                                    isCurrentMonth={day.isCurrentMonth}
                                    isToday={isSameDay(day.date, today)}
                                    isStart={isStart}
                                    isEnd={isEnd}
                                    inRange={inRange}
                                    dayNotes={getNotesForDay(dateStr)}
                                    holidayName={getHolidayName(day.date)}
                                    accentColor={accentColor}
                                    tooltipStr={getTooltipStr(day.date, hoveredDate)}
                                    daysSpanBadge={daysSpanBadge}
                                    onMouseDown={(e) => { 
                                        if (e.target.closest('[draggable="true"]') || e.target.closest('[draggable]')) return;
                                        e.preventDefault();
                                        // Remember if a popover was open on this cell before clearing
                                        prevPopoverRef.current = activePopoverDateStr || rangePopoverDateStr;
                                        setActivePopoverDateStr(null);
                                        setRangePopoverDateStr(null);
                                        handleMouseDown(day.date);
                                        mouseDownDateRef.current = dateStr;
                                    }}
                                    onMouseUp={() => {
                                        const downDateStr = mouseDownDateRef.current;
                                        const wasOpen = prevPopoverRef.current;
                                        mouseDownDateRef.current = null;
                                        prevPopoverRef.current = null;
                                        
                                        if (downDateStr === dateStr) {
                                            // Single date click — toggle: close if was already open on this cell
                                            if (wasOpen === dateStr) return; // was open, mouseDown closed it → stay closed
                                            setTimeout(() => {
                                                setActivePopoverDateStr(dateStr);
                                            }, 10);
                                        } else if (downDateStr && downDateStr !== dateStr) {
                                            // Range completed — show range popover on drop cell
                                            setTimeout(() => {
                                                setRangePopoverDateStr(dateStr);
                                            }, 10);
                                        }
                                    }}
                                    onMouseEnter={() => handleMouseEnter(day.date)}
                                    onClick={handleClick}
                                    searchQuery={searchQuery}
                                    isPopoverOpen={showSinglePopover || showRangePopover}
                                    moveNote={moveNote}
                                    renderPopover={() => {
                                        if (showRangePopover) {
                                            // Range popover — shows notes across the entire range
                                            const rangeNotes = getRangeNotes();
                                            const rangeStartStr = formatDateStr(new Date(Math.min(startDate.getTime(), endDate.getTime())));
                                            const rangeEndStr = formatDateStr(new Date(Math.max(startDate.getTime(), endDate.getTime())));
                                            return (
                                                <NotePopover 
                                                    dateStr={dateStr}
                                                    dIdx={dIdx}
                                                    rangeLabel={getRangeLabel()}
                                                    dayNotes={rangeNotes}
                                                    accentColor={accentColor}
                                                    onClose={() => { setRangePopoverDateStr(null); if (onRangePopoverClose) onRangePopoverClose(); }}
                                                    onDelete={deleteNote}
                                                    onUpdate={updateNote}
                                                    onSave={(title, desc, startTime, endTime, isAllDay) => {
                                                        addNote(rangeStartStr, rangeEndStr, title, desc, startTime, endTime, isAllDay);
                                                        confetti({
                                                            particleCount: 100,
                                                            spread: 70,
                                                            origin: { y: 0.6 },
                                                            colors: [accentColor || '#10b981', '#ffffff', '#e2e8f0']
                                                        });
                                                        setRangePopoverDateStr(null);
                                                    }}
                                                />
                                            );
                                        }
                                        // Single-date popover
                                        return (
                                            <NotePopover 
                                                dateStr={dateStr}
                                                dIdx={dIdx}
                                                dayNotes={getNotesForDay(dateStr)}
                                                accentColor={accentColor}
                                                onClose={() => setActivePopoverDateStr(null)}
                                                onDelete={deleteNote}
                                                onUpdate={updateNote}
                                                onSave={(title, desc, startTime, endTime, isAllDay) => {
                                                    addNote(dateStr, dateStr, title, desc, startTime, endTime, isAllDay);
                                                    confetti({
                                                        particleCount: 100,
                                                        spread: 70,
                                                        origin: { y: 0.6 },
                                                        colors: [accentColor || '#10b981', '#ffffff', '#e2e8f0']
                                                    });
                                                    setActivePopoverDateStr(null);
                                                }}
                                            />
                                        );
                                    }}
                                />
                            );
                        })}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
