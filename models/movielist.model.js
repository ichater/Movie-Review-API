const mongoose = require("mongoose");
const Schema = mongoose.Schema;
import { User } from "./user.model";

const movieListSchema = new Schema(
  {
    user: {
      type: User,
    },
    list: {
      type: Object,
      id: id,
      title: title,
    },
  },
  {
    timestapms: true,
  }
);
