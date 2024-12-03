import mongoose from "mongoose";

export default async () => {
    try {
    
    await mongoose.connect(useRuntimeConfig().mongodb);

    console.info("Successfully connected to DB.");
} catch (error) {
    
    console.error(""+error)
    return createError({
      statusCode: 500,
      //   @ts-ignore
      statusMessage: "error cuy",
    });
  }
};
