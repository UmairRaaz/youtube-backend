import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {
    /*
    1- Get user details from front end
    2- validation not empty
    3- check if user already exist: username, email
    4- check for images, check for avatar
    5- upload them to cloudinary, avatar
    6- create user object = create entry in db
    7- remove password and refresh token from response
    8- check for user creation
    9- return response
    */
    const { username, email, fullName, password } = req.body;
    if ([username, email, fullName, password].some(filed => filed?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username is already exist")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverimageLocalPath = req.files?.coverImage[0]?.path 
    let coverimageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverimageLocalPath = req.files.coverImage[0].path 
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverimageLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required" )
    }
    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password,
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
})

export { registerUser }