import twit from 'twit';
import fs from 'fs'
import { text, images } from '../db/desiege';
import { twitterConfig } from '../config/config'
import { Cast } from '../types';

const twitterClient = new twit(twitterConfig);

export async function tweet(body: Cast, offset: number, random: number) {

    var b64content = fs.readFileSync('app/img/' + images[offset][random], { encoding: 'base64' })

    let cityHealth = "🏰 City Health: " + body.city_health.toString()

    let shieldHealth = "✨ Shield Health: " + body.shield_health.toString()

    let heading = text[offset].title + ": " + (body.token_amount * (body.token_boost / 10000 + 1))

    var msg = heading + "\n \n" + cityHealth + "\n \n" + shieldHealth

    twitterClient.post('media/upload', { media_data: b64content }, function (_err, data: any, _response) {

        var mediaIdStr = data.media_id_string
        var altText = "an image"
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

        twitterClient.post('media/metadata/create', meta_params, function (err, _data, _response) {
            if (!err) {
                // now we can reference the media and post a tweet (media will attach to the tweet)
                var params = { status: msg, media_ids: [mediaIdStr] }

                twitterClient.post('statuses/update', params, function (_err, data, _response) {
                    console.log(data)
                })
            }
        })
    })

}
