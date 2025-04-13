import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SearchIcon, MapPin, User, Settings, LogOut } from 'lucide-react';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';

type NavbarProps = {
  showSearch?: boolean;
};

export function Navbar({ showSearch = false }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  
  const initials = user 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` 
    : '';

  return (
    <motion.nav 
      className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4 z-10 shadow-lg backdrop-blur-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
            <svg viewBox="0 0 24 24" className="w-10 h-10 relative" fill="currentColor">
              <path d="M12 22s8.5-5.5 8.5-12.5c0-4.1-3.4-7.5-7.5-7.5h-2c-4.1 0-7.5 3.4-7.5 7.5C3.5 16.5 12 22 12 22z"></path>
              <circle cx="12" cy="9.5" r="2.5" fill="white"></circle>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">VigilanceFrance</span>
            <span className="text-xs text-blue-200">Sécurité collective</span>
          </div>
        </Link>
        
        {showSearch && (
          <div className="hidden md:flex flex-1 justify-center px-6 max-w-xl">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Rechercher un lieu..."
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white/90 backdrop-blur-sm border-0 shadow-lg"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Link to="/map">
                <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center border border-white/20 shadow-md">
                  <MapPin className="w-4 h-4 mr-1" />
                  Signaler
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-white/30">
                    <Avatar>
                      <AvatarImage src={user?.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700">{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-1 border border-blue-100 shadow-xl" align="end">
                  <div className="flex items-center justify-start gap-2 p-2 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex flex-col space-y-0.5 leading-none">
                      <p className="font-medium text-sm text-blue-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-blue-600">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-50">
                    <User className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-50">
                    <MapPin className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Mes signalements</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-50">
                    <Settings className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4 text-red-600" />
                    <span className="text-red-600">Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-white hover:bg-gray-100 text-blue-700 font-medium shadow-md hover-lift">
                Connexion
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}