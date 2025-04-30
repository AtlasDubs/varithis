import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as BrandIcons from '@fortawesome/free-brands-svg-icons';

// Social media icons are brand icons, not solid icons
const BRAND_ICONS = ['discord', 'twitter', 'instagram', 'reddit', 'facebook', 'github', 'linkedin'];

interface FontAwesomeIconProps {
  icon: string; // Icon name in format "fas fa-icon-name" or just "icon-name"
  className?: string;
}

export default function FAIcon({ icon, className = '' }: FontAwesomeIconProps) {
  try {
    // Convert icon name to camelCase format used by the library
    // e.g., "arrow-left" becomes "faArrowLeft"
    const iconCamelCase = icon.split('-').map((part, index) => 
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    ).join('');
    
    const iconName = `fa${iconCamelCase.charAt(0).toUpperCase() + iconCamelCase.slice(1)}`;
    
    // Determine if this is a brand icon or a solid icon
    const isBrandIcon = BRAND_ICONS.includes(icon);
    
    // Get the icon from the appropriate collection
    const iconDefinition = isBrandIcon 
      ? (BrandIcons as any)[iconName] 
      : (SolidIcons as any)[iconName];
    
    if (!iconDefinition) {
      // Some common fallback icons if specific ones aren't found
      if (icon === 'arrow-right') return <FontAwesomeIcon icon={SolidIcons.faArrowRight} className={className} />;
      if (icon === 'arrow-left') return <FontAwesomeIcon icon={SolidIcons.faArrowLeft} className={className} />;
      if (icon === 'info-circle') return <FontAwesomeIcon icon={SolidIcons.faCircleInfo} className={className} />;
      
      console.warn(`Could not find icon: ${icon} (${iconName})`);
      return <span className={`inline-block ${className}`}>●</span>;
    }
    
    return (
      <FontAwesomeIcon 
        icon={iconDefinition} 
        className={className} 
      />
    );
  } catch (error) {
    console.error(`Error loading icon ${icon}:`, error);
    return <span className={`inline-block ${className}`}>●</span>;
  }
}
