import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadToCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password, fullName } = req.body;
    if(
        [userName, email, password, fullName].some((field) => field?.trim() === "")
    ){
        throw new ApiError("All fields are required", 400);
    }
    const existedUser = User.findONe({ $or: [{ email }, { userName }] });
    if(existedUser){
        throw new ApiError("User with email or Username already exists", 400);
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError("Avatar is required", 400);
    }

    const avatarUploadResult = await uploadToCloudinary(avatarLocalPath);
    const coverImageUploadResult = await uploadToCloudinary(coverImageLocalPath);

    if(!avatarUploadResult){
        throw new ApiError("Failed to upload avatar", 400);
    }
    const user = await User.create({
        fullName,
        avatar : avatarUploadResult.url,
        coverImage : coverImageUploadResult?.url,
        email,
        password,
        userName :  userName.toLowerCase(),
    })
    const createdUser = User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError("Failed to create user while registering the user", 500);
    }
    res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));

})
export default { registerUser };