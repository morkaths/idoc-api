import { PipelineStage } from "mongoose";

export const BOOKS_WITH_CATEGORY_TRANS_AGGREGATION = (
  lang?: string
): PipelineStage[] => [
    {
      $lookup: {
        from: "categories",
        localField: "categoryIds",
        foreignField: "_id",
        as: "categories"
      }
    },
    {
      $lookup: {
        from: "categorytranslations",
        let: { categoryIds: "$categoryIds" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$categoryId", "$$categoryIds"]
              }
            }
          },
          ...(lang
            ? [{
              $match: {
                $expr: { $eq: ["$lang", lang] }
              }
            }]
            : [])
        ],
        as: "categoryTranslations"
      }
    },
    {
      $addFields: {
        categories: {
          $map: {
            input: "$categories",
            as: "cat",
            in: {
              $mergeObjects: [
                "$$cat",
                {
                  translation: lang
                    ? {
                      $let: {
                        vars: {
                          trans: {
                            $filter: {
                              input: "$categoryTranslations",
                              as: "t",
                              cond: { $eq: ["$$t.categoryId", "$$cat._id"] }
                            }
                          }
                        },
                        in: {
                          $ifNull: [
                            {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: "$$trans",
                                    as: "tt",
                                    cond: { $eq: ["$$tt.lang", lang] }
                                  }
                                },
                                0
                              ]
                            },
                            { $arrayElemAt: ["$$trans", 0] }
                          ]
                        }
                      }
                    }
                    : {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$categoryTranslations",
                            as: "t",
                            cond: { $eq: ["$$t.categoryId", "$$cat._id"] }
                          }
                        },
                        0
                      ]
                    }
                }
              ]
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: "authors",
        localField: "authorIds",
        foreignField: "_id",
        as: "authors"
      }
    }
  ];

export const BOOK_WITH_CATEGORY_TRANS_AGGREGATION = (
  lang?: string,
  match: Record<string, any> = {}
): PipelineStage[] =>
([
  Object.keys(match).length > 0 ? { $match: match } : undefined,
  ...BOOKS_WITH_CATEGORY_TRANS_AGGREGATION(lang)
].filter(Boolean) as PipelineStage[]);