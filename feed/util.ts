import type {Freet} from 'freet/model';

/**
 * Gets a list of Freets for a given page of the feed.
 * @param freets A list of Freets to filter on
 * @param pageNumber The page number to get
 * @param pageLength The length of the page
 * @returns a filtered list of freets
 */
export function getFreetsForPage(freets: Freet[], pageNumber: number, pageLength: number) {
  return freets.slice((pageNumber - 1) * pageLength, pageNumber * pageLength);
}
