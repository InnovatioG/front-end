import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useState, useImperativeHandle, forwardRef } from 'react';

// Root Accordion
const Accordion = AccordionPrimitive.Root;

export type AccordionHandle = {
    setOpenItem: (value: string | null, doScroll?: boolean) => void;
    getOpenItem: () => string | null; // ✅ Expose method to get the open item
};

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
    children: React.ReactNode;
};

const ManagedAccordion = forwardRef<AccordionHandle, AccordionProps>(({ children, ...props }, ref) => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        setOpenItem: (value: string | null, doScroll: boolean = true) => {
            setOpenItem(value);

            if (value && doScroll === true) {
                requestAnimationFrame(() => {
                    const element = document.getElementById(`accordion-item-${value}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
        },
        getOpenItem: () => openItem, // ✅ Expose current open item
    }));

    return (
        <AccordionPrimitive.Root {...props} type="single" collapsible value={openItem || ''} onValueChange={setOpenItem} defaultValue={undefined}>
            {children}
        </AccordionPrimitive.Root>
    );
});

type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item> & {
    children: React.ReactNode;
    value: string;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ children, value, ...props }) => {
    return (
        <AccordionPrimitive.Item {...props} value={value} id={`accordion-item-${value}`}>
            {children}
        </AccordionPrimitive.Item>
    );
};

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(({ style, children, ...props }, ref) => (
    <AccordionPrimitive.Header style={{ display: 'flex', marginBottom: '0' }}>
        <AccordionPrimitive.Trigger
            ref={ref}
            className="accordion-trigger"
            style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                backgroundColor: '#FAFAFA',
                borderRadius: '20px',
                textAlign: 'left',
                padding: '2rem',
                cursor: 'pointer',
                ...style,
            }}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));

const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof AccordionPrimitive.Content>>(({ style, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="accordion-content"
        style={{
            overflow: 'hidden',
            fontSize: '0.875rem',
            transition: 'height 0.2s',
            marginTop: '0',
            ...style,
        }}
        {...props}
    >
        <div
            style={{
                backgroundColor: '#FAFAFA',
                padding: '2rem',
                borderRadius: '0 0 20px 20px',
                ...style,
            }}
        >
            {children}
        </div>
    </AccordionPrimitive.Content>
));

ManagedAccordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export { ManagedAccordion as Accordion, AccordionItem, AccordionTrigger, AccordionContent };
