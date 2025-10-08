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
import { Home, LayoutDashboard, MapPin, Cloud, Bell, User, Settings, LogOut, Shield, FileWarning } from 'lucide-react';
import { motion } from 'framer-motion';

type NavbarProps = {
  showSearch?: boolean;
};

export function Navbar({ showSearch = false }: NavbarProps) {
  const { user, isAuthenticated, logout, loading } = useAuth();
  
  const initials = user 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` 
    : '';

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-b border-gray-700/50 dark:border-gray-800/50 backdrop-blur-xl shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg glow-blue">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    VigilanceFrance
                  </span>
                  <span className="text-xs text-gray-400 hidden sm:block">Sécurité collective</span>
                </div>
              </Link>
            </div>

            {/* Center Section - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50">
                  <Home className="w-4 h-4 mr-2" />
                  Overview
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Monitoring
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50">
                  <MapPin className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50">
                  <FileWarning className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-700/50 relative hidden sm:flex"
                title="Localisation"
              >
                <MapPin className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-700/50 hidden sm:flex"
                title="Météo"
              >
                <Cloud className="w-5 h-5" />
                <span className="ml-1 text-sm">18°</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-700/50 relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
              ) : (
              isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors">
                      <Avatar>
                        <AvatarImage src={user?.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-1 bg-gray-900 border-gray-800 text-gray-100" align="end">
                    <div className="flex items-center justify-start gap-2 p-2 bg-gradient-to-r from-gray-800 to-gray-900">
                      <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="font-medium text-sm text-white">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300">
                      <User className="mr-2 h-4 w-4 text-blue-400" />
                      <span>Mon profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300">
                      <MapPin className="mr-2 h-4 w-4 text-purple-400" />
                      <span>Mes signalements</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300">
                      <Settings className="mr-2 h-4 w-4 text-gray-400" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer hover:bg-red-900/20 focus:bg-red-900/20 text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover-lift">
                    Connexion
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}