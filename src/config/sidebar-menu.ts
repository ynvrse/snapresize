import { BookImage, Camera, LucideIcon, Settings } from 'lucide-react';

interface NavItem {
    title: string | null;
    to?: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
    isCustomMenu?: boolean;
    icon?: LucideIcon;
    label?: string;
}

interface NavItemWithChildren extends NavItem {
    items?: NavItemWithChildren[];
}

export const sidebarMenu: NavItemWithChildren[] = [
    {
        title: 'Dashboard',
        to: '/',
        icon: BookImage,
    },
    {
        title: 'Camera',
        to: '/cameras',
        icon: Camera,
    },
    {
        title: 'Setting',
        to: '/settings',
        icon: Settings,
    },
];

export const sideMenu: NavItemWithChildren[] = [];
