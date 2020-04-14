"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = `
  type Listing {
    id: String
    name: String
    price: Float
    street: String
    city: String
    country: String
    bedrooms: Int
    bathrooms: Int
    personCapacity: Int
    houseType: String
    rating: Float
    status: String
    user: User
    reviews: [Review]
    images: [Image]
    geolocations: [Geolocation]
    anemitys: [Anemity]
    bookings: [Booking]
    createdAt: Date
  }
`;
exports.inputs = `

  input NewImageInput{
    url: String
  }

  input NewAnemityInput{
    name: String
  }

  input NewGeolocationInput{
    lat: Float
    long: Float
  }

  input ListingUserInput{
    id: String
  }

  input NewListingInput{
    name: String
    price: Float
    street: String
    city: String
    country: String
    bedrooms: Int
    bathrooms: Int
    personCapacity: Int
    houseType: String
    rating: Float
    user: ListingUserInput
    images: [NewImageInput]
    anemitys: [NewAnemityInput]
    geolocations: [NewGeolocationInput]
  }

  input UpdateImageInput{
    id: String
    url: String
  }

  input UpdateAnemityInput{
    id: String
    name: String
  }

  input UpdateGeolocationInput{
    id: String
    lat: Float
    long: Float
  }

  input UpdateListingInput{
    id: String
    name: String
    price: Float
    street: String
    city: String
    country: String
    bedrooms: Int
    bathrooms: Int
    personCapacity: Int
    houseType: String
    rating: Float
    status: String
    user: ListingUserInput
    images: [UpdateImageInput]
    anemitys: [UpdateAnemityInput]
    geolocations: [UpdateGeolocationInput]
  }

  input ListingFilterInput{
    country: ListingStringFilterInput
    city: ListingStringFilterInput
  }

  input ListingStringFilterInput{
    contains : String
  }

  input SearchListingsInput{
    city: String
    country: String
    price: Float
    personCapacity: Int
  }
  
`;
exports.queries = `
  allListings: [Listing]
  activeListings: [Listing]
  listing(id: String): Listing 
  listingByUser(id:String): [Listing]
  searchListing(input: SearchListingsInput): [Listing]
`;
exports.mutations = `

  addNewListing(input: NewListingInput): Listing!
  updateListing(input: UpdateListingInput): Listing!
  deleteListing(input: String): deletedNumber!


`;
