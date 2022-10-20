import type {Types} from 'mongoose';
import mongoose, {SchemaTypes} from 'mongoose';
import {Schema} from 'mongoose';

type Feed = {
  _id: Types.ObjectId;
  loaded: Date;
  user: Types.ObjectId;
  freets: Types.ObjectId[];
  settings: FeedSettings;
};

type FeedSettings = {
  perPage: number;
};

const FeedSchema = new Schema<Feed>({
  loaded: {type: Date, required: true},
  user: {type: SchemaTypes.ObjectId, required: true, ref: 'User'},
  freets: [{type: SchemaTypes.ObjectId, ref: 'Freet'}],
  settings: {
    perPage: {
      type: SchemaTypes.Number,
      min: 1,
      set: (v: number) => Math.round(v)
    }
  }
});

const FeedModel = mongoose.model('Feed', FeedSchema);

export default FeedModel;
