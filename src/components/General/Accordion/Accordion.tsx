import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

const Accordion = AccordionPrimitive.Root;

type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item> & {
    children: React.ReactNode;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ children, ...props }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen(!open);
    };

    return (
        <AccordionPrimitive.Item {...props}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { open, toggleOpen });
                }
                return child;
            })}
        </AccordionPrimitive.Item>
    );

    AccordionTrigger.displayName = 'AccordionTrigger';
    AccordionContent.displayName = 'AccordionContent';
};

type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    open: boolean;
    toggleOpen: () => void;
};

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(({ style, children, open, toggleOpen, ...props }, ref) => (
    <AccordionPrimitive.Header style={{ display: 'flex', marginBottom: '0' }}>
        <AccordionPrimitive.Trigger
            ref={ref}
            className={`accordion-trigger ${open ? 'open' : ''}`}
            style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                backgroundColor: '#FAFAFA',
                borderRadius: open ? '20px 20px 0 0' : '20px 20px 20px 20px',
                textAlign: 'left',
                padding: '2rem',
                cursor: 'pointer',
                ...style,
            }}
            onClick={toggleOpen}
            {...props}
        >
            {children}
            <ChevronDown
                style={{
                    height: '1rem',
                    width: '1rem',
                    flexShrink: 0,
                    transition: 'transform 0.2s',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
            />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));

type AccordionContentProps = React.ComponentProps<typeof AccordionPrimitive.Content> & {
    open: boolean;
};

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(({ style, children, open, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={`accordion-content ${open ? 'open' : ''}`}
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

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
