import { motion } from 'framer-motion';
import { factions } from '@/lib/gameData';

export default function FactionSection() {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-cinzel text-2xl md:text-3xl text-primary text-center mb-2">The Factions of Varithis</h2>
        <p className="text-dark/80 dark:text-light-DEFAULT/80 text-center max-w-3xl mx-auto mb-10">
          Choose your allegiance wisely. Each faction offers unique abilities, storylines, and consequences for your journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {factions.map((faction, index) => (
          <motion.div 
            key={faction.id}
            className="faction-card bg-white dark:bg-dark-lighter rounded-lg overflow-hidden border border-primary/20 theme-transition shadow-md hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="h-40 relative">
              <img 
                src={faction.image}
                alt={faction.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-dark-darker to-transparent">
                <div className="flex items-center">
                  <img 
                    src={faction.symbolImage} 
                    alt={`${faction.name} symbol`} 
                    className="w-10 h-10 rounded-full mr-3 border border-primary/50 object-cover"
                  />
                  <h3 className="font-cinzel font-bold text-lg text-light-DEFAULT dark:text-light-DEFAULT">{faction.name}</h3>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm mb-4">
                {faction.description}
              </p>
              <div className="flex justify-between items-center text-xs text-dark/60 dark:text-light-DEFAULT/60">
                <span>
                  <i className={`fas ${faction.id === 'arcane' ? 'fa-bolt' : 
                                      faction.id === 'dominion' ? 'fa-shield-alt' : 
                                      faction.id === 'sylvan' ? 'fa-leaf' : 
                                      'fa-mask'} mr-1 ${faction.iconColor}`}>
                  </i> {faction.focus}
                </span>
                <span>
                  <i className="fas fa-star mr-1 text-primary"></i> Influence: {faction.influence}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
