import { useState, useEffect } from 'react';
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
import { Home, LayoutDashboard, MapPin, Cloud, Bell, User, Settings, LogOut, LogIn, Menu, X } from 'lucide-react';
import { HiMoon } from "react-icons/hi";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [location, setLocation] = useState<{ city: string; lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<number | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : '';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const geoData = await geoRes.json();

            setLocation({
              city: geoData.address.city || geoData.address.town || geoData.address.village || "Unknown",
              lat: latitude,
              lon: longitude,
            });

            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
            const weatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );
            const weatherData = await weatherRes.json();
            setWeather(Math.round(weatherData.main.temp));
          } catch (err) {
            console.error("Error fetching location/weather:", err);
          } finally {
            setLoadingWeather(false);
          }
        },
        (err) => {
          console.error("Geolocation denied:", err);
          setLoadingWeather(false);
        }
      );
    } else {
      setLoadingWeather(false);
    }
  }, []);

  const navLinks = (
    <>
      <Link to="/" onClick={() => setMobileOpen(false)}>
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50 w-full justify-start">
          <Home className="w-4 h-4 mr-2" /> Home
        </Button>
      </Link>
      <Link to="/monitoring" onClick={() => setMobileOpen(false)}>
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50 w-full justify-start">
          <LayoutDashboard className="w-4 h-4 mr-2" /> Monitoring
        </Button>
      </Link>
      <Link to="/map" onClick={() => setMobileOpen(false)}>
        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50 w-full justify-start">
          <MapPin className="w-4 h-4 mr-2" /> Map
        </Button>
      </Link>
    </>
  );

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
                <HiMoon className="w-6 h-6 text-white" />
                <span className={cn("text-xl font-bold text-white leading-none italic", "font-exo2")}>
                  Sentinal
                </span>
              </Link>
            </div>

            {/* Center Section - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Location & Weather */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-700/50 relative hidden sm:flex px-8"
                title={location ? location.city : "Detecting location..."}
              >
                <MapPin className="w-5 h-5" />
                <span className='lg:block hidden'>{location ? location.city : "Detecting location..."}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-700/50 hidden sm:flex px-8"
                title="Weather"
              >
                <Cloud className="w-5 h-5" />
                <span className="ml-1 text-sm">
                  {loadingWeather ? "..." : weather !== null ? `${weather}°` : "--"}
                </span>
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-300 hover:text-white hover:bg-gray-700/50 relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User */}
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors">
                      <Avatar>
                        <AvatarImage src={user?.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
                        <AvatarFallback className="bg-gray-950 dark text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-1 bg-gray-900 border-gray-800 text-gray-100" align="end">
                    <div className="flex flex-col gap-2 p-2">
                      <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <User className="mr-2 h-4 w-4 text-blue-400" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <MapPin className="mr-2 h-4 w-4 text-purple-400" /> My Reports
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800">
                      <Settings className="mr-2 h-4 w-4 text-gray-400" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem onClick={() => logout()} className="hover:bg-red-900/20 text-red-400">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button>
                    <LogIn className="w-4 h-4 mr-2" /> Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="icon"
                className="ml-2 md:hidden text-gray-300 hover:text-white hover:bg-gray-700/50"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-16 left-0 w-full bg-gray-900 border-b border-gray-700/50"
            >
              <div className="flex flex-col px-4 py-3 gap-2">
                {navLinks}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
