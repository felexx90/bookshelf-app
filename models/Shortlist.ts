import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import mongooseAutoPopulate from "mongoose-autopopulate";

const ShortlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  list: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      subjects: [String],
      image: { type: String, required: true },
    },
  ],
});

ShortlistSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ShortlistSchema.statics.findByUser = async function (id) {
  const Shortlist = await this.findOne({
    userId: id,
  });
  return Shortlist;
};

ShortlistSchema.statics.findLeanByUser = async function (id) {
  const Shortlist = await this.findOne({
    userId: id,
  }).lean();
  return Shortlist;
};

// Duplicate the ID field.
ShortlistSchema.virtual("map").get(function () {
  const map = this.list.reduce((acc, book) => {
    acc[book.id] = true;
    return acc;
  }, {});
  return map;
});

// Ensure virtual fields are serialised.
ShortlistSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

ShortlistSchema.set("toObject", {
  virtuals: true,
});

ShortlistSchema.plugin(mongooseAutoPopulate);
ShortlistSchema.plugin(mongooseLeanVirtuals);

export default mongoose.models.Shortlist ||
  mongoose.model("Shortlist", ShortlistSchema);
