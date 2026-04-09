import React, { useState, useEffect } from 'react';

export default function DateCell({
    date,
    dayOfMonth,
    dIdx,
    isCurrentMonth,
    isToday,
    isStart,
    isEnd,
    inRange,
    dayNotes = [],
    holidayName,
    accentColor,
    tooltipStr,
    daysSpanBadge,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onClick,
    isPopoverOpen,
    renderPopover,
    searchQuery,
    dateStr,
    moveNote
}) {
    const isHovered = !!tooltipStr || !!daysSpanBadge; // proxy for hover context
    const isWeekend = dIdx >= 5;

    const hasSearchMatch = searchQuery 
        ? dayNotes.some(n => 
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (n.description && n.description.toLowerCase().includes(searchQuery.toLowerCase()))
          ) || (holidayName && holidayName.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

    let baseClasses = "relative h-12 md:h-16 border rounded-lg transition-all duration-200 cursor-pointer flex flex-col pt-1 pb-1 px-2 select-none ";
    
    if (searchQuery && !hasSearchMatch) {
        baseClasses += "opacity-30 hover:opacity-50 grayscale ";
    }
    if (searchQuery && hasSearchMatch && isCurrentMonth) {
        baseClasses += "ring-2 shadow-md z-10 ";
    }
    
    if (isCurrentMonth) {
        baseClasses += "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:z-10 ";
    } else {
        baseClasses += "bg-slate-50 dark:bg-slate-800/20 border-slate-50 dark:border-transparent text-slate-300 dark:text-slate-600 ";
    }
    
    let dynamicStyle = {};
    if (searchQuery && hasSearchMatch && isCurrentMonth) {
        dynamicStyle['--tw-ring-color'] = accentColor;
    }
    if (inRange && (!isStart && !isEnd)) {
        baseClasses += "scale-x-105 rounded-none z-0 border-transparent ";
        dynamicStyle = { ...dynamicStyle, backgroundColor: accentColor, opacity: 0.15 }; 
    }
    if (isStart || isEnd) {
        baseClasses += "z-10 shadow-md font-bold scale-105 text-white ";
        dynamicStyle = { ...dynamicStyle, backgroundColor: accentColor, borderColor: accentColor };
    }

    if (isHovered && !inRange) {
        baseClasses += "scale-105 z-20 hover:shadow-lg ";
    }

    return (
        <div 
            className="relative"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
            onClick={onClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const noteId = e.dataTransfer.getData('noteId');
                if (noteId && moveNote && dateStr) {
                    moveNote(noteId, dateStr);
                    e.stopPropagation();
                }
            }}
        >
            {inRange && !isStart && !isEnd && (
                <div className="absolute inset-y-1 -inset-x-1 sm:-inset-x-2 rounded-md pointer-events-none" style={{ backgroundColor: accentColor, opacity: 0.15 }}></div>
            )}
            
            <div 
                className={`${baseClasses} ${(isStart && !isEnd) ? 'rounded-r-none' : ''} ${(!isStart && isEnd) ? 'rounded-l-none' : ''}`}
                style={dynamicStyle}
            >
                <div className="flex justify-between items-start leading-none h-full relative z-10 w-full">
                    <span 
                        className={`text-sm md:text-base ${(isToday && !isStart && !isEnd) ? 'w-6 h-6 flex items-center justify-center rounded-full text-white' : ''}`}
                        style={{
                            color: (isWeekend && isCurrentMonth && !isStart && !isEnd) ? accentColor : undefined,
                            backgroundColor: (isToday && !isStart && !isEnd) ? accentColor : undefined
                        }}
                    >
                        {dayOfMonth}
                    </span>

                    {holidayName && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 absolute top-1 right-1" title={holidayName}></div>
                    )}
                    
                    {dayNotes.length > 0 && (
                        <div className="absolute top-1 flex gap-0.5 md:gap-1" style={{ right: holidayName ? '0.75rem' : '0.25rem' }}>
                            {dayNotes.slice(0, 3).map((note, idx) => (
                                <div key={idx} className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full" style={{ backgroundColor: isStart||isEnd ? 'white' : accentColor }} title={note.title}></div>
                            ))}
                            {dayNotes.length > 3 && (
                                <div className="text-[8px] leading-none" style={{ color: isStart||isEnd ? 'white' : accentColor, marginTop: '-2px' }}>+</div>
                            )}
                        </div>
                    )}
                </div>
                
                {holidayName && (
                    <div className="text-[8px] md:text-[9px] leading-tight text-red-500 font-semibold truncate absolute bottom-1 left-1.5 right-1.5 pointer-events-none z-20">
                        {holidayName}
                    </div>
                )}

                {dayNotes.length > 0 && (
                    <div 
                         draggable
                         onDragStart={(e) => {
                             e.stopPropagation();
                             e.dataTransfer.setData('noteId', dayNotes[0].id);
                         }}
                         className="text-[8px] md:text-[9px] leading-tight font-semibold truncate absolute left-1.5 right-1.5 z-20 opacity-80 cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity" 
                         style={{ 
                             bottom: holidayName ? '14px' : '4px',
                             color: (isStart || isEnd) ? 'white' : accentColor
                         }}
                    >
                        {dayNotes[0].title}
                    </div>
                )}
            </div>
            
            {tooltipStr && !isPopoverOpen && !inRange && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[120%] bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-medium whitespace-nowrap z-50 shadow-xl pointer-events-none fade-in">
                    {tooltipStr}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
            )}
            
            {daysSpanBadge > 0 && (
                <div className="absolute -top-3 -right-3 bg-slate-800 dark:bg-white text-white dark:text-slate-800 text-[9px] py-0.5 px-1.5 rounded-full font-bold z-50 shadow-lg pointer-events-none">
                    {daysSpanBadge} days
                </div>
            )}

            {isPopoverOpen && renderPopover()}
        </div>
    );
}
