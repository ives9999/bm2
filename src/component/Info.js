import { Alert } from 'flowbite-react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

// success, warning, failure, info
export function Info({type, children, close=false, isRounded=true}) {
    return (
        <Alert 
            color={type} 
            onDismiss={close}
            icon={InformationCircleIcon}
            rounded={isRounded} 
        >
            {children}
        </Alert>
    );
}