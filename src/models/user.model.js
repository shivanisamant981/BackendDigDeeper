import mongoose,{Schema} from "mongoose"

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        

    },
    fullName:{
            type:String,
            required:true,
            required:true,
            trim:true,
            index:true,
    },
    avatar:{
            type:String ,//cloudnary service
            required:true,
    },
    coverImage:{
        type:String,

    },
    watchHistory:[
        {
            type:Schema.Type.ObjectId,
            ref:"Video",
        }
    ],
    password:{
        type:String,
        required:[true, "password is required"]
    },
    refershToken:{
        type:String,
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=bcrypt.hash(this.password,10)
    next()
})
userSchema.method.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
       return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY

        } )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
          
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY

        } )

}



const User=mongoose.model("User",userSchema)