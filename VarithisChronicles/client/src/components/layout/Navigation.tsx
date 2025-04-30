import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/game', label: 'Play' },
    { href: '/lore', label: 'Lore' },
    { href: '/character', label: 'Character' }
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/20 bg-dark-lighter/80 backdrop-blur-md theme-transition dark:border-primary/20 dark:bg-dark-lighter/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 border border-primary/50">
                  <span className="text-primary font-cinzel font-bold">V</span>
                </div>
                <h1 className="font-cinzel font-bold text-xl text-primary">Chronicles of Varithis</h1>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-5">
            {/* Main navigation links - hidden on mobile */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={`transition-colors font-inter text-sm uppercase tracking-wide cursor-pointer ${
                      location === item.href 
                        ? 'text-primary' 
                        : 'text-light-DEFAULT hover:text-primary dark:text-light-DEFAULT'
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden rounded-full border border-primary/30 hover:bg-dark-lighter"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4 text-primary" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-lighter border-b border-primary/20 theme-transition dark:bg-dark-lighter dark:border-primary/20">
          <div className="container mx-auto px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div 
                  className="block py-2 text-light-DEFAULT hover:text-primary transition-colors font-inter text-sm uppercase tracking-wide dark:text-light-DEFAULT cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
