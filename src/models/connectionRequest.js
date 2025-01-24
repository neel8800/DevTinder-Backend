const { Schema, model } = require("mongoose");
const {
  validConnectionRequestStatus,
} = require("../constants/connectionRequestSchemaConstants");

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      required: true,
      ref: "UserModel",
      type: Schema.Types.ObjectId,
    },
    toUserId: {
      required: true,
      ref: "UserModel",
      type: Schema.Types.ObjectId,
    },
    connectionRequestStatus: {
      type: String,
      required: true,
      enum: {
        values: validConnectionRequestStatus,
        message: (props) =>
          `"${props.value}" is not a valid connection request status. Valid status are: ${validConnectionRequestStatus}`,
      },
    },
  },
  {
    collection: "connectionRequest",
    timestamps: true,
  }
);

/* Setting-up indexes to utilize Mongo's performance */
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

/* "Pre" methods before certain event ("save", "update", "delete") on schema or model */
connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Can not send connection request to self.");
  }
  next();
});

const connectionRequestModel = model(
  "connectionRequestModel",
  connectionRequestSchema
);

module.exports = { connectionRequestModel };
