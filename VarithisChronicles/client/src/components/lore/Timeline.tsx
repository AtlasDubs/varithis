import { motion } from 'framer-motion';
import { TimelineEvent } from '@/lib/types';

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary/30 transform -translate-x-1/2"></div>
      
      {/* Timeline events */}
      {events.map((event, index) => (
        <motion.div 
          key={event.title}
          className="relative mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-center">
            <div className="bg-primary w-4 h-4 rounded-full z-10"></div>
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-6">
            <div className="bg-white dark:bg-dark-lighter border border-primary/20 rounded-lg p-4 shadow-lg max-w-md mx-auto theme-transition">
              <span className="font-cinzel text-primary block mb-2">{event.year}</span>
              <h4 className="font-bold text-dark dark:text-light-DEFAULT mb-1">{event.title}</h4>
              <p className="text-dark/70 dark:text-light-DEFAULT/70 text-sm">
                {event.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
