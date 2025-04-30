import { useState } from 'react';
import { useLocation } from 'wouter';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [_, setLocation] = useLocation();

  const handleAuthSuccess = () => {
    // Redirect to character page after successful auth
    setLocation('/character');
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto py-8"
      >
        <h1 className="font-cinzel text-2xl md:text-3xl text-primary text-center mb-6">
          Join the Chronicles of Varithis
        </h1>
        
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login" className="font-cinzel">Login</TabsTrigger>
            <TabsTrigger value="register" className="font-cinzel">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoginForm onSuccess={handleAuthSuccess} />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="register">
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RegisterForm onSuccess={handleAuthSuccess} />
            </motion.div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center">
          <p className="text-dark/70 dark:text-light-DEFAULT/70 mb-2">
            {activeTab === 'login' 
              ? "Don't have an account yet?" 
              : "Already have an account?"}
          </p>
          <button 
            className="text-primary hover:underline font-semibold"
            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
          >
            {activeTab === 'login' ? "Register Now" : "Login Instead"}
          </button>
        </div>
      </motion.div>
    </MainLayout>
  );
}
