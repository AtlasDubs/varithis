import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacter } from '@/context/CharacterContext';
import AttributeSlider from './AttributeSlider';
import { backgrounds, factions, portraitImages } from '@/lib/gameData';
import { CharacterAttributes } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import FAIcon from '@/components/ui/fontawesome-icon';

// Character creation form schema
const characterFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  background: z.string().min(1, { message: "Please select a background" }),
  faction: z.string().min(1, { message: "Please select a faction alignment" }),
  gender: z.string().min(1, { message: "Please select a gender" }),
  age: z.string().min(1, { message: "Please select an age group" }),
  portraitType: z.string().min(1, { message: "Please select a portrait style" }),
  attributes: z.object({
    strength: z.number().min(1).max(10),
    dexterity: z.number().min(1).max(10),
    intelligence: z.number().min(1).max(10),
    charisma: z.number().min(1).max(10),
  }).refine(attrs => {
    const total = attrs.strength + attrs.dexterity + attrs.intelligence + attrs.charisma;
    return total <= 24; // Increased to account for faction bonuses
  }, { message: "You can only allocate 24 attribute points in total (including faction bonuses)" })
});

type CharacterFormValues = z.infer<typeof characterFormSchema>;

// Define creation steps
const STEPS = {
  BACKGROUND: 0,
  FACTION: 1,
  APPEARANCE: 2,
  ATTRIBUTES: 3,
  NAME: 4,
  CONFIRM: 5
};

// Background to attribute recommendation mapping
const backgroundAttributeBonuses: Record<string, Partial<CharacterAttributes>> = {
  frostwarrior: { strength: 2, dexterity: 1 },
  artifex: { intelligence: 2, dexterity: 1 },
  druid: { intelligence: 1, charisma: 2 },
  necromancer: { intelligence: 3 },
  shadowmage: { intelligence: 2, charisma: 1 },
  engineer: { intelligence: 2, strength: 1 },
  corsair: { dexterity: 2, charisma: 1 },
  sentinel: { strength: 2, intelligence: 1 },
  occultist: { intelligence: 2, charisma: 1 },
  forester: { dexterity: 2, strength: 1 },
  diplomat: { charisma: 3 }
};

// Faction to attribute bonus mapping
const factionAttributeBonuses: Record<string, Partial<CharacterAttributes>> = {
  frostholm: { strength: 2 },
  stoneridge: { strength: 1, intelligence: 1 },
  ravenhold: { intelligence: 2 },
  brightforge: { intelligence: 1, dexterity: 1 },
  elderwood: { charisma: 2 },
  gravewater: { intelligence: 2 },
  sundermire: { charisma: 1, intelligence: 1 },
  stormharbor: { dexterity: 2 },
  highmoor: { strength: 1, charisma: 1 },
  ironwell: { strength: 1, intelligence: 1 },
  timberholt: { dexterity: 1, charisma: 1 },
  neutral: {}  // No bonus for neutral
};

// Skill types
interface Skill {
  name: string;
  description: string;
  initialValue: number;
  primaryAttribute: keyof CharacterAttributes;
  category: string;
}

const characterSkills: Skill[] = [
  { name: "Swordsmanship", description: "Proficiency with swords and bladed weapons", initialValue: 0, primaryAttribute: "strength", category: "Combat" },
  { name: "Archery", description: "Skill with bows and ranged weapons", initialValue: 0, primaryAttribute: "dexterity", category: "Combat" },
  { name: "Spellcasting", description: "Ability to cast and control magical spells", initialValue: 0, primaryAttribute: "intelligence", category: "Magic" },
  { name: "Alchemy", description: "Knowledge of potions and elixirs", initialValue: 0, primaryAttribute: "intelligence", category: "Crafting" },
  { name: "Persuasion", description: "Ability to convince and influence others", initialValue: 0, primaryAttribute: "charisma", category: "Social" },
  { name: "Stealth", description: "Moving unseen and unheard", initialValue: 0, primaryAttribute: "dexterity", category: "Utility" },
  { name: "Lockpicking", description: "Opening locks without keys", initialValue: 0, primaryAttribute: "dexterity", category: "Utility" },
  { name: "Survival", description: "Finding food and shelter in the wilderness", initialValue: 0, primaryAttribute: "strength", category: "Utility" }
];

export default function SteppedCharacterCreation() {
  const { createCharacter, user, isLoading } = useCharacter();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(STEPS.BACKGROUND);
  const [portraitSrc, setPortraitSrc] = useState('');
  const [basePoints, setBasePoints] = useState(20);
  const [pointsRemaining, setPointsRemaining] = useState(20);
  const [temporaryCharacter, setTemporaryCharacter] = useState<CharacterFormValues | null>(null);
  const [factionBonus, setFactionBonus] = useState<Partial<CharacterAttributes>>({});
  const [backgroundBonus, setBackgroundBonus] = useState<Partial<CharacterAttributes>>({});

  const defaultValues: CharacterFormValues = {
    name: '',
    background: '',
    faction: 'neutral',
    gender: 'male',
    age: 'young',
    portraitType: '',
    attributes: {
      strength: 5,
      dexterity: 5,
      intelligence: 5,
      charisma: 5
    }
  };

  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterFormSchema),
    defaultValues
  });

  const watchBackground = form.watch('background');
  const watchPortraitType = form.watch('portraitType');
  const watchFaction = form.watch('faction');
  const watchAttributes = form.watch('attributes');

  // Update portrait when selection changes
  useEffect(() => {
    if (watchPortraitType && portraitImages[watchPortraitType as keyof typeof portraitImages]) {
      setPortraitSrc(portraitImages[watchPortraitType as keyof typeof portraitImages]);
    }
  }, [watchPortraitType]);

  // Update background attribute recommendations
  useEffect(() => {
    if (watchBackground) {
      // Set background bonus
      setBackgroundBonus(backgroundAttributeBonuses[watchBackground] || {});
      
      // Match portrait type to background if not set already
      if (!form.getValues('portraitType')) {
        let portraitType = '';
        
        if (watchBackground.includes('warrior') || watchBackground === 'sentinel' || watchBackground === 'forester') {
          portraitType = 'frostwarrior';
        } else if (watchBackground.includes('mage') || watchBackground === 'necromancer' || watchBackground === 'occultist' || watchBackground === 'druid') {
          portraitType = 'shadowmage';
        } else if (watchBackground === 'corsair') {
          portraitType = 'corsair';
        } else if (watchBackground === 'diplomat') {
          portraitType = 'diplomat';
        } else if (watchBackground === 'artifex' || watchBackground === 'engineer') {
          portraitType = 'artifex';
        }
        
        if (portraitType && portraitImages[portraitType as keyof typeof portraitImages]) {
          form.setValue('portraitType', portraitType);
        }
      }
    }
  }, [watchBackground, form]);

  // Update faction bonuses
  useEffect(() => {
    if (watchFaction) {
      setFactionBonus(factionAttributeBonuses[watchFaction] || {});
    }
  }, [watchFaction]);

  // Calculate effective attributes with bonuses
  const effectiveAttributes = useMemo(() => {
    const base = watchAttributes || defaultValues.attributes;
    const effective: Record<string, any> = { ...base };
    
    // Apply background bonuses
    Object.entries(backgroundBonus).forEach(([key, value]) => {
      if (key in effective) {
        effective[key] += value;
      }
    });
    
    // Apply faction bonuses
    Object.entries(factionBonus).forEach(([key, value]) => {
      if (key in effective) {
        effective[key] += value;
      }
    });
    
    return effective;
  }, [watchAttributes, backgroundBonus, factionBonus]);

  // Handle attribute changes and calculate remaining points
  const updateAttributes = (attributes: CharacterAttributes) => {
    const total = Object.values(attributes).reduce((sum, val) => sum + val, 0);
    setPointsRemaining(basePoints - total);

    // Update form with new attributes
    form.setValue('attributes', attributes);
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep < STEPS.CONFIRM) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > STEPS.BACKGROUND) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case STEPS.BACKGROUND:
        return !!form.getValues('background');
      case STEPS.FACTION:
        return !!form.getValues('faction');
      case STEPS.APPEARANCE:
        return !!form.getValues('gender') && !!form.getValues('age') && !!form.getValues('portraitType');
      case STEPS.ATTRIBUTES:
        const attrs = form.getValues('attributes');
        const total = Object.values(attrs).reduce((sum, val) => sum + val, 0);
        return total <= basePoints;
      case STEPS.NAME:
        return form.getValues('name').length >= 2;
      default:
        return true;
    }
  };

  // Form submission handler
  const onSubmit = async (data: CharacterFormValues) => {
    // Validate total attribute points
    const totalPoints = Object.values(data.attributes).reduce((sum, val) => sum + val, 0);
    if (totalPoints > basePoints) {
      toast({
        title: "Too Many Points",
        description: `You can only allocate ${basePoints} attribute points in total`,
        variant: "destructive"
      });
      return;
    }

    try {
      // For now, we'll create a temporary character even without login
      const tempUserId = user?.id || 1; // Default to ID 1 if no user
      
      const characterData = {
        ...data,
        userId: tempUserId,
        health: 100,
        magic: 100,
        gold: 50,
        inventory: []
      };

      // If user is logged in, save to storage, otherwise just use temp character
      if (user) {
        await createCharacter(characterData);
      } else {
        // Store character in localStorage for demo purposes
        localStorage.setItem('tempCharacter', JSON.stringify(characterData));
        // Assign tempCharacter state for context consumption
        setTemporaryCharacter(characterData as CharacterFormValues);
      }
      
      toast({
        title: "Character Created",
        description: "Your character has been created successfully!",
      });
      
      // In both cases, redirect to game page
      setLocation('/game');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create character. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get the selected background
  const selectedBackground = useMemo(() => {
    return backgrounds.find(bg => bg.id === watchBackground);
  }, [watchBackground]);

  // Get the selected faction
  const selectedFaction = useMemo(() => {
    return factions.find(f => f.id === watchFaction);
  }, [watchFaction]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return ((currentStep + 1) / (Object.keys(STEPS).length / 2)) * 100;
  }, [currentStep]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.BACKGROUND:
        return (
          <div className="space-y-6">
            <h3 className="font-cinzel text-xl text-primary">Choose Your Background</h3>
            <p className="text-dark/80 dark:text-light-DEFAULT/80">
              Your background shapes your skills and starting abilities. Choose wisely.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {backgrounds.map(bg => (
                <div
                  key={bg.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                    watchBackground === bg.id 
                      ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                  onClick={() => form.setValue('background', bg.id)}
                >
                  <h4 className="font-cinzel text-lg mb-2">{bg.name}</h4>
                  <p className="text-sm text-dark/80 dark:text-light-DEFAULT/80">{bg.description}</p>
                  
                  {watchBackground === bg.id && backgroundBonus && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(backgroundAttributeBonuses[bg.id] || {}).map(([attr, bonus]) => (
                        <Badge key={attr} className="bg-primary/20 text-primary border border-primary/50">
                          +{bonus} {attr.charAt(0).toUpperCase() + attr.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      case STEPS.FACTION:
        return (
          <div className="space-y-6">
            <h3 className="font-cinzel text-xl text-primary">Choose Your Faction Alignment</h3>
            <p className="text-dark/80 dark:text-light-DEFAULT/80">
              Your initial faction alignment will determine certain abilities and influence how others perceive you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[{id: 'neutral', name: 'Unaligned (Neutral)', description: 'Begin your journey without faction allegiance, keeping all possibilities open.', iconColor: 'text-gray-500'}].concat(factions.slice(0, 8)).map(faction => (
                <div
                  key={faction.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                    watchFaction === faction.id 
                      ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                  onClick={() => form.setValue('faction', faction.id)}
                >
                  <h4 className={`font-cinzel text-lg mb-2 ${faction.id !== 'neutral' ? faction.iconColor : ''}`}>
                    {faction.name}
                  </h4>
                  <p className="text-sm text-dark/80 dark:text-light-DEFAULT/80 mb-3">
                    {faction.description ? (faction.description.length > 120 ? faction.description.slice(0, 120) + '...' : faction.description) : ''}
                  </p>
                  
                  {watchFaction === faction.id && factionBonus && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(factionAttributeBonuses[faction.id] || {}).map(([attr, bonus]) => (
                        <Badge key={attr} className={`bg-primary/20 text-primary border border-primary/50`}>
                          +{bonus} {attr.charAt(0).toUpperCase() + attr.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case STEPS.APPEARANCE:
        return (
          <div className="space-y-6">
            <h3 className="font-cinzel text-xl text-primary">Character Appearance</h3>
            <p className="text-dark/80 dark:text-light-DEFAULT/80">
              Choose how your character looks and their physical traits.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80">Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 dark:bg-dark border border-primary/30 text-dark dark:text-light-DEFAULT">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="nonbinary">Non-Binary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80">Age</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 dark:bg-dark border border-primary/30 text-dark dark:text-light-DEFAULT">
                              <SelectValue placeholder="Select age group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="young">Young (18-25)</SelectItem>
                            <SelectItem value="adult">Adult (26-40)</SelectItem>
                            <SelectItem value="mature">Mature (41-60)</SelectItem>
                            <SelectItem value="elder">Elder (61+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="portraitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80">Portrait Style</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (portraitImages[value as keyof typeof portraitImages]) {
                              setPortraitSrc(portraitImages[value as keyof typeof portraitImages]);
                            }
                          }} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 dark:bg-dark border border-primary/30 text-dark dark:text-light-DEFAULT">
                              <SelectValue placeholder="Select portrait style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(portraitImages).map(key => (
                              <SelectItem key={key} value={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <h4 className="font-cinzel text-lg mb-4">Portrait Preview</h4>
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/30 w-48 h-48">
                  {portraitSrc ? (
                    <img 
                      src={portraitSrc} 
                      alt="Character portrait" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark text-gray-400">
                      <span>Select a portrait</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case STEPS.ATTRIBUTES:
        return (
          <div className="space-y-6">
            <h3 className="font-cinzel text-xl text-primary">Character Attributes</h3>
            <p className="text-dark/80 dark:text-light-DEFAULT/80">
              Distribute {basePoints} points among your attributes. Your background and faction provide additional bonuses.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <AttributeSlider 
                  attribute="strength"
                  value={form.getValues('attributes.strength')}
                  label="Strength"
                  onChange={(val) => {
                    const attrs = form.getValues('attributes');
                    const newAttrs = { ...attrs, strength: val };
                    updateAttributes(newAttrs);
                  }}
                  maxValue={10}
                  disabled={pointsRemaining <= 0 && form.getValues('attributes.strength') < form.getValues('attributes.strength')}
                />
                {(backgroundBonus.strength || factionBonus.strength) && (
                  <div className="flex items-center text-sm ml-4 -mt-3">
                    <span className="text-primary">
                      +{(backgroundBonus.strength || 0) + (factionBonus.strength || 0)} 
                      {backgroundBonus.strength && factionBonus.strength ? 
                        ` (${backgroundBonus.strength} background, ${factionBonus.strength} faction)` : 
                        backgroundBonus.strength ? ` (background)` : ` (faction)`
                      }
                    </span>
                  </div>
                )}

                <AttributeSlider 
                  attribute="dexterity"
                  value={form.getValues('attributes.dexterity')}
                  label="Dexterity"
                  onChange={(val) => {
                    const attrs = form.getValues('attributes');
                    const newAttrs = { ...attrs, dexterity: val };
                    updateAttributes(newAttrs);
                  }}
                  maxValue={10}
                  disabled={pointsRemaining <= 0 && form.getValues('attributes.dexterity') < form.getValues('attributes.dexterity')}
                />
                {(backgroundBonus.dexterity || factionBonus.dexterity) && (
                  <div className="flex items-center text-sm ml-4 -mt-3">
                    <span className="text-primary">
                      +{(backgroundBonus.dexterity || 0) + (factionBonus.dexterity || 0)} 
                      {backgroundBonus.dexterity && factionBonus.dexterity ? 
                        ` (${backgroundBonus.dexterity} background, ${factionBonus.dexterity} faction)` : 
                        backgroundBonus.dexterity ? ` (background)` : ` (faction)`
                      }
                    </span>
                  </div>
                )}

                <AttributeSlider 
                  attribute="intelligence"
                  value={form.getValues('attributes.intelligence')}
                  label="Intelligence"
                  onChange={(val) => {
                    const attrs = form.getValues('attributes');
                    const newAttrs = { ...attrs, intelligence: val };
                    updateAttributes(newAttrs);
                  }}
                  maxValue={10}
                  disabled={pointsRemaining <= 0 && form.getValues('attributes.intelligence') < form.getValues('attributes.intelligence')}
                />
                {(backgroundBonus.intelligence || factionBonus.intelligence) && (
                  <div className="flex items-center text-sm ml-4 -mt-3">
                    <span className="text-primary">
                      +{(backgroundBonus.intelligence || 0) + (factionBonus.intelligence || 0)} 
                      {backgroundBonus.intelligence && factionBonus.intelligence ? 
                        ` (${backgroundBonus.intelligence} background, ${factionBonus.intelligence} faction)` : 
                        backgroundBonus.intelligence ? ` (background)` : ` (faction)`
                      }
                    </span>
                  </div>
                )}

                <AttributeSlider 
                  attribute="charisma"
                  value={form.getValues('attributes.charisma')}
                  label="Charisma"
                  onChange={(val) => {
                    const attrs = form.getValues('attributes');
                    const newAttrs = { ...attrs, charisma: val };
                    updateAttributes(newAttrs);
                  }}
                  maxValue={10}
                  disabled={pointsRemaining <= 0 && form.getValues('attributes.charisma') < form.getValues('attributes.charisma')}
                />
                {(backgroundBonus.charisma || factionBonus.charisma) && (
                  <div className="flex items-center text-sm ml-4 -mt-3">
                    <span className="text-primary">
                      +{(backgroundBonus.charisma || 0) + (factionBonus.charisma || 0)} 
                      {backgroundBonus.charisma && factionBonus.charisma ? 
                        ` (${backgroundBonus.charisma} background, ${factionBonus.charisma} faction)` : 
                        backgroundBonus.charisma ? ` (background)` : ` (faction)`
                      }
                    </span>
                  </div>
                )}
                
                <div className="mt-6">
                  <p className="text-sm font-semibold text-dark/80 dark:text-light-DEFAULT/80">
                    Points Remaining: <span className={`${pointsRemaining < 0 ? 'text-accent-red' : 'text-primary'}`}>{pointsRemaining}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-cinzel text-lg mb-4">Derived Skills</h4>
                <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm mb-4">
                  These skills are derived from your primary attributes. They will increase as you play.
                </p>
                
                <div className="space-y-3">
                  {characterSkills.slice(0, 5).map(skill => {
                    const baseAttributeValue = form.getValues(`attributes.${skill.primaryAttribute}`) || 5;
                    const bonusValue = 
                      (backgroundBonus[skill.primaryAttribute as keyof typeof backgroundBonus] || 0) + 
                      (factionBonus[skill.primaryAttribute as keyof typeof factionBonus] || 0);
                    const totalAttributeValue = baseAttributeValue + bonusValue;
                    
                    // Calculate skill value based on attribute (for display only)
                    const skillValue = Math.floor(totalAttributeValue / 2);
                    
                    return (
                      <div key={skill.name} className="group">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-dark/90 dark:text-light-DEFAULT/90">{skill.name}</span>
                          <span className="text-sm text-primary">{skillValue}</span>
                        </div>
                        <Progress value={skillValue * 10} className="h-2" />
                        <div className="text-xs text-dark/60 dark:text-light-DEFAULT/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Based on {skill.primaryAttribute.charAt(0).toUpperCase() + skill.primaryAttribute.slice(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
        
      case STEPS.NAME:
        return (
          <div className="space-y-6">
            <h3 className="font-cinzel text-xl text-primary">Name Your Character</h3>
            <p className="text-dark/80 dark:text-light-DEFAULT/80">
              The final step - what name will echo through the legends of Varithis?
            </p>
            
            <div className="max-w-md mx-auto">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80 text-lg">Character Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your character's name" 
                        className="bg-gray-50 dark:bg-dark border border-primary/30 text-dark dark:text-light-DEFAULT text-lg py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-center mt-3">
                      Choose wisely, for you will be known by this name throughout your journey.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
        
      case STEPS.CONFIRM:
        return (
          <div className="space-y-6">
            <h3 className="font-cinzel text-xl text-primary">Review Your Character</h3>
            <p className="text-dark/80 dark:text-light-DEFAULT/80">
              Take a moment to review your character before embarking on your journey.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Card className="bg-white/50 dark:bg-dark-lighter/50 border border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative rounded-full overflow-hidden border-2 border-primary/30 w-20 h-20">
                        {portraitSrc && (
                          <img 
                            src={portraitSrc} 
                            alt="Character portrait" 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-cinzel text-xl text-primary">{form.getValues('name')}</h4>
                        <p className="text-dark/70 dark:text-light-DEFAULT/70">{selectedBackground?.name || ''}</p>
                        {selectedFaction && (
                          <div className={`text-sm ${selectedFaction.iconColor}`}>
                            {selectedFaction.name}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h5 className="font-cinzel text-sm mb-1">Gender</h5>
                        <p className="text-dark/80 dark:text-light-DEFAULT/80">{form.getValues('gender')}</p>
                      </div>
                      <div>
                        <h5 className="font-cinzel text-sm mb-1">Age</h5>
                        <p className="text-dark/80 dark:text-light-DEFAULT/80">{form.getValues('age')}</p>
                      </div>
                    </div>
                    
                    <h5 className="font-cinzel text-sm mb-2">Attributes</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-dark/80 dark:text-light-DEFAULT/80">Strength</span>
                        <span className="text-primary font-semibold">{effectiveAttributes.strength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark/80 dark:text-light-DEFAULT/80">Dexterity</span>
                        <span className="text-primary font-semibold">{effectiveAttributes.dexterity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark/80 dark:text-light-DEFAULT/80">Intelligence</span>
                        <span className="text-primary font-semibold">{effectiveAttributes.intelligence}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark/80 dark:text-light-DEFAULT/80">Charisma</span>
                        <span className="text-primary font-semibold">{effectiveAttributes.charisma}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <div className="bg-white/50 dark:bg-dark-lighter/50 border border-primary/20 rounded-lg p-6">
                  <h4 className="font-cinzel text-lg mb-4">Ready for Adventure</h4>
                  <p className="text-dark/80 dark:text-light-DEFAULT/80 mb-6">
                    Your character is ready to embark on an epic journey through the world of Varithis. 
                    Face challenges, forge alliances, and leave your mark on the land.
                  </p>
                  
                  <h5 className="font-cinzel text-sm mb-2">Starting Equipment</h5>
                  <ul className="list-disc pl-5 mb-4 text-dark/80 dark:text-light-DEFAULT/80">
                    <li>Basic clothing</li>
                    <li>Simple weapon</li>
                    <li>Small backpack</li>
                    <li>50 gold pieces</li>
                    <li>2 healing potions</li>
                  </ul>
                  
                  <h5 className="font-cinzel text-sm mb-2">Background Trait</h5>
                  <p className="text-dark/80 dark:text-light-DEFAULT/80 mb-4">
                    {selectedBackground?.description || 'No background selected'}
                  </p>
                  
                  {!user && (
                    <div className="mt-6 p-3 bg-primary/10 border border-primary/30 rounded-md">
                      <p className="text-sm text-dark/90 dark:text-light-DEFAULT/90">
                        <FAIcon icon="info-circle" className="mr-2 text-primary" />
                        Create an account or log in to save your character and begin your adventure.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.section 
      className="mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-cinzel text-2xl md:text-3xl text-primary text-center mb-2">Create Your Character</h2>
      <p className="text-dark/80 dark:text-light-DEFAULT/80 text-center max-w-3xl mx-auto mb-6">
        Every hero's journey begins with a choice. Who will you become in the world of Varithis?
      </p>

      {/* Progress bar */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="mb-2 flex justify-between text-xs text-dark/60 dark:text-light-DEFAULT/60">
          <span>Background</span>
          <span>Faction</span>
          <span>Appearance</span>
          <span>Attributes</span>
          <span>Name</span>
          <span>Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="bg-white dark:bg-dark-lighter rounded-lg border border-primary/20 p-6 md:p-8 theme-transition shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between mt-10">
              <Button 
                type="button" 
                onClick={prevStep}
                className="bg-transparent border border-primary/50 text-primary hover:bg-primary/10"
                disabled={currentStep === STEPS.BACKGROUND}
              >
                <FAIcon icon="arrow-left" className="mr-2" />
                Back
              </Button>
              
              {currentStep < STEPS.CONFIRM ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="bg-primary hover:bg-primary-dark text-dark-darker font-bold"
                  disabled={!isCurrentStepValid()}
                >
                  Continue
                  <FAIcon icon="arrow-right" className="ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-dark text-dark-darker font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : (user ? "Begin Adventure" : "Create Account & Save")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </motion.section>
  );
}