import { Link } from 'wouter';
import FAIcon from '@/components/ui/fontawesome-icon';

export default function Footer() {
  return (
    <footer className="bg-dark-darker border-t border-primary/20 py-8 theme-transition dark:bg-dark-darker dark:border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 border border-primary/50 mr-3">
                <span className="text-primary font-cinzel font-bold">V</span>
              </div>
              <h2 className="font-cinzel font-bold text-xl text-primary">Chronicles of Varithis</h2>
            </div>
            <p className="text-light-DEFAULT/60 text-sm mt-2 dark:text-light-DEFAULT/60">
              An immersive text-based RPG experience
            </p>
          </div>
          
          <div className="mb-6 md:mb-0">
            <div className="flex space-x-4">
              <button className="text-light-DEFAULT/60 hover:text-primary transition-colors dark:text-light-DEFAULT/60">
                <FAIcon icon="discord" className="text-xl" />
              </button>
              <button className="text-light-DEFAULT/60 hover:text-primary transition-colors dark:text-light-DEFAULT/60">
                <FAIcon icon="twitter" className="text-xl" />
              </button>
              <button className="text-light-DEFAULT/60 hover:text-primary transition-colors dark:text-light-DEFAULT/60">
                <FAIcon icon="instagram" className="text-xl" />
              </button>
              <button className="text-light-DEFAULT/60 hover:text-primary transition-colors dark:text-light-DEFAULT/60">
                <FAIcon icon="reddit" className="text-xl" />
              </button>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-light-DEFAULT/60 text-sm dark:text-light-DEFAULT/60">
              &copy; {new Date().getFullYear()} Chronicles of Varithis
            </p>
            <div className="flex justify-center md:justify-end space-x-4 mt-2">
              <Link href="/privacy">
                <div className="text-light-DEFAULT/60 hover:text-light-DEFAULT text-xs transition-colors dark:text-light-DEFAULT/60 dark:hover:text-light-DEFAULT cursor-pointer">
                  Privacy Policy
                </div>
              </Link>
              <Link href="/terms">
                <div className="text-light-DEFAULT/60 hover:text-light-DEFAULT text-xs transition-colors dark:text-light-DEFAULT/60 dark:hover:text-light-DEFAULT cursor-pointer">
                  Terms of Service
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
