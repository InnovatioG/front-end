"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ style, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        style={{ ...style }}
        {...props}
    />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ style, children, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    console.log(open)

    return (
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
                    backgroundColor: "#FAFAFA",
                    borderRadius: open ? "20px 20px 20px 20px" : "20px 20px 0px 0px",
                    textAlign: 'left',
                    padding: "2rem",
                    cursor: 'pointer',
                    marginBottom: '0',
                    ...style
                }}
                onClick={() => setOpen(!open)}
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
    );
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ style, children, ...props }, ref) => {
    const [open, setOpen] = useState(false);

    return (
        <AccordionPrimitive.Content
            ref={ref}
            className={`accordion-content ${open ? 'open' : ''}`}
            style={{
                overflow: 'hidden',
                fontSize: '0.875rem',
                transition: 'height 0.2s',
                marginTop: '0',
                ...style
            }}
            onClick={() => setOpen(!open)}
            {...props}
        >
            <div style={{
                backgroundColor: "#FAFAFA",
                padding: "2rem",
                borderRadius: open ? "0 0 20px 20px" : "0px 0px 20px 20px",
                ...style
            }}>{children}</div>
        </AccordionPrimitive.Content>
    );
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }