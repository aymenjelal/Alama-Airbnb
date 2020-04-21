import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';
export const types = `

    type Booking{
        id: String
        startBookDate: Date
        endBookDate: Date
        bookingDate: Date
        confirmed: Boolean
        user: User
        listing: Listing
    }

    type ConfirmLink{
        link: String
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

    input ConfirmBookingInput{
        bookingId: String
    }

`;

export const queries = `

    bookingByListing(id: String): [Booking]
    bookingByListingDate(id:String, start:Date): Booking
    bookingByUser(id: String): [Booking]
    bookingByUserDate(id:String, start:Date) : Booking

`;

export const mutations = `

    addBooking (input: NewBookingInput): Booking!
`;
