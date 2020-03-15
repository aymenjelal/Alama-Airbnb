"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection = require('../database/knexfile');
const objection_1 = require("objection");
const db_1 = require("../database/db");
objection_1.Model.knex(db_1.db);
class Geolocation extends objection_1.Model {
    static get tableName() {
        return 'geolocations';
    }
    static get relationMappings() {
        return {
            Listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: Listing,
                join: {
                    from: 'geolocations.listings_id',
                    to: 'listings.id'
                }
            }
        };
    }
}
exports.Geolocation = Geolocation;
class Anemity extends objection_1.Model {
    static get tableName() {
        return 'anemitys';
    }
    static get relationMappings() {
        return {
            Listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: Listing,
                join: {
                    from: 'anemitys.listings_id',
                    to: 'listings.id'
                }
            }
        };
    }
}
exports.Anemity = Anemity;
class OccupiedDate extends objection_1.Model {
    static get tableName() {
        return 'occupied_dates';
    }
    static get relationMappings() {
        return {
            Listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: Listing,
                join: {
                    from: 'occupied_dates.listings_id',
                    to: 'listings.id'
                }
            }
        };
    }
}
exports.OccupiedDate = OccupiedDate;
class ListingImage extends objection_1.Model {
    static get tableName() {
        return 'images';
    }
    static get relationMappings() {
        return {
            Listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: Listing,
                join: {
                    from: 'images.listings_id',
                    to: 'listings.id'
                }
            }
        };
    }
}
exports.ListingImage = ListingImage;
class Review extends objection_1.Model {
    static get tableName() {
        return 'reviews';
    }
    static get relationMappings() {
        return {
            Listing: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: Listing,
                join: {
                    from: 'reviews.listings_id',
                    to: 'listings.id'
                }
            },
            User: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'reviews.users_id',
                    to: 'users.id'
                }
            }
        };
    }
}
exports.Review = Review;
class Listing extends objection_1.Model {
    static get tableName() {
        return 'listings';
    }
    static get relationMappings() {
        return {
            user: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'listings.users_id',
                    to: 'users.id'
                }
            },
            reviews: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: Review,
                join: {
                    from: 'listings.id',
                    to: 'reviews.listings_id'
                }
            },
            images: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: ListingImage,
                join: {
                    from: 'listings.id',
                    to: 'images.listings_id'
                }
            },
            occupiedDates: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: OccupiedDate,
                join: {
                    from: 'listings.id',
                    to: 'occupied_dates.listings_id'
                }
            },
            anemitys: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: Anemity,
                join: {
                    from: 'listings.id',
                    to: 'anemitys.listings_id'
                }
            },
            geolocations: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: Geolocation,
                join: {
                    from: 'listings.id',
                    to: 'geolocations.listings_id'
                }
            }
        };
    }
}
exports.Listing = Listing;
class User extends objection_1.Model {
    static get tableName() {
        return 'users';
    }
    static get relationMappings() {
        return {
            listings: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: Listing,
                join: {
                    from: 'users.id',
                    to: 'listings.users_id'
                }
            },
            reviews: {
                relation: objection_1.Model.HasManyRelation,
                modelClass: Review,
                join: {
                    from: 'users.id',
                    to: 'reviews.users_id'
                }
            }
        };
    }
}
exports.User = User;
