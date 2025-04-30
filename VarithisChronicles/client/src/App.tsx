import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CharacterProvider } from "./context/CharacterContext";
import { GameProvider } from "./context/GameContext";
import Home from "@/pages/home";
import Game from "@/pages/game";
import Character from "@/pages/character";
import Lore from "@/pages/lore";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game" component={Game} />
      <Route path="/character" component={Character} />
      <Route path="/lore" component={Lore} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CharacterProvider>
          <GameProvider>
            <Toaster />
            <Router />
          </GameProvider>
        </CharacterProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
