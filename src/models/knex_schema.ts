import Knex from 'knex';
const connection = require('../database/knexfile');
import { Model } from 'objection';

const knexConnection = Knex(connection);

Model.knex(knexConnection);

export class Geolocation extends Model {
  static get tableName(): string {
    return 'geolocations';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'geolocations.listings_id',
          to: 'listings.id'
        }
      }
    };
  }
}

export class Anemity extends Model {
  static get tableName(): string {
    return 'anemitys';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'anemitys.listings_id',
          to: 'listings.id'
        }
      }
    };
  }
}

export class OccupiedDate extends Model {
  static get tableName(): string {
    return 'occupied_dates';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'occupied_dates.listings_id',
          to: 'listings.id'
        }
      }
    };
  }
}

export class ListingImage extends Model {
  static get tableName(): string {
    return 'images';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'images.listings_id',
          to: 'listings.id'
        }
      }
    };
  }
}

export class Review extends Model {
  static get tableName(): string {
    return 'reviews';
  }

  static get relationMappings() {
    return {
      Listing: {
        relation: Model.BelongsToOneRelation,
        modelClass: Listing,
        join: {
          from: 'reviews.listings_id',
          to: 'listings.id'
        }
      },
      User: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'reviews.users_id',
          to: 'users.id'
        }
      }
    };
  }
}

export class Listing extends Model {
  static get tableName(): string {
    return 'listings';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'listings.users_id',
          to: 'users.id'
        }
      },
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'listings.id',
          to: 'reviews.listings_id'
        }
      },
      images: {
        relation: Model.HasManyRelation,
        modelClass: ListingImage,
        join: {
          from: 'listings.id',
          to: 'images.listings_id'
        }
      },
      occupiedDates: {
        relation: Model.HasManyRelation,
        modelClass: OccupiedDate,
        join: {
          from: 'listings.id',
          to: 'occupied_dates.listings_id'
        }
      },
      anemitys: {
        relation: Model.HasManyRelation,
        modelClass: Anemity,
        join: {
          from: 'listings.id',
          to: 'anemitys.listings_id'
        }
      },
      geolocations: {
        relation: Model.HasManyRelation,
        modelClass: Geolocation,
        join: {
          from: 'listings.id',
          to: 'geolocations.listings_id'
        }
      }
    };
  }
}

export class User extends Model {
  static get tableName(): string {
    return 'users';
  }

  static get relationMappings() {
    return {
      listings: {
        relation: Model.HasManyRelation,
        modelClass: Listing,
        join: {
          from: 'users.id',
          to: 'listings.users_id'
        }
      },
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'users.id',
          to: 'reviews.users_id'
        }
      }
    };
  }
}
