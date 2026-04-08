export const exportToICS = (startDate, endDate, titleStr, descriptionStr) => {
    if (!startDate) return;
    
    // Normalize dates
    const exportEnd = endDate || startDate;
    const realStart = new Date(Math.min(startDate.getTime(), exportEnd.getTime()));
    const realEnd = new Date(Math.max(startDate.getTime(), exportEnd.getTime()));
    
    // VCALENDAR endDate is exclusive for full day events, so add 1 day
    realEnd.setDate(realEnd.getDate() + 1);

    const formatICSDate = (d) => d.toISOString().replace(/[-:]/g, '').split('T')[0];
    
    const description = descriptionStr ? descriptionStr.replace(/\n/g, '\\n') : '';
    const title = titleStr ? titleStr : 'Calendar Event';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wall Calendar Component//EN
BEGIN:VEVENT
DTSTART;VALUE=DATE:${formatICSDate(realStart)}
DTEND;VALUE=DATE:${formatICSDate(realEnd)}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'calendar_event.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
