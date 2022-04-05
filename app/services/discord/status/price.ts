import axios from 'axios'
export const getPrice = async () => {
    let lordsPrice: number = 0;
    const getLordsPrice = async () => {
        const price: any = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=lords&vs_currencies=USD'
        )
        lordsPrice = price.data['lords'].usd
    }
    await getLordsPrice()
    console.log(lordsPrice)
    return 'LORDS: $' + lordsPrice.toFixed(2).toString()
}