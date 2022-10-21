import CommunityModel from 'community/model';
import FreetModel from 'freet/model';
import type {Types} from 'mongoose';
import UserCollection from 'user/collection';
import FeedModel from './model';

/**
 * Creates a Feed and stores it in the database
 * @param numFreets number of freets to put in the feed
 * @param pageLength number of freets to show per page
 * @param userId user ID of user to make the feed for
 * @returns a Feed
 */
export async function createFeed(numFreets: number, pageLength: number, userId: Types.ObjectId) {
  const user = await UserCollection.findOneByUserId(userId);
  const communities = await CommunityModel.find({
    members: user._id
  });
  const freets = await FreetModel.find({
    $or: [
      {authorId: {$in: user.following}},
      {community: {$in: communities}}
    ]
  }).sort({dateCreated: -1}).limit(numFreets);
  const feed = new FeedModel({
    user: user._id,
    freets,
    loaded: new Date(),
    settings: {perPage: pageLength}
  });
  await feed.save();
  return feed;
}
