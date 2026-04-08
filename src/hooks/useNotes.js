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

    const addNote = useCallback((startStr, endStr, title, description) => {
        const newNote = {
            id: Date.now().toString(),
            start: startStr,
            end: endStr,
            title: title || 'Event',
            description,
            timestamp: new Date().toISOString()
        };
        setNotes(prev => [...prev, newNote]);
    }, []);

    const deleteNote = useCallback((id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    }, []);

    const updateNote = useCallback((id, updatedTitle, updatedDescription) => {
        setNotes(prev => prev.map(n => 
            n.id === id ? { ...n, title: updatedTitle || 'Event', description: updatedDescription } : n
        ));
    }, []);

    const hasNotesForDateStr = useCallback((dateStr) => {
        return notes.some(n => dateStr >= n.start && dateStr <= n.end);
    }, [notes]);

    const getNotesForDay = useCallback((dateStr) => {
        return notes.filter(n => dateStr >= n.start && dateStr <= n.end).map(n => ({
            ...n,
            title: n.title || 'Event',
            description: n.description || n.text || '' // map legacy text
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
        hasNotesForDateStr,
        getNotesForDay,
        getNotesForRange
    };
}
