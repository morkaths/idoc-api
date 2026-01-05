import { CategoryTranslation, ICategoryTranslation } from "../models/category-translation.model";
import { BaseRepository } from '@libs/core';

class CategoryTransRepository extends BaseRepository<ICategoryTranslation> {
  constructor() {
    super(CategoryTranslation);
  }

  async upsertTranslations(translations: Partial<ICategoryTranslation>[]) {
    const bulkOps = translations.map(t => ({
      updateOne: {
        filter: { categoryId: t.categoryId, lang: t.lang },
        update: { $set: { name: t.name, description: t.description } },
        upsert: true
      }
    }));
    return this.bulkWrite(bulkOps);
  }

}

export const categoryTransRepository = new CategoryTransRepository();