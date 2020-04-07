"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = `

    type Booking{
        id: String
        startBookDate: Date
        endBookDate: Date
        bookingDate: Date
        user: User
        listing: Listing
    }
`;
exports.inputs = `

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
exports.queries = `

    bookingByListing(id: String): [Booking]
    bookingByUser(id: String): [Booking]

`;
exports.mutations = `

    addBooking (input: NewBookingInput): Booking!
`;
