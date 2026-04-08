import { useState, useEffect, useCallback } from 'react';

export function useNotes() {
    const [notes, setNotes] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('calendar_notes')) || [];
        } catch { 
            return []; 
        }
    });

    useEffect(() => {
        localStorage.setItem('calendar_notes', JSON.stringify(notes));
    }, [notes]);

    const addNote = useCallback((startStr, endStr, title, description, startTime, endTime, isAllDay) => {
        const newNote = {
            id: Date.now().toString(),
            start: startStr,
            end: endStr,
            title: title || 'Event',
            description,
            startTime,
            endTime,
            isAllDay,
            timestamp: new Date().toISOString()
        };
        setNotes(prev => [...prev, newNote]);
    }, []);

    const deleteNote = useCallback((id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    }, []);

    const updateNote = useCallback((id, updatedTitle, updatedDescription, startTime, endTime, isAllDay) => {
        setNotes(prev => prev.map(n => 
            n.id === id ? { ...n, title: updatedTitle || 'Event', description: updatedDescription, startTime, endTime, isAllDay } : n
        ));
    }, []);

    const moveNote = useCallback((id, targetDateStr) => {
        setNotes(prev => prev.map(n => {
            if (n.id === id) {
                const sDate = new Date(n.start + "T00:00:00");
                const eDate = new Date(n.end + "T00:00:00");
                const diffDays = Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
                
                const newStartDate = new Date(targetDateStr + "T00:00:00");
                const newEndDate = new Date(newStartDate.getTime() + (diffDays * 24 * 60 * 60 * 1000));
                
                const format = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                
                return { ...n, start: format(newStartDate), end: format(newEndDate) };
            }
            return n;
        }));
    }, []);

    const hasNotesForDateStr = useCallback((dateStr) => {
        return notes.some(n => dateStr >= n.start && dateStr <= n.end);
    }, [notes]);

    const getNotesForDay = useCallback((dateStr) => {
        return notes.filter(n => dateStr >= n.start && dateStr <= n.end).map(n => ({
            ...n,
            title: n.title || 'Event',
            description: n.description || n.text || '',
            startTime: n.startTime || n.time || ''
        }));
    }, [notes]);

    const getNotesForRange = useCallback((startStr, endStr) => {
        return notes.filter(n => n.start === startStr && n.end === endStr).map(n => ({
            ...n,
            title: n.title || 'Event',
            description: n.description || n.text || ''
        }));
    }, [notes]);

    return {
        notes: notes.map(n => ({ ...n, title: n.title || 'Event', description: n.description || n.text || '' })),
        addNote,
        deleteNote,
        updateNote,
        moveNote,
        hasNotesForDateStr,
        getNotesForDay,
        getNotesForRange
    };
}
