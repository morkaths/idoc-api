import { PipelineStage } from "mongoose";

export const CATEGORY_TRANS_AGGREGATION = (lang?: string): PipelineStage[] => [
  {
    $lookup: {
      from: "categorytranslations",
      let: { categoryId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$categoryId", "$$categoryId"] }
          }
        }
      ],
      as: "allTranslations"
    }
  },
  {
    $addFields: {
      translation: lang
        ? {
          $let: {
            vars: {
              trans: {
                $filter: {
                  input: "$allTranslations",
                  as: "t",
                  cond: { $eq: ["$$t.lang", lang] }
                }
              }
            },
            in: {
              $ifNull: [
                { $arrayElemAt: ["$$trans", 0] },
                { $arrayElemAt: ["$allTranslations", 0] }
              ]
            }
          }
        }
        : "$allTranslations"
    }
  }
];

export const CATEGORY_TRAN_AGGREGATION = (
  lang?: string,
  match: Record<string, any> = {}
): PipelineStage[] => ([
  Object.keys(match).length > 0 ? { $match: match } : undefined,
  ...CATEGORY_TRANS_AGGREGATION(lang)
].filter(Boolean) as PipelineStage[]);