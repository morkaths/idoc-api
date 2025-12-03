import { PipelineStage } from "mongoose";
import { getTranslationByLang } from "./category.aggregation";

/**
 * Aggregation for File:
 * - lookup categories
 * - lookup category translations (all) so getTranslationByLang can return array when lang undefined
 * - map categories with translation (array if lang omitted, single object if lang provided)
 */
export const aggregateFile = (lang?: string, match: Record<string, any> = {}): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];

  if (Object.keys(match).length) pipeline.push({ $match: match });

  pipeline.push({
    $lookup: { from: "categories", localField: "categoryIds", foreignField: "_id", as: "categories" }
  });

  pipeline.push({
    $lookup: {
      from: "categorytranslations",
      let: { categoryIds: "$categoryIds" },
      pipeline: [{ $match: { $expr: { $in: ["$categoryId", "$$categoryIds"] } } }],
      as: "categoryTranslations"
    }
  });

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

  pipeline.push({ $project: { categoryTranslations: 0 } });

  return pipeline;
};