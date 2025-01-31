import { BookImage, Camera, LucideIcon, Settings } from 'lucide-react';

interface NavItem {
    title: string;
    to: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
    icon?: LucideIcon;
    label?: string;
    isCenter?: boolean;
}

export const floatingMenu: NavItem[] = [
    {
        title: 'Dashboard',
        to: '/',
        icon: BookImage,
    },
    {
        title: 'Camera',
        to: '/cameras',
        icon: Camera,
        isCenter: true,
    },
    {
        title: 'Setting',
        to: '/settings',
        icon: Settings,
    },
];
