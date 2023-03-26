import { BSON } from "mongodb";

 export function recurisveObjectIdStringifyer(o) {
  if (typeof o == "object" && o != null) {
    if (o instanceof BSON.ObjectId) {
      o = o.toString();
    } else if (Array.isArray(o)) {
      for (const k in o) {
        o[k] = recurisveObjectIdStringifyer(o[k]);
      }
    } else {
      for (const k of Object.keys(o)) {
        o[k] = recurisveObjectIdStringifyer(o[k]);
      }
    }
  }
  return o;
}
