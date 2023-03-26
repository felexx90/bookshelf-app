import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

const BookReservationSchema = new mongoose.Schema({
  gutenId: { type: String, required: true },
  booking: [
    {
      beginDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      userId: { type: String, required: true },
    },
  ],
});

// Ensure virtual fields are serialised.
BookReservationSchema.set("toJSON", {
  virtuals: true,
});

BookReservationSchema.set("toObject", {
  virtuals: true,
});

BookReservationSchema.plugin(mongooseLeanVirtuals);

export default mongoose.models.BookReservation ||
  mongoose.model("BookReservation", BookReservationSchema);
