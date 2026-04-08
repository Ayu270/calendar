export const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};

export const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Map Sun(0) to 6, Mon(1) to 0, ...
};

export const getISOWeekNumber = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
};

export const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

export const isInRange = (date, start, end) => {
    if (!date || !start || !end) return false;
    const tDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const sDate = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const eDate = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    
    const s = Math.min(sDate, eDate);
    const e = Math.max(sDate, eDate);
    return tDate >= s && tDate <= e;
};

export const formatDisplay = (date) => {
    if (!date) return '';
    const f = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return f.format(date);
};

// Internal utility to serialize dates consistently e.g. for localStorage/Note Keys.
export const formatDateStr = (d) => {
    if (!d) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const parseDateStr = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split('-');
    return new Date(y, m - 1, d);
};
