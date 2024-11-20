import mongoose from "mongoose";

export const KamarKos = mongoose.model(
  "kamar_kos",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        maxLength: [125, "nama kos maksimal 125 karakter"],
      },
      kontrakan: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
        required: true,
        maxLength: [255, "deskripsi kos maksimal 255 karakter"],
      },
      available: {
        type: Number,
        default: 0, // 0 tersedia, 1 sedang dipesan, 2 ditempati
      },
      price: {
        type: Number,
        required: true,
        // min: [10_000, 'harga minimal 10rb'],
        max: [10_000_000, "harga maksimal 10jt"],
      },
      price_harian: {
        type: Number,
        default: 0, // 0 it mean only bulanan not harian
        // min: [10_000, 'harga minimal 10rb'],
        max: [10_000_000, "harga maksimal 10jt"],
      },
      image: [
        {
          type: String,
          maxLength: 255,
        },
      ],
      id_kos: {
        type: mongoose.Schema.ObjectId,
        ref: "kos",
        required: true,
      },
      hidden: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

export const Kos = mongoose.model(
  "kos",
  new mongoose.Schema(
    {
      name: {
        type: String,
        unique: true,
        required: true,
        maxLength: [125, "nama kos maksimal 125 karakter"],
      },
      description: {
        type: String,
        required: true,
        maxLength: [255, "deskripsi kos maksimal 255 karakter"],
      },
      address: {
        type: String,
        required: true,
        maxLength: [125, "alamat kos maksimal 125 karakter"],
      },
      image: {
        type: String,
        maxLength: [255, "link image maksimal 255 karakter"],
      },
      hidden: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

export const Booking = mongoose.model(
  "booking",
  new mongoose.Schema(
    {
      price: {
        type: Number,
        required: true,
        min: [10_000, "harga minimal 10rb"],
        max: [10_000_000, "harga maksimal 10jt"],
      },
      id_kamar_kos: {
        type: mongoose.Schema.ObjectId,
        ref: "kamar_kos",
        required: true,
      },
      id_user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      id_admin: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      attachment: {
        type: String,
        maxLength: 255,
      },
      method_payment: {
        type: String,
        required: true,
        maxLength: 255,
      },
      link_payment: {
        type: String,
        maxLength: 255,
      },
      order_id: {
        type: String,
        maxLength: 255,
      },
      midtrans: {
        type: Object,
      },
      duration: {
        type: Number,
        default: 30,
      },
      paid_status: {
        type: Number,
        default: 1, //0:fail, 1: is pending, 2: success
      },
    },
    { timestamps: true }
  )
);

export const PenghuniKos = mongoose.model(
  "penghuni_kos",
  new mongoose.Schema(
    {
      id_user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      id_kamar_kos: {
        type: mongoose.Schema.ObjectId,
        ref: "kamar_kos",
        required: true,
      },
      id_kos: {
        type: mongoose.Schema.ObjectId,
        ref: "kos",
        required: true,
      },
      tanggal_bayar: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  )
);

export const PenjagaKos = mongoose.model(
  "penjaga_kos",
  new mongoose.Schema(
    {
      id_user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      id_kos: {
        type: mongoose.Schema.ObjectId,
        ref: "kos",
        required: true,
      },
    },
    { timestamps: true }
  )
);

export const Users = mongoose.model(
  "user",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        maxLength: [125, "nama maksimal 125 karakter"],
      },
      role: {
        type: Number,
        default: 0,
      },
      password: {
        type: String,
        required: true,
        maxLength: 255,
      },
      number_phone: {
        type: String,
        required: true,
        unique: true,
        maxLength: [50, "nomor whatsapp maksimal 50 karakter"],
      },
      avatar: {
        type: String,
        // maxLength: 512, // so people can include base64 image
      },
      id_card: {
        type: String,
        maxLength: 255,
      },
      birthdate: {
        type: Date,
        default: "",
      },
      address: {
        type: String,
        maxLength: [125, "alamat maksimal 125 karakter"],
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

export const ResetPassword = mongoose.model(
  "reset_password",
  new mongoose.Schema(
    {
      secret_key: {
        type: String,
        maxLength: 255,
        required: true,
      },
      id_user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      reset: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

export const RefreshTokens = mongoose.model(
  "refresh_tokens",
  new mongoose.Schema(
    {
      token: {
        type: String,
        maxLength: 255,
        required: true,
      },
      last_used: {
        type: Date,
        default: Date.now(),
      },

      id_user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
    },
    { timestamps: true }
  )
);

export const Files = mongoose.model(
  "files",
  new mongoose.Schema(
    {
      name: {
        type: String,
        maxLength: 255,
        required: true,
      },
      link: {
        type: String,
        maxLength: 255,
        required: true,
      },
      type: {
        type: String, //mp4, mp3
        default: "other",
      },
      size: {
        type: Number,
      },
      id_owner: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
    },
    { timestamps: true }
  )
);
