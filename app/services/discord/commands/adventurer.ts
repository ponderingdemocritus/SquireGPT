import { SlashCommandBuilder } from "@discordjs/builders";
// import { adventurerTraits } from "../../../services/utils/adventurer";
import { createImage } from '../../../services/utils/helpers';

const MODEL = "hv1s0gecrf0l4m";

interface IAdventurer {
    sex: string;
    race: string;
    skin: string;
    hair: string;
    eyes: string;
    occupation: string;
    pattern: string;

}


const createPrompt = (props: IAdventurer) => {
    const { sex, race, skin, hair, eyes, occupation, pattern } = props;

    const one = 'a ';

    return one + sex + ' ' + race + ' with ' + skin + ' ' + ' and ' + pattern + ',' + hair + ',' + eyes + ',' + occupation
};



const adventurerCommand = {
    data: new SlashCommandBuilder()
        .setName("adventurer")
        .setDescription("Build an Adventurer")
        .addStringOption(option =>
            option.setName('sex')
                .setDescription('Select Sex')
                .setRequired(true)
                .addChoices(
                    { name: 'male', value: 'male' },
                    { name: 'female', value: 'female' },
                    { name: 'n/a', value: 'non-binary' },)
        ).addStringOption(option =>
            option.setName('occupation')
                .setDescription('Select Sex')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'mage',
                        value: 'mage with a wizards hat',
                    },
                    {
                        name: 'warrior',
                        value: 'warrior with detailed iron armour',
                    },
                    {
                        name: 'noble',
                        value: 'royal with a gold crown with jewels',
                    },
                    {
                        name: 'hunter',
                        value: 'deadly assassin with a hood',
                    },)
        ).addStringOption(option =>
            option.setName('skin')
                .setDescription('Select Skin')
                .setRequired(true)
                .addChoices(
                    { name: 'light', value: 'white skin' },
                    { name: 'dark', value: 'brown skin' },
                    { name: 'very dark', value: 'black skin' },
                    { name: 'iridescent', value: 'iridescent skin' },
                    { name: 'red', value: 'red skin' },
                    { name: 'blue', value: 'blue skin' },
                    { name: 'green', value: 'green skin' },)
        ).addStringOption(option =>
            option.setName('hair')
                .setDescription('Select Hair')
                .setRequired(true)
                .addChoices(
                    { name: 'blonde', value: 'blonde hair' },
                    { name: 'black', value: 'black hair' },
                    { name: 'red', value: 'red hair' },
                    { name: 'none', value: 'bald' },)
        ).addStringOption(option =>
            option.setName('eyes')
                .setDescription('Select Eyes')
                .setRequired(true)
                .addChoices(
                    { name: 'blue', value: 'blue eyes' },
                    { name: 'red', value: 'red eyes' },
                    { name: 'black', value: 'black eyes' },
                    { name: 'yellow', value: 'yellow eyes' },)
        ).addStringOption(option =>
            option.setName('race')
                .setDescription('Select Race')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'Elf',
                        value:
                            'mysterious perfectly looking elf with a smirk and pointy ears and gold necklace',

                    },
                    {
                        name: 'Fox',
                        value: 'cute red fox person in a red dress with a bow',

                    },
                    {
                        name: 'Giant',
                        value: 'giant with huge lips and ears and thinning hair',

                    },
                    {
                        name: 'Human',
                        value: 'Beautiful human with a smile',

                    },
                    {
                        name: 'Orc',
                        value: 'ugly hideous green orc with a tooth necklace',

                    },
                    {
                        name: 'Demon',
                        value: 'terrifying demon with sharp teeth',

                    },
                    {
                        name: 'Goblin',
                        value: 'disgusting goblin',

                    },
                    {
                        name: 'Fish',
                        value: 'a person with a fish head with gills on the neck',

                    },
                    { name: 'Cat', value: 'cute cat humanoid ' },
                    {
                        name: 'Frog',
                        value: 'pepe the frog',

                    },)
        ).addStringOption(option =>
            option.setName('patterns')
                .setDescription('Select Patterns')
                .setRequired(true)
                .addChoices(
                    { name: 'Arabic', value: 'arabic face patterns' },
                    {
                        name: 'Chinese',
                        value: 'oriental chinese face patterns',

                    },
                    {
                        name: 'Australian',
                        value: 'australian aboriginal face patterns',

                    },
                    {
                        name: 'Egyptian',
                        value: 'Egyptian face patterns',

                    },
                    { name: 'Mayan', value: 'Mayan face patterns' },
                    { name: 'Aztec', value: 'Aztec face patterns' },)),

    async execute(interaction: any) {
        const sex = interaction.options.getString("sex");
        const race = interaction.options.getString("race");
        const skin = interaction.options.getString("skin");
        const pattern = interaction.options.getString("pattern");
        const hair = interaction.options.getString("hair");
        const eyes = interaction.options.getString("eyes");
        const occupation = interaction.options.getString("occupation");

        const prompt = {
            "input": {
                "prompt": `${createPrompt({ sex, race, skin, pattern, hair, eyes, occupation })}`,
                "negative_prompt": "cartoon, imperfect, poor quality, saturated, unrealistic",
                "width": 768,
                "height": 768
            }
        }

        await interaction.deferReply();

        const embed = await createImage(prompt, MODEL)
            .then((res: any) => {
                return {
                    title: 'Adventurer',
                    description: prompt.input.prompt,
                    image: {
                        url: res.split("?")[0]
                    }
                };


            })
            .catch((error: any) => interaction.channel.send(error.message));
        try {
            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
        }

    },
};

export default adventurerCommand;