
/**
 * Joins main entities with their translations.
 * @param mainList - List of main entities
 * @param getTranslation - Function to fetch translations by main entity IDs
 * @param getMainId - Function to get the ID from a main entity
 * @param getTransMainId - Function to get the main entity ID from a translation entity
 * @param mapper - Function to map main and translation entities to a DTO
 * @returns List of DTOs with translations joined
 */
export async function joinWithTranslation<
  MainEntity,
  TranslationEntity,
  Dto
>(
  mainList: MainEntity[],
  getTranslation: (ids: string[]) => Promise<TranslationEntity[]>,
  getMainId: (main: MainEntity) => string,
  getTransMainId: (trans: TranslationEntity) => string,
  mapper: (main: MainEntity, trans?: TranslationEntity) => Dto
): Promise<Dto[]> {
  const ids = mainList.map(getMainId);
  const translations = await getTranslation(ids);
  const transMap = new Map(translations.map(t => [getTransMainId(t), t]));
  return mainList.map(main => mapper(main, transMap.get(getMainId(main))));
}