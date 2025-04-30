import { useState } from 'react';
import { motion } from 'framer-motion';
import Timeline from './Timeline';
import { timelineEvents, loreRegions } from '@/lib/gameData';
import { Button } from '@/components/ui/button';

// Tabs for the lore section
type LoreTab = 'history' | 'regions' | 'magic' | 'creatures';

export default function LoreSection() {
  const [activeTab, setActiveTab] = useState<LoreTab>('history');

  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-cinzel text-2xl md:text-3xl text-primary text-center mb-2">The World of Varithis</h2>
        <p className="text-dark/80 dark:text-light-DEFAULT/80 text-center max-w-3xl mx-auto mb-10">
          Explore the rich history, diverse regions, and mystical forces that shape this fantasy realm.
        </p>
      </motion.div>

      {/* Lore navigation tabs */}
      <div className="flex flex-wrap border-b border-primary/20 mb-6">
        <Button
          variant="ghost"
          className={`py-2 px-4 mr-4 mb-2 font-cinzel text-sm md:text-base border-b-2 rounded-none ${
            activeTab === 'history' 
              ? 'text-primary border-primary' 
              : 'text-dark/70 dark:text-light-DEFAULT/70 hover:text-primary border-transparent'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </Button>
        <Button
          variant="ghost"
          className={`py-2 px-4 mr-4 mb-2 font-cinzel text-sm md:text-base border-b-2 rounded-none ${
            activeTab === 'regions' 
              ? 'text-primary border-primary' 
              : 'text-dark/70 dark:text-light-DEFAULT/70 hover:text-primary border-transparent'
          }`}
          onClick={() => setActiveTab('regions')}
        >
          Regions
        </Button>
        <Button
          variant="ghost"
          className={`py-2 px-4 mr-4 mb-2 font-cinzel text-sm md:text-base border-b-2 rounded-none ${
            activeTab === 'magic' 
              ? 'text-primary border-primary' 
              : 'text-dark/70 dark:text-light-DEFAULT/70 hover:text-primary border-transparent'
          }`}
          onClick={() => setActiveTab('magic')}
        >
          Magic & Technology
        </Button>
        <Button
          variant="ghost"
          className={`py-2 px-4 mr-4 mb-2 font-cinzel text-sm md:text-base border-b-2 rounded-none ${
            activeTab === 'creatures' 
              ? 'text-primary border-primary' 
              : 'text-dark/70 dark:text-light-DEFAULT/70 hover:text-primary border-transparent'
          }`}
          onClick={() => setActiveTab('creatures')}
        >
          Creatures
        </Button>
      </div>

      {/* History tab content */}
      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lore-content"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-cinzel text-xl text-primary mb-4">The Age of Formation</h3>
              <div className="prose prose-sm dark:prose-invert">
                <p>
                  Varithis was born from the clash of primal forces, as the ancient texts tell it. The earliest records speak of 
                  a time when elemental beings shaped the land, forging mountains and carving valleys with their titanic struggles.
                </p>
                <p>
                  The First People emerged during this volatile period – ancestors to all the current races of Varithis. They learned 
                  to harness the lingering elemental energies, developing the earliest forms of magic that would eventually evolve 
                  into the sophisticated arcane traditions practiced today.
                </p>
                <p>
                  The remnants of this age can still be found in the form of ancient ruins and mysterious monuments that dot the 
                  landscape, their true purpose long forgotten but their power still palpable to those sensitive to magical energies.
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-cinzel text-xl text-primary mb-4">The Imperial Era</h3>
              <div className="prose prose-sm dark:prose-invert">
                <p>
                  Five centuries ago, the scattered kingdoms of Varithis were united under the banner of the First Emperor, 
                  Caelus the Unifier. What began as a small coalition of city-states in the central plains grew to encompass 
                  the entire continent through a combination of military conquest, diplomatic marriages, and strategic alliances.
                </p>
                <p>
                  The Imperial Era brought unprecedented stability and progress. Great cities rose, trade routes connected distant 
                  regions, and knowledge flourished. The Arcane Conclave was established during this period, bringing structure and 
                  regulations to the practice of magic for the first time.
                </p>
                <p>
                  However, the decline began a century ago when Emperor Meridian IV died without an heir, triggering a succession crisis 
                  that fractured the Imperial power structure. Though the Empire still exists in name, true power has increasingly 
                  shifted to regional governors and the major factions that now compete for influence.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-10">
            <h3 className="font-cinzel text-xl text-primary text-center mb-6">Key Historical Events</h3>
            <Timeline events={timelineEvents} />
          </div>
        </motion.div>
      )}

      {/* Regions tab content */}
      {activeTab === 'regions' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lore-content"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loreRegions.map(region => (
              <div 
                key={region.id}
                className="bg-white dark:bg-dark-lighter rounded-lg overflow-hidden border border-primary/20 theme-transition shadow-md"
              >
                <div className="h-40 relative">
                  <img 
                    src={region.image}
                    alt={region.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-dark-darker to-transparent">
                    <h3 className="font-cinzel font-bold text-lg text-light-DEFAULT">{region.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm mb-4">
                    {region.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-dark/60 dark:text-light-DEFAULT/60">
                    <span>
                      <i className={`fas ${
                        region.id === 'plains' ? 'fa-crown' : 
                        region.id === 'verdant' ? 'fa-leaf' : 
                        'fa-mountain'
                      } mr-1 ${
                        region.id === 'plains' ? 'text-primary' : 
                        region.id === 'verdant' ? 'text-accent-green' : 
                        'text-accent-red'
                      }`}></i> {region.territory}
                    </span>
                    <span>
                      <i className="fas fa-map-marker-alt mr-1 text-secondary"></i> {region.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Magic & Technology tab content */}
      {activeTab === 'magic' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lore-content"
        >
          <div className="prose prose-md dark:prose-invert max-w-4xl mx-auto">
            <h3 className="font-cinzel text-xl text-primary mb-4 text-center">Arcane Arts & Technological Innovations</h3>
            
            <p>
              Magic and technology in Varithis exist in a delicate balance, each influencing and sometimes competing with the other. 
              The continent's rich veins of arcane-sensitive minerals have given rise to unique developments that blend the two disciplines.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h4 className="font-cinzel text-lg text-primary mb-2">Elemental Magic</h4>
                <p>
                  The oldest and most widespread form of magic draws power from the four primal elements: fire, water, earth, and air. 
                  Elemental mages can manipulate these forces to create spectacular effects, from healing wounds to devastating battlefields.
                </p>
                <p>
                  The Sylvan Covenant practitioners have developed a specialized branch that focuses on natural growth and harmony, 
                  while Iron Dominion battle-mages employ more aggressive applications focused on destruction and control.
                </p>
              </div>
              
              <div>
                <h4 className="font-cinzel text-lg text-primary mb-2">Rune Technology</h4>
                <p>
                  The Iron Dominion pioneered the use of runic circuits - intricate patterns etched into metal that can channel and store 
                  magical energy. These innovations led to self-propelled vehicles, communication devices that can transmit messages 
                  across vast distances, and weapons that amplify a soldier's natural abilities.
                </p>
                <p>
                  Unlike pure magic, runic technology can be used by those without magical talent, democratizing access to power 
                  but creating new dependencies on the Dominion's manufacturing capabilities.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Creatures tab content */}
      {activeTab === 'creatures' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lore-content"
        >
          <div className="prose prose-md dark:prose-invert max-w-4xl mx-auto text-center mb-8">
            <h3 className="font-cinzel text-xl text-primary mb-4">Bestiary of Varithis</h3>
            <p>
              From majestic companions to terrifying monsters, the creatures of Varithis have evolved alongside magic 
              and civilization, creating unique ecological niches and challenges for travelers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-dark-lighter p-6 rounded-lg border border-primary/20 shadow-md">
              <h4 className="font-cinzel text-lg text-primary mb-3">Domesticated & Common</h4>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-dark dark:text-light-DEFAULT">Luminar Horses</span>
                  <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm">
                    Bred by the Imperial stables, these horses have minimal patches of glowing fur that provide 
                    light during night travels. Highly prized by nobles and merchant caravans.
                  </p>
                </li>
                <li>
                  <span className="font-bold text-dark dark:text-light-DEFAULT">Flitterwings</span>
                  <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm">
                    Small, hummingbird-like creatures with iridescent wings that are attracted to magical energy. 
                    Often kept as pets by mages who use them as living indicators of arcane activity.
                  </p>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-dark-lighter p-6 rounded-lg border border-primary/20 shadow-md">
              <h4 className="font-cinzel text-lg text-primary mb-3">Magical & Dangerous</h4>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-dark dark:text-light-DEFAULT">Shadowmaws</span>
                  <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm">
                    Predators that can phase partially into the shadow realm, appearing as blurry, half-visible 
                    beasts when stalking prey. Common in the darker forests of eastern Varithis.
                  </p>
                </li>
                <li>
                  <span className="font-bold text-dark dark:text-light-DEFAULT">Crystalhorn Behemoths</span>
                  <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm">
                    Massive herbivores with crystalline growths along their spine and forming their horns. These 
                    crystals absorb ambient magic, making the creatures increasingly dangerous in magically active areas.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
