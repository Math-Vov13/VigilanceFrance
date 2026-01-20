import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  MessageSquare,
} from 'lucide-react';
import { FaLocationCrosshairs, FaFilter } from "react-icons/fa6";
import { IoIosStats } from "react-icons/io";
import { IncidentFilters } from './IncidentFilters';

type MenuSection = 'security' | 'global' | 'filters' | 'comments' | null;

interface MapSidebarMenuProps {
  selectedType: string;
  onFilterChange: (value: string) => void;
  counts: { count: number; value: string; label: string; color: string; icon: string; }[];
  userLocation?: { lat: number; lng: number };
  nearbyIncidents?: number;
  globalStats?: {
    total: number;
    byType: Record<string, number>;
  };
}

export function MapSidebarMenu({
  selectedType,
  onFilterChange,
  counts,
  userLocation,
  nearbyIncidents = 0,
  globalStats
}: MapSidebarMenuProps) {
  const [activeSection, setActiveSection] = useState<MenuSection>('filters');

  const menuItems = [
    {
      id: 'security' as MenuSection,
      icon: FaLocationCrosshairs,
      label: 'Sécurité locale',
    },
    {
      id: 'global' as MenuSection,
      icon: IoIosStats,
      label: 'Statistiques globales',
    },
    {
      id: 'filters' as MenuSection,
      icon: FaFilter,
      label: 'Filtres',
    },
    {
      id: 'comments' as MenuSection,
      icon: MessageSquare,
      label: 'Commentaires',
    }
  ];

  const handleMenuClick = (section: MenuSection) => {
    setActiveSection(section === activeSection ? null : section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'security':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <FaLocationCrosshairs className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Sécurité Locale</h3>
                <p className="text-sm text-gray-400">Incidents près de vous</p>
              </div>
            </div>

            {userLocation ? (
              <>
                <div className="glass-card-dark p-4 rounded-lg border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Incidents à proximité</span>
                    <span className="text-2xl font-bold text-blue-400">{nearbyIncidents}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Dans un rayon de 5km</span>
                  </div>
                </div>

                <div className="glass-card-dark p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-white mb-3">Alertes actives</h4>
                  <div className="space-y-2">
                    {nearbyIncidents > 0 ? (
                      <div className="flex items-center gap-3 p-2 rounded bg-red-500/10 border border-red-500/30">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <div className="flex-1">
                          <p className="text-sm text-white">Incidents détectés</p>
                          <p className="text-xs text-gray-400">À proximité de votre position</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">Aucune alerte active</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-card-dark p-6 rounded-lg text-center">
                <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Activez la géolocalisation pour voir les incidents près de vous</p>
              </div>
            )}
          </div>
        );

      case 'global':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <IoIosStats className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Statistiques Globales</h3>
                <p className="text-sm text-gray-400">Vue d'ensemble</p>
              </div>
            </div>

            <div className="glass-card-dark p-4 rounded-lg border border-purple-500/30">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-purple-400 mb-1">
                  {globalStats?.total || counts.reduce((acc, c) => acc + c.count, 0)}
                </div>
                <p className="text-sm text-gray-400">Total des incidents</p>
              </div>
            </div>

            <div className="glass-card-dark p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-white mb-3">Par catégorie</h4>
              <div className="space-y-3">
                {counts.filter(c => c.value !== 'all' && c.count > 0).map((item) => (
                  <div key={item.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <FaFilter className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Filtres</h3>
                <p className="text-sm text-gray-400">Affiner la recherche</p>
              </div>
            </div>

            <IncidentFilters
              selectedType={selectedType}
              onChange={onFilterChange}
              counts={counts}
            />
          </div>
        );

      case 'comments':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Commentaires</h3>
                <p className="text-sm text-gray-400">Discussions récentes</p>
              </div>
            </div>

            <div className="glass-card-dark p-6 rounded-lg text-center">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Sélectionnez un incident sur la carte pour voir les commentaires</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed left-0 top-16 bottom-0 flex z-30 pointer-events-none">
      {/* Fixed Icon Sidebar - Always visible */}
      <div className="w-16 bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 flex flex-col items-center py-6 gap-4 shadow-2xl pointer-events-auto">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-200
                ${isActive 
                  ? 'bg-white/10 shadow-lg border-2 border-white/30' 
                  : 'hover:bg-white/5 border-2 border-transparent'
                }
              `}
              title={item.label}
            >
              <Icon 
                className={`
                  w-6 h-6 text-white transition-all duration-200
                  ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}
                `}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </button>
          );
        })}
      </div>

      {/* Content Panel - Slides in/out */}
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-80 bg-gray-900/90 backdrop-blur-xl border-r border-gray-700/50 overflow-y-auto shadow-2xl pointer-events-auto"
          >
            <div className="p-6">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}