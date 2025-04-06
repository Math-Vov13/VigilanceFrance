import React from 'react';
import { cn } from '../../lib/utils';

type FranceConnectButtonProps = {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
};

export const FranceConnectButton: React.FC<FranceConnectButtonProps> = ({
  onClick,
  className,
  size = 'md',
  showText = true,
}) => {
  // Tailles du bouton en fonction de la propriété size
  const buttonSizes = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        // Styles de base du bouton
        'inline-flex items-center justify-center rounded-md transition-colors',
        // Couleurs et fond du bouton
        'bg-white text-[#000091] hover:bg-gray-100',
        // Bordure
        'border border-[#000091]',
        // Padding et espacement
        'px-4 py-2 gap-2',
        // Taille du bouton
        buttonSizes[size],
        // Classes personnalisées
        className
      )}
      type="button"
    >
      {/* Logo FranceConnect */}
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <img src="https://www.constructys.fr/wp-content/uploads/2019/04/Logo-marianne.svg_-1024x603.png" alt="Logo Marianne - République Française" />
        </div>
      </div>
      
      {/* Texte du bouton */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-[#1E1E1E] text-xs font-normal">
            S'identifier avec
          </span>
          <span className="text-[#000091] font-bold">
            FranceConnect
          </span>
        </div>
      )}
    </button>
  );
};

// Variante plus complète avec explication
export const FranceConnectButtonWithHint: React.FC<FranceConnectButtonProps> = (props) => {
  return (
    <div className="flex flex-col space-y-2 max-w-xs">
      <FranceConnectButton {...props} />
      <p className="text-xs text-gray-600">
        FranceConnect est la solution proposée par l'État pour sécuriser et simplifier la connexion à vos services en ligne.
      </p>
    </div>
  );
};