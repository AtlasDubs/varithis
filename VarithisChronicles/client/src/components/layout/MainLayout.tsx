import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-light-DEFAULT text-dark dark:bg-dark dark:text-light-DEFAULT">
      {/* Hidden Light mode background patterns - will be shown when light mode is active */}
      <div className="light-pattern dark:hidden opacity-5 fixed inset-0 z-0" aria-hidden="true">
        <div 
          className="absolute inset-0 bg-repeat" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyY2htZW50JTIwcGFwZXJ8ZW58MHx8MHx8fDA%3D')"
          }}
        ></div>
      </div>

      <Navigation />
      
      <main className="container mx-auto px-4 py-8 flex-grow relative z-10">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
