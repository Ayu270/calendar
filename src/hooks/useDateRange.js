import { useState, useCallback, useEffect } from 'react';

export function useDateRange(accentColor) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hoveredDate, setHoveredDate] = useState(null);

    const handleMouseDown = useCallback((date) => {
        setStartDate(date);
        setEndDate(date);
        setIsDragging(true);
    }, []);

    const handleMouseEnter = useCallback((date) => {
        setHoveredDate(date);
        if (isDragging) {
            setEndDate(date);
        }
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
        }
    }, [isDragging]);

    const handleDayClick = useCallback((date) => {
        // If it's a simple click without dragging (start & end same day), we just set it
        if (!isDragging) {
            // we let the caller handle special 'same-day click' logic if needed
        }
    }, [isDragging]);

    const clearRange = useCallback(() => {
        setStartDate(null);
        setEndDate(null);
        setHoveredDate(null);
        setIsDragging(false);
    }, []);

    // Global mouseup to catch releases outside the grid
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handleMouseUp();
            }
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging, handleMouseUp]);

    // Keyboard ESC to clear
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                clearRange();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [clearRange]);

    return {
        startDate,
        endDate,
        isDragging,
        hoveredDate,
        setHoveredDate, // exposes setter if necessary
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        handleDayClick,
        clearRange,
        // Override state capability
        setStartDate,
        setEndDate
    };
}
