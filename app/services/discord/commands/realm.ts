import { SlashCommandBuilder } from "@discordjs/builders";
import { request, gql } from "graphql-request";
import { resources } from "../../../db/resources";

const query = gql`
  query getRealm($id: String!) {
    realm(id: $id) {
      id
      resourceIds
      order
      wonder
      cities
      harbours
      rivers
      regions
      name
      rarityScore
      rarityRank
    }
  }
`;

const fetchRealm = async (id: number) => {
  const variables = {
    id: id.toString(),
  };
  const { realm } = await request(
    "https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms",
    query,
    variables
  );

  const resourceString = resources
    .filter((a: any) => realm.resourceIds.includes(a.id))
    .map((a: any) => {
      return a.trait;
    }).join(' | ');

  console.log(resourceString);

  return {
    title: realm.name,
    image: {
      url: `https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${id}.webp`,
    },
    thumbnail: {
      url: `https://d23fdhqc1jb9no.cloudfront.net/_Realms/${id}.svg`,
    },
    fields: [
      {
        name: "RARITY RANK",
        value: realm.rarityScore.toString() || "0" + " / 7",
        inline: true,
      },
      {
        name: "RARITY SCORE",
        value: realm.rarityRank.toString() || "0" + " / 21",
        inline: true,
      },
      {
        name: "ORDER",
        value: "Order of " + realm.order,
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "RESOURCES",
        value: resourceString,
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "REGIONS",
        value: realm.regions.toString() || "0" + " / 7",
        inline: true,
      },
      {
        name: "CITIES",
        value: realm.cities.toString() || "0" + " / 21",
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "HARBOURS",
        value: realm.harbours.toString() || "0" + " / 35",
        inline: true,
      },
      {
        name: "RIVERS",
        value: realm.rivers.toString() || "0" + " / 60",
        inline: true,
      },
    ],
    timestamp: new Date(),
    url: "https://bibliothecadao.xyz/realms/" + id,
  };
};

export = {
  data: new SlashCommandBuilder()
    .setName("realm")
    .setDescription("Replies with your Realm details")
    .addIntegerOption((option) =>
      option.setName("int").setDescription("Enter Realm Id")
    ),
  async execute(interaction: any) {
    const integer = interaction.options.getInteger("int");
    const res = await fetchRealm(integer);
    await interaction.reply({
      embeds: [res],
      fetchReply: true,
    });
  },
};
