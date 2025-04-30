import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if requirements are met based on character attributes
export function checkRequirements(
  requirements: Record<string, any> | null,
  character: Record<string, any> | null
): boolean {
  if (!requirements || !character) return true;
  
  const { attributes } = character;
  
  // Check attribute requirements
  if (requirements.intelligence && attributes.intelligence < requirements.intelligence) {
    return false;
  }
  if (requirements.strength && attributes.strength < requirements.strength) {
    return false;
  }
  if (requirements.dexterity && attributes.dexterity < requirements.dexterity) {
    return false;
  }
  if (requirements.charisma && attributes.charisma < requirements.charisma) {
    return false;
  }
  
  // Check previous contact requirement
  if (requirements.previousContact) {
    // This would check if the character has previous contact with the faction
    // In a full implementation, we would check game progress or character history
    return false;
  }
  
  return true;
}

// Get appropriate text color based on faction
export function getFactionColor(factionId: string): string {
  switch (factionId) {
    case 'arcane':
      return 'text-secondary';
    case 'dominion':
      return 'text-accent-red';
    case 'sylvan':
      return 'text-accent-green';
    case 'shadow':
      return 'text-accent-blue';
    default:
      return 'text-primary';
  }
}

// Format faction reputation for display
export function formatFactionReputation(value: number): string {
  if (value >= 50) return "Revered";
  if (value >= 30) return "Honored";
  if (value >= 10) return "Friendly";
  if (value >= 0) return "Neutral";
  if (value >= -10) return "Unfriendly";
  if (value >= -30) return "Hostile";
  return "Hated";
}

// Get icon name for a region type
export function getRegionIcon(regionId: string): string {
  switch (regionId) {
    case 'plains':
      return 'crown';
    case 'verdant':
      return 'leaf';
    case 'mountains':
      return 'mountain';
    default:
      return 'map-marker';
  }
}
