export interface Action {
    body: Cast
}

export interface Cast {
    token_amount: number
    token_offset: number
    token_boost: number
    game_idx: number
    city_health: number
    shield_health: number
}

export interface DiscordMessage {
    channel: any
}

export interface StarkNetCall {
    contractAddress: string
    function: string
    calldata?: string[]
}