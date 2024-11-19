export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTimeRemaining(endDate: string) {
  const total = Date.parse(endDate) - Date.parse(new Date().toISOString());
  const totalHours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { total, totalHours, minutes, seconds };
}

export const formatTime = (time: number) => time.toString().padStart(2, "0");

/* Funcion para calcular el porcentaje en base a un total y el % a aplicar */

export const calculatePorcentage = (total: number, porcentage: number) => {
  return (total * porcentage) / 100;
};

export const formatLink = (link: string) => {
  if (!link.startsWith("http://") && !link.startsWith("https://")) {
    return `http://${link}`;
  }
  return link;
};
