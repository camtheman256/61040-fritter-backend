import FreetModel from '../freet/model';
import type {Types} from 'mongoose';
import FeedModel from './model';
import {queryParameters} from './util';

/**
 * Creates a Feed and stores it in the database
 * @param numFreets number of freets to put in the feed
 * @param pageLength number of freets to show per page
 * @param userId user ID of user to make the feed for
 * @returns a Feed
 */
export async function createFeed(numFreets: number, pageLength: number, userId: Types.ObjectId) {
  const freets = await FreetModel.find(await queryParameters(userId)).limit(numFreets);
  const feed = new FeedModel({
    user: userId,
    freets,
    loaded: new Date(),
    settings: {perPage: pageLength}
  });
  await feed.save();
  return feed;
}
