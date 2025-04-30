import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Save, Book, FastForward } from 'lucide-react';

export default function GameControls() {
  const { saveGame, isLoading } = useGame();

  const handleSave = async () => {
    await saveGame();
  };

  // TODO: Implement journal functionality
  const openJournal = () => {
    console.log("Journal would open here");
  };

  // TODO: Implement story continuation
  const continueStory = () => {
    console.log("Story would continue here");
  };

  return (
    <div className="flex justify-between border-t border-primary/20 pt-4">
      <Button 
        variant="outline" 
        className="bg-gray-50 hover:bg-gray-100 dark:bg-dark dark:hover:bg-dark-lighter border border-primary/30 text-dark/80 dark:text-light-DEFAULT/80" 
        onClick={openJournal}
      >
        <Book className="mr-2 h-4 w-4" /> Journal
      </Button>
      <div>
        <Button 
          variant="outline"
          className="bg-gray-50 hover:bg-gray-100 dark:bg-dark dark:hover:bg-dark-lighter border border-primary/30 text-dark/80 dark:text-light-DEFAULT/80 mr-3" 
          onClick={handleSave}
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
        <Button 
          className="bg-primary hover:bg-primary-dark text-dark-darker font-bold"
          onClick={continueStory}
        >
          Skip <FastForward className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
