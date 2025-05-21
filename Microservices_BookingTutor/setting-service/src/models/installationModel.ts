import mongoose, { Document, Schema } from "mongoose";
interface IDeviceToken {
  token: string;
  os: string;
}

interface IInstallations extends Document {
  idUsers: string;
  deviceToken: IDeviceToken[];
}

const installationSchema: Schema = new Schema(
  {
    idUsers: {
      type: String,
      required: true,
    },
    deviceToken: {
      type: [
        {
          token: { type: String, required: true },
          os: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true, collection: "installations", strict: false }
);

export const Installation = mongoose.model<IInstallations>(
  "Installation",
  installationSchema
);
