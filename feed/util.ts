import CommunityModel from '../community/model';
import type {Freet} from '../freet/model';
import type {Query, Types} from 'mongoose';
import UserCollection from '../user/collection';

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

/**
 * Returns database query parameters for freets of a user's interest
 * @param userId the userId of the user to query for freets
 * @returns database query parameters
 */
export async function queryParameters(userId: Types.ObjectId) {
  const user = await UserCollection.findOneByUserId(userId);
  const communities = await CommunityModel.find({
    members: user._id
  });
  return {
    $or: [
      {authorId: {$in: user.following}},
      {community: {$in: communities}}
    ]
  };
}
