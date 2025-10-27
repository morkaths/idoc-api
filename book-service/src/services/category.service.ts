import { Category, ICategory } from "src/models/category.model";
import { FilterQuery } from "mongoose";

const CategoryService = {
    getAll: async (): Promise<ICategory[]> => {
        return Category.find().exec();
    },

    getById: async (id: string): Promise<ICategory | null> => {
        return Category.findById(id).exec();
    },

    search: async (query: FilterQuery<ICategory>): Promise<ICategory[]> => {
        return Category.find(query).exec();
    },

    searchOne: async (query: FilterQuery<ICategory>): Promise<ICategory | null> => {
        return Category.findOne(query).exec();
    },

    create: async (data: Partial<ICategory>): Promise<ICategory> => {
        const category = new Category(data);
        return category.save();
    },

    update: async (id: string, data: Partial<ICategory>): Promise<ICategory | null> => {
        return Category.findByIdAndUpdate(id, data, { new: true }).exec();
    },

    delete: async (id: string): Promise<ICategory | null> => {
        return Category.findByIdAndDelete(id).exec();
    },
};

export default CategoryService;
;