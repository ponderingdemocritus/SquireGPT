import twit from 'twit';
import { twitterConfig } from '../../config'

export const twitterClient = new twit(twitterConfig);