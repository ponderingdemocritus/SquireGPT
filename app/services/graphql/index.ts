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
