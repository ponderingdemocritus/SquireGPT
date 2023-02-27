
import fs from 'fs'
import { text, images, final } from '../../db/desiege';
import { Cast } from '../../types';
import { twitterClient } from '.';

export async function tweet(body: Cast, offset: number, random: number) {

    let b64content: any
    let description: any

    if (body.city_health === 0) {
        b64content = fs.readFileSync('app/img/' + final[0][0], { encoding: 'base64' })
        description = 'The Divine City has been destroyed'
    } else {
        b64content = fs.readFileSync('app/img/' + images[offset][random], { encoding: 'base64' })
        description = text[offset].description
    }

    let cityHealth = "🏰 City Health: " + body.city_health.toString()

    let shieldHealth = "✨ Shield Health: " + body.shield_health.toString()

    let heading = text[offset].title + ": " + (body.token_amount * (body.token_boost / 100 + 1))

    let msg = description + "\n \n \n" + heading + "\n \n" + cityHealth + "\n \n" + shieldHealth

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
