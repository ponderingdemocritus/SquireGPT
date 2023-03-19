
export const getPrice = async () => {

    const { default: axios } = await import('axios')

    let lordsPriceUSD: number = 0;

    const getLordsPrice = async () => {
        const price: any = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=lords&vs_currencies=ETH,USD'
        )
        lordsPriceUSD = price.data['lords'].usd

    }
    await getLordsPrice()
    console.log(lordsPriceUSD)
    return '$LORDS: $' + lordsPriceUSD.toFixed(2).toString()
}