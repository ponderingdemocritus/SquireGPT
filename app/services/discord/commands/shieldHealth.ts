import { SlashCommandBuilder } from "@discordjs/builders";
import { fetchStarkNet, SelectorName } from './starknet';
import { StarkNetCall } from '../../../types'
import { toBN } from 'starknet/dist/utils/number';

const req: StarkNetCall = {
    contractAddress: "0x29317ae2fccbb5ce0588454b8d13cf690fd7318a983cf72f0c9bf5f02f4a465",
    calldata: ["2"],
    function: "get_module_address"
}

const GAME_ID = 2

const TOKEN_INDEX_OFFSET_BASE = 10;

enum ElementToken {
    Light = 1,
    Dark,
}

const tokenForGame = (GAME_ID * TOKEN_INDEX_OFFSET_BASE + ElementToken.Light).toString()

export = {
    data: new SlashCommandBuilder()
        .setName("shield_health")
        .setDescription("Gets the shield health"),
    async execute(message: any) {
        fetchStarkNet(req)
            .then((contract: any) => {
                fetchStarkNet({
                    contractAddress: contract.result[0],
                    calldata: ["2", tokenForGame],
                    function: SelectorName.getShieldValue
                }).then((health: any) => {
                    console.log(health.result[0])
                    message.channel.send(`Ser, The shield has ${toBN(health.result[0]) / 100} power`);
                })
            })
            .catch((error: any) => message.channel.send(error.message));
    },
};