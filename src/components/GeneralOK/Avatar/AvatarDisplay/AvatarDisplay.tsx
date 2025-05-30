import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';
import styles from './AvatarDisplay.module.scss';

interface AvatarDisplayProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
    big?: boolean;
}

const AvatarDisplay = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarDisplayProps>(({ className, big = false, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={`${styles.avatarRoot} ${big ? styles.big : ''} ${className}`} {...props} />
));
AvatarDisplay.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(
    ({ className, ...props }, ref) => <AvatarPrimitive.Image ref={ref} className={`${styles.avatarImage} ${className}`} {...props} />
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(
    ({ className, ...props }, ref) => <AvatarPrimitive.Fallback ref={ref} className={`${styles.avatarFallback} ${className}`} {...props} />
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { AvatarDisplay, AvatarFallback, AvatarImage };
