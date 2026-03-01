import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GAME_CONTENT } from '../lib/seedContent';

export function useContentSeeder() {
  const [isSeeded, setIsSeeded] = useState(false);

  useEffect(() => {
    async function seedContent() {
      const { data: existing } = await supabase
        .from('content')
        .select('id')
        .limit(1);

      if (existing && existing.length > 0) {
        setIsSeeded(true);
        return;
      }

      const allContent = [
        ...GAME_CONTENT.dry.map(text => ({ category: 'dry' as const, text })),
        ...GAME_CONTENT.wet.map(text => ({ category: 'wet' as const, text })),
        ...GAME_CONTENT.slippery.map(text => ({ category: 'slippery' as const, text })),
        ...GAME_CONTENT.foreplay.map(text => ({ category: 'foreplay' as const, text })),
      ];

      await supabase.from('content').insert(allContent);
      setIsSeeded(true);
    }

    seedContent();
  }, []);

  return isSeeded;
}
