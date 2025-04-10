import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import {
  LayoutDashboard,
  Map,
  Users,
  MessageSquare,
  Shield,
  BarChart3,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous avez été déconnecté de l\'interface d\'administration.',
    });
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/admin/incidents', label: 'Incidents', icon: <Map className="h-5 w-5" /> },
    { path: '/admin/comments', label: 'Commentaires', icon: <MessageSquare className="h-5 w-5" /> },
    { path: '/admin/users', label: 'Utilisateurs', icon: <Users className="h-5 w-5" /> },
    { path: '/admin/moderation', label: 'Modération', icon: <AlertTriangle className="h-5 w-5" /> },
    { path: '/admin/stats', label: 'Statistiques', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <Shield className="h-7 w-7 text-blue-600" />
              <span className="font-bold text-xl hidden sm:inline-block">Vigilance Admin</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/map" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600 hidden sm:block"
            >
              Voir le site
            </a>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium hidden sm:block">
                      {admin?.username || 'Admin'}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex">
        {/* Sidebar for desktop */}
        <aside className="w-64 bg-white shadow-sm hidden lg:block sticky top-16 h-[calc(100vh-4rem)]">
          <nav className="p-4 h-full flex flex-col">
            <div className="space-y-1 flex-grow">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="pt-4 mt-auto border-t border-gray-200">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Déconnexion
              </Button>
            </div>
          </nav>
        </aside>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-20 lg:hidden">
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-16 bottom-0 w-64 bg-white shadow-lg">
              <nav className="p-4 h-full flex flex-col">
                <div className="space-y-1 flex-grow">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'}
                      `}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
                
                <div className="pt-4 mt-auto border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Déconnexion
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-grow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;