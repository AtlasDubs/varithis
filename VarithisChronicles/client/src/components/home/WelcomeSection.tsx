import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, Users, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gameFeatures } from '@/lib/gameData';

export default function WelcomeSection() {
  return (
    <section className="mb-16 relative">
      {/* Hero image */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-10 rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="The mystical world of Varithis" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent dark:from-dark"></div>
        <motion.div 
          className="absolute bottom-0 left-0 w-full p-6 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-cinzel text-2xl md:text-4xl font-bold text-light-DEFAULT drop-shadow-lg mb-2 dark:text-light-DEFAULT">
            Enter the World of <span className="text-primary">Varithis</span>
          </h2>
          <p className="text-light-DEFAULT/90 md:text-lg max-w-2xl drop-shadow-md dark:text-light-DEFAULT/90">
            A continent of ancient magic, complex politics, and epic conflicts where your choices determine the fate of nations.
          </p>
        </motion.div>
      </div>

      {/* Introduction text */}
      <motion.div 
        className="prose prose-invert dark:prose-invert mx-auto max-w-3xl text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h3 className="font-cinzel text-xl md:text-2xl text-primary mb-4">Forge Your Legacy</h3>
        <p className="text-dark/80 dark:text-light-DEFAULT/80">
          In the vibrant and conflicted continent of Varithis, navigate complex faction relationships, wield intricate magic and technology, 
          and forge your destiny amidst political intrigue and epic conflicts. Your decisions will shape both your character's legacy and the fate of Varithis itself.
        </p>
      </motion.div>

      {/* Call to action buttons */}
      <motion.div 
        className="flex flex-col md:flex-row justify-center gap-4 mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link href="/character">
          <Button size="lg" className="bg-primary hover:bg-primary-dark text-dark-darker font-bold">
            Create Your Character
          </Button>
        </Link>
        <Link href="/game">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-bold">
            Continue Journey <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gameFeatures.map((feature, index) => (
          <motion.div 
            key={feature.title}
            className="bg-white dark:bg-dark-lighter p-6 rounded-lg border border-primary/20 theme-transition shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
          >
            <div className="text-primary mb-3">
              {feature.icon === 'book-open' && <BookOpen className="h-6 w-6" />}
              {feature.icon === 'users' && <Users className="h-6 w-6" />}
              {feature.icon === 'map-marked-alt' && <Map className="h-6 w-6" />}
            </div>
            <h4 className="font-cinzel text-lg font-bold mb-2">{feature.title}</h4>
            <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
