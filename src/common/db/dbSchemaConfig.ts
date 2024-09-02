export const schemaConfig = {
  id: true,
  versionKey: false,
  timestamps: true,
  autoIndex: false,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      // Convert _id to a string and assign it to id
      // Remove _id from the response
      delete ret.password; // Remove sensitive fields
      delete ret.salt;
      delete ret.updatedAt;
      delete ret.refreshToken;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.password;
      delete ret.salt;
      delete ret.updatedAt;
      delete ret.refreshToken;
      return ret;
    },
  },
};
