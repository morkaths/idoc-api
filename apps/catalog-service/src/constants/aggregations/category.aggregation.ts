import { PipelineStage } from "mongoose";

/**
 * Helper: Tạo pipeline lookup translations
 */
export const lookupTranslations = (
  collection: string,
  foreignField: string,
  localField: string = "$_id",
  outputField: string = "translations",
  lang?: string
): PipelineStage[] => [
  {
    $lookup: {
      from: collection,
      let: { refId: localField },
      pipeline: [
        {
          $match: {
            $expr: { $eq: [`$${foreignField}`, "$$refId"] }
          }
        },
        ...(lang ? [{ $match: { lang } }] : [])
      ],
      as: outputField
    }
  }
];

/**
 * Helper: Expression lấy translation theo ngôn ngữ
 * - Nếu có lang: lấy translation theo lang
 * - Nếu không có lang: lấy translation đầu tiên
 */
export const getTranslationByLang = (
  translationsField: string | any = "$translations",
  lang?: string,
  fallbackLang?: string
) => {
  if (!lang && !fallbackLang) {
    return translationsField;
  }

  return {
    $ifNull: [
      {
        $arrayElemAt: [
          {
            $filter: {
              input: translationsField,
              as: "trans",
              cond: { $eq: ["$$trans.lang", lang] }
            }
          },
          0
        ]
      },
      { $arrayElemAt: [translationsField, 0] }
    ]
  };
};

/**
 * Aggregation category với translation
 * @param lang - Ngôn ngữ cần lấy translation
 * @param match - Điều kiện lọc (optional)
 */
export const aggregateCategory = (
  lang?: string,
  match: Record<string, any> = {}
): PipelineStage[] => ([
  Object.keys(match).length > 0 ? { $match: match } : undefined,
  ...lookupTranslations("categorytranslations", "categoryId", "$_id", "translations", lang),
  {
    $addFields: {
      translation: getTranslationByLang("$translations", lang)
    }
  }
].filter(Boolean) as PipelineStage[]);