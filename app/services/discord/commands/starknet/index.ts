import { defaultProvider } from "starknet";
import { StarkNetCall } from "../../../../types";

const baseCall: StarkNetCall = {
    contractAddress:
        "0x29317ae2fccbb5ce0588454b8d13cf690fd7318a983cf72f0c9bf5f02f4a465",
    calldata: ["2"],
    function: "get_module_address",
};

export enum SelectorName {
    getLatestGameIndex = "get_latest_game_index",
    getMainHealth = "get_main_health",
    getShieldValue = "get_shield_value",
    getGameContextVariables = "get_game_context_variables",
}

export const fetchStarkNet = async (props: StarkNetCall) =>
    await defaultProvider.callContract({
        contractAddress: props.contractAddress,
        entrypoint: props.function,
        calldata: props.calldata,
    });

export const fetchBaseState = async () => {
    return await fetchStarkNet(baseCall).then(async (contract: any) => {
        return await fetchStarkNet({
            contractAddress: contract.result[0],
            calldata: ["2"],
            function: SelectorName.getLatestGameIndex,
        });
    })
};
