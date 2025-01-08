import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TimeInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
    ({ className, ...props }, ref) => {
        const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
            let value = event.target.value;

            // Validar formato y eliminar caracteres no permitidos
            value = value.replace(/[^0-9:]/g, ""); // Permitir solo números y ":"

            // Validar si cumple el patrón
            const match = value.match(/^([0-2]?[0-9]?):?([0-5]?[0-9]?)?$/);

            if (!match) {
                event.target.value = ""; // Si no es válido, limpiar el campo
                return;
            }

            const hours = match[1] || "";
            const minutes = match[2] || "";

            // Limitar horas a 23 y minutos a 59
            if (parseInt(hours, 10) > 23) value = "23";
            if (parseInt(minutes, 10) > 59) value = `${hours}:59`;

            event.target.value = value; // Actualizar el valor permitido
        };

        return (
            <input
                type="text"
                inputMode="numeric"
                pattern="^(2[0-3]|[01][0-9]):([0-5][0-9])$"
                className={cn(
                    "flex h-10 w-full rounded-[1.127rem] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center",
                    className
                )}
                placeholder="hh / mm"
                ref={ref}
                onInput={handleInput} // Validación en tiempo real
                {...props}
            />
        );
    }
);

TimeInput.displayName = "TimeInput";

export { TimeInput };