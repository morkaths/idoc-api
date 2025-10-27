import CategoryRepository from "../repositories/category.repository";
import CategoryTransRepository from "../repositories/categoryTrans.repository";
import { mapToCategoryDto } from "../mappers/category.mapper";
import { ICategory } from "../models/category.model";
import { ICategoryTranslation } from "../models/categoryTranslation.model";
import { CategoryDto } from "../dtos/category.dto";
import { Types } from "mongoose";
import { joinWithTranslation } from "../core/join.helper";

class CategoryService {
    async findAll(lang: string): Promise<CategoryDto[]> {
        const categories = await CategoryRepository.findAll();
        return joinWithTranslation<ICategory, ICategoryTranslation, CategoryDto>(
            categories,
            (ids) => CategoryTransRepository.find({ categoryId: { $in: ids }, lang }),
            (cat) => (cat._id as Types.ObjectId).toString(),
            (trans) => (trans.categoryId as Types.ObjectId).toString(),
            (cat, trans) => mapToCategoryDto(cat, trans, lang)
        );
    }
}

export default new CategoryService();