"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = `

    type Review{
        id: String
        content: String
        user: User
        listing: Listing
        createdAt: Date
        lastUpdatedAt: Date  
    }
`;
exports.inputs = `

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
exports.queries = `

    reviewByListing(id: String): [Review]
    

`;
exports.mutations = `
    addReview (input: NewReviewInput): Review!
    updateReview (input: UpdateReviewInput): Review!
    deleteReview (input: String): deletedNumber!

`;
