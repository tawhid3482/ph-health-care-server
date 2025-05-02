import multer from "multer"
import path from "path"
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary';
import config from "../config";
import { ICloudinaryResponse, IFile } from "../app/Interfaces/file";


cloudinary.config({
    cloud_name: 'dfvfbqf5v', 
        api_key: '794335562214749', 
        api_secret: config.cloudinary,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};

export const fileUploader = {
    upload,
    uploadToCloudinary
}