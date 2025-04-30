import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useCharacter } from '@/context/CharacterContext';
import AttributeSlider from './AttributeSlider';
import { backgrounds, portraitImages } from '@/lib/gameData';
import { CharacterAttributes } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
    return total <= 20;
  }, { message: "You can only allocate 20 attribute points in total" })
});

type CharacterFormValues = z.infer<typeof characterFormSchema>;

export default function CharacterCreation() {
  const { createCharacter, user, isLoading } = useCharacter();
  const { toast } = useToast();
  const [portraitSrc, setPortraitSrc] = useState(portraitImages.warrior);
  const [pointsRemaining, setPointsRemaining] = useState(0);

  const defaultValues: CharacterFormValues = {
    name: '',
    background: 'noble',
    faction: 'neutral',
    gender: 'male',
    age: 'young',
    portraitType: 'warrior',
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

  // Update portrait when selection changes
  const handlePortraitChange = (value: string) => {
    if (portraitImages[value as keyof typeof portraitImages]) {
      setPortraitSrc(portraitImages[value as keyof typeof portraitImages]);
    }
  };

  // Handle attribute changes and calculate remaining points
  const updateAttributes = (attributes: CharacterAttributes) => {
    const total = Object.values(attributes).reduce((sum, val) => sum + val, 0);
    setPointsRemaining(20 - total);

    // Update form with new attributes
    form.setValue('attributes', attributes);
  };

  // Form submission handler
  const onSubmit = async (data: CharacterFormValues) => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to create a character",
        variant: "destructive"
      });
      return;
    }

    // Validate total attribute points
    const totalPoints = Object.values(data.attributes).reduce((sum, val) => sum + val, 0);
    if (totalPoints > 20) {
      toast({
        title: "Too Many Points",
        description: "You can only allocate 20 attribute points in total",
        variant: "destructive"
      });
      return;
    }

    try {
      const characterData = {
        ...data,
        userId: user.id,
        health: 100,
        magic: 100,
        gold: 50,
        inventory: []
      };

      await createCharacter(characterData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create character. Please try again.",
        variant: "destructive"
      });
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
      <p className="text-dark/80 dark:text-light-DEFAULT/80 text-center max-w-3xl mx-auto mb-10">
        Every hero's journey begins with a choice. Who will you become in the world of Varithis?
      </p>

      <div className="bg-white dark:bg-dark-lighter rounded-lg border border-primary/20 p-6 theme-transition shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Character basics */}
              <div>
                <h3 className="font-cinzel text-xl text-primary mb-4">Identity</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80 text-sm">Character Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter character name" 
                            className="bg-gray-50 dark:bg-dark border border-primary/30 text-dark dark:text-light-DEFAULT"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="background"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80 text-sm">Background</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 dark:bg-dark border border-primary/30 text-dark dark:text-light-DEFAULT">
                              <SelectValue placeholder="Select a background" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {backgrounds.map(bg => (
                              <SelectItem key={bg.id} value={bg.id}>
                                {bg.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="faction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80 text-sm">Initial Faction Alignment</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 dark:bg-dark border border-primary/30 text-dark dark:text-light-DEFAULT">
                              <SelectValue placeholder="Select a faction" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="neutral">Unaligned (Neutral)</SelectItem>
                            <SelectItem value="arcane">The Arcane Conclave</SelectItem>
                            <SelectItem value="dominion">The Iron Dominion</SelectItem>
                            <SelectItem value="sylvan">The Sylvan Covenant</SelectItem>
                            <SelectItem value="shadow">The Shadow Network</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Character attributes */}
              <div>
                <h3 className="font-cinzel text-xl text-primary mb-4">Attributes</h3>
                <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm mb-4">You have 20 points to distribute. No attribute can exceed 10.</p>
                
                <div className="space-y-4">
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
                    disabled={pointsRemaining <= 0 && form.getValues('attributes.strength') < 5}
                  />

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
                    disabled={pointsRemaining <= 0 && form.getValues('attributes.dexterity') < 5}
                  />

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
                    disabled={pointsRemaining <= 0 && form.getValues('attributes.intelligence') < 5}
                  />

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
                    disabled={pointsRemaining <= 0 && form.getValues('attributes.charisma') < 5}
                  />

                  <div className="mt-6 text-center">
                    <p className="text-sm text-dark/80 dark:text-light-DEFAULT/80">
                      Points Remaining: <span className={`font-bold ${pointsRemaining < 0 ? 'text-accent-red' : 'text-primary'}`}>{pointsRemaining}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Character appearance */}
              <div>
                <h3 className="font-cinzel text-xl text-primary mb-4">Appearance</h3>

                {/* Character portrait preview */}
                <div className="mb-4 aspect-square max-w-[200px] mx-auto">
                  <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-primary/30">
                    <img 
                      src={portraitSrc} 
                      alt="Character portrait" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80 text-sm">Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
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

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80 text-sm">Age</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
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

                  <FormField
                    control={form.control}
                    name="portraitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark/80 dark:text-light-DEFAULT/80 text-sm">Choose Portrait Style</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            handlePortraitChange(value);
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 dark:bg-dark border border-primary/30 text-dark dark:text-light-DEFAULT">
                              <SelectValue placeholder="Select portrait style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="warrior">Warrior</SelectItem>
                            <SelectItem value="mage">Mage</SelectItem>
                            <SelectItem value="rogue">Rogue</SelectItem>
                            <SelectItem value="diplomat">Diplomat</SelectItem>
                            <SelectItem value="mystic">Mystic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Character creation submission */}
            <div className="border-t border-primary/20 pt-6 text-center">
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-dark-darker font-bold py-3 px-8"
                disabled={isLoading || !user}
              >
                {isLoading ? "Creating..." : "Begin Your Journey"}
              </Button>
              
              {!user && (
                <p className="mt-4 text-accent-red text-sm">
                  You must be logged in to create a character
                </p>
              )}
            </div>
          </form>
        </Form>
      </div>
    </motion.section>
  );
}
