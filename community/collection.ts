import type {Community} from './model';
import CommunityModel from './model';

/**
 * Find a community by a community name.
 * @param name the name of the community
 * @returns a community with the name, or null
 */
export async function findOneByCommunityName(name: string) {
  return CommunityModel.findOne({name});
}
