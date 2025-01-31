import { ImagePlus, Images, Settings2 } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function Footer() {
    const location = useLocation();

    return (
        <footer>
            <div className="shadow-rounded fixed bottom-0 left-0 w-full">
                <div className="mx-auto">
                    <nav className="nav-mobile bg-primary flex items-center justify-center gap-x-20 px-4 py-3">
                        <NavLink to="/saved-images">
                            <Avatar className="!rounded-md">
                                <AvatarImage src="" className="!rounded-md" />
                                <AvatarFallback className="!rounded-md bg-slate-200">
                                    <Images color="#6E4997" />
                                </AvatarFallback>
                            </Avatar>
                        </NavLink>
                        <NavLink to="/">
                            <ImagePlus size={40} color={`${location.pathname === '/' ? '#F5C32C' : '#F4F4FF'}`} />
                        </NavLink>
                        <NavLink to="/settings">
                            <Settings2
                                size={40}
                                color={`${location.pathname === '/settings' ? '#F5C32C' : '#F4F4FF'}`}
                            />
                        </NavLink>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
