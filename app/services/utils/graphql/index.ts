import { gql } from "graphql-request";

export const getRealm = gql`
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

export const getGA = gql`
  query getRealm($id: String!) {
    adventurers(where: { id: $id }) {
      tokenURI
    }
  }
`;

export const getCNC = gql`
  query getDungeon($id: String!) {
    dungeons(where: { id: $id }) {
      svg
    }
  }
`;
