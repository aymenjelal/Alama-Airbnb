export const types = `

    type Review{
        id: String
        content: String
        user: User
        listing: Listing
        createdAt: Date
        lastUpdatedAt: Date  
    }
`;

export const inputs = `

    input NewReviewInput{
        content: String
        user: ReviewUserInput
        listing: ReviewListingInput

    }

    input UpdateReviewInput{
        id: String
        content: String
    }

    input ReviewUserInput{
        id: String
      }

    input ReviewListingInput{
        id: String
    }
  
`;

export const queries = `

    reviewByListing(id: String): [Review]
    

`;

export const mutations = `
    addReview (input: NewReviewInput): Review!
    updateReview (input: UpdateReviewInput): Review!
    deleteReview (input: String): deletedNumber!

`;
