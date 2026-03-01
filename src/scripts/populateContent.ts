import { supabase } from '../lib/supabase';
import { GAME_CONTENT } from '../lib/seedContent';

async function populateContent() {
  console.log('Starting to populate content...');

  const allContent = [
    ...GAME_CONTENT.dry.map(text => ({ category: 'dry' as const, text })),
    ...GAME_CONTENT.wet.map(text => ({ category: 'wet' as const, text })),
    ...GAME_CONTENT.slippery.map(text => ({ category: 'slippery' as const, text })),
    ...GAME_CONTENT.foreplay.map(text => ({ category: 'foreplay' as const, text })),
  ];

  const { data: existing } = await supabase.from('content').select('id').limit(1);

  if (existing && existing.length > 0) {
    console.log('Content already exists, skipping...');
    return;
  }

  const { error } = await supabase.from('content').insert(allContent);

  if (error) {
    console.error('Error populating content:', error);
  } else {
    console.log(`Successfully populated ${allContent.length} pieces of content!`);
  }
}

populateContent();
