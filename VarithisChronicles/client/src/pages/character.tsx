import MainLayout from '@/components/layout/MainLayout';
import SteppedCharacterCreation from '@/components/character/SteppedCharacterCreation';
import CharacterList from '@/components/character/CharacterList';
import { useCharacter } from '@/context/CharacterContext';

export default function Character() {
  const { user } = useCharacter();
  
  return (
    <MainLayout>
      {user && <CharacterList />}
      <SteppedCharacterCreation />
    </MainLayout>
  );
}
