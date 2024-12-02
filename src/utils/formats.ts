export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function formatMoney(amount: number): string {
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
