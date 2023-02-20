import mongoose from "mongoose"


let productSchema = new mongoose.Schema({
    name: {type:String, required: true},
    description: {type:String, required: true},
    createdOn: { type: Date, default: Date.now },
    image: { type: String,required: true },
    category: {type:String,required: true},
    unitName:{type:String,required: true},
    unitPrice:{type:Number,required: true}
  

});
productSchema.index({ name: 'text' });
export const productModel = mongoose.model('Items', productSchema);

const cartSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    productName:String,
    productImage:String,
    productPrice:Number,
    productUnitName:String,
    quantity: Number,
    
});
export const cartModel = mongoose.model('userCart', cartSchema);

const orderSchema = new mongoose.Schema({
    userName:String,
    userNumber:Number,
    userEmail:String,
    userAddress:String,
    products: [{
        productName: String,
        quantity: Number,
        productPrice: Number,
        productUnitName:String,
        userId:String,
        productImage:String,
        productId:String,
    }],  
    totalPrice:Number,
    orderStatus:{type:String, default:"Pending"},
    createdOn: { type: Date, default: Date.now }


    
});
export const orderModel = mongoose.model('usersOrder', orderSchema);



const userSchema = new mongoose.Schema({
    fullName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage:{type:String},
    coverPhoto:{type:String},
    createdOn: { type: Date, default: Date.now },

});
export const userModel = mongoose.model('Store Users', userSchema);


const otpSchema = new mongoose.Schema({
    otp: String,
    email: String,
    isUsed: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
});
export const otpModel = mongoose.model('Otps', otpSchema);

const categorySchema = new mongoose.Schema({
    name: String,
});
export const categoryModel = mongoose.model('Categories',categorySchema );

const otpSchemaViaSms = new mongoose.Schema({
    otp: String,
    email: String,
    number:Number,
    isUsed: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
});
export const otpModelViaSms = mongoose.model('Otps-with-SMS', otpSchemaViaSms);


/////////////////////////////////////////////////////////////////////////////////////////////////

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});


mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////