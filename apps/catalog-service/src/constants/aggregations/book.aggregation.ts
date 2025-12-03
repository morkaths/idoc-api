import { PipelineStage } from "mongoose";
import { getTranslationByLang } from "./category.aggregation";

/**
 * Aggregation book với categories, translations và authors
 * @param lang - Ngôn ngữ cần lấy translation (optional)
 * @param match - Điều kiện lọc (optional)
 */
export const aggregateBook = (
  lang?: string,
  match: Record<string, any> = {}
): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];

  // Match condition
  if (Object.keys(match).length) pipeline.push({ $match: match });

  // Lookup categories
  pipeline.push({
    $lookup: {
      from: "categories",
      localField: "categoryIds",
      foreignField: "_id",
      as: "categories"
    }
  });

  // Lookup category translations (cho array categoryIds)
  pipeline.push({
    $lookup: {
      from: "categorytranslations",
      let: { categoryIds: "$categoryIds" },
      pipeline: [
        { $match: { $expr: { $in: ["$categoryId", "$$categoryIds"] } } }
      ],
      as: "categoryTranslations"
    }
  });

  // Map categories với translations
  pipeline.push({
    $addFields: {
      categories: {
        $map: {
          input: "$categories",
          as: "cat",
          in: {
            $mergeObjects: [
              "$$cat",
              {
                translation: getTranslationByLang(
                  {
                    $filter: {
                      input: "$categoryTranslations",
                      as: "t",
                      cond: { $eq: ["$$t.categoryId", "$$cat._id"] }
                    }
                  },
                  lang
                )
              }
            ]
          }
        }
      }
    }
  });

  // Cleanup temporary field
  pipeline.push({ $project: { categoryTranslations: 0 } });

  // Lookup authors
  pipeline.push({
    $lookup: {
      from: "authors",
      localField: "authorIds",
      foreignField: "_id",
      as: "authors"
    }
  });

  return pipeline;
};