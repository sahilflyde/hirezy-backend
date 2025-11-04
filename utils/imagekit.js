import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_M1+gHG720FdX0KEsGW8shIZIgo8=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_joGLZ/whneTnawPc52GvEibGVmk=",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/flyde",
});

export default imagekit;
