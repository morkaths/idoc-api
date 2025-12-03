import { CategoryTranslation, ICategoryTranslation } from "src/models/category-translation.model";
import { BaseRepository } from "../core/base.repository";

class CategoryTransRepositoryClass extends BaseRepository<ICategoryTranslation> {
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

const CategoryTransRepository = new CategoryTransRepositoryClass();
export default CategoryTransRepository;