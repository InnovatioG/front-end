import { format, parseISO } from 'date-fns';

export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
export function formatMoney(amount: number, currency: string): string {
    if (currency === 'ADA') {
        return `₳${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)}`;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}
export function getTimeRemaining(endDate: string) {
    const total = Date.parse(endDate) - Date.parse(new Date().toISOString());
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);

    return { total, days, totalHours, minutes };
}

export const formatTime = (time: number) => time.toString().padStart(2, '0');

/* Funcion para calcular el porcentaje en base a un total y el % a aplicar */

export const calculatePorcentage = (total: number, porcentage: number) => {
    return (total * porcentage) / 100;
};

export const formatLink = (link: string) => {
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return `http://${link}`;
    }
    return link;
};

export const getOrdinalString = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'numeric', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

export const getMonthName = (date: string): string => {
    const dateFormatted = parseISO(date);
    return format(dateFormatted, 'MMMM');
};

export const getWeekOfMonth = (date: string): number => {
    const dateFormatted = parseISO(date);
    const week = Math.ceil((dateFormatted.getDate() + 1) / 7);
    return week;
};

export const formatWeekOfMonth = (date: string): string => {
    const week = getWeekOfMonth(date);
    const month = getMonthName(date);
    return `${getOrdinalString(week)} week of ${month}`;
};
