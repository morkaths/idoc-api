import { Language } from '../models/language.model';

export async function seedLanguages() {
  await Language.deleteMany({});
  await Language.create([
    { code: 'vi', name: 'Tiếng Việt', isDefault: true },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
  ]);
  console.log('Seed language data success!');
}