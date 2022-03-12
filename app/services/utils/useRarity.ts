import { resources } from '../../db/resources'

const checkRealmRarity = (realm: any) => {
    let score = 0

    const attribute = realm

    for (let e = 0; e < attribute.length; e++) {
        if (attribute[e].trait_type === 'Regions') {
            const add = (attribute[e].value / 7) * 3
            score = score + add
        } else if (attribute[e].trait_type === 'Harbors') {
            const add = (attribute[e].value / 35) * 3
            score = score + add
        } else if (attribute[e].trait_type === 'Cities') {
            const add = (attribute[e].value / 21) * 3
            score = score + add
        } else if (attribute[e].trait_type === 'Rivers') {
            const add = (attribute[e].value / 60) * 3
            score = score + add
        } else {
            for (let i = 0; i < resources.length; i++) {
                if (attribute[e].value === resources[i].trait) {
                    const add = 1 / (resources[i].value / 8000)
                    score = score + add
                }
            }
        }
    }
    return score
}



export default checkRealmRarity