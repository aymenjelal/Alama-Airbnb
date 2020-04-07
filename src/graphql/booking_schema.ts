import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
export const types = `

    type Booking{
        id: String
        startBookDate: Date
        endBookDate: Date
        bookingDate: Date
        user: User
        listing: Listing
    }
`;

export const inputs = `

    input NewBookingInput{
        startBookDate: Date
        endBookDate: Date
        user: BookingUserInput
        listing: BookingListingInput
    }

    input BookingUserInput{
        id: String
      }

    input BookingListingInput{
        id: String
    }

`;

export const queries = `

    bookingByListing(id: String): [Booking]
    bookingByUser(id: String): [Booking]

`;

export const mutations = `

    addBooking (input: NewBookingInput): Booking!
`;
