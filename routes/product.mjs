import express from 'express';
import {productModel,userModel,categoryModel } from './dbmodels.mjs'
import mongoose from 'mongoose';

const router = express.Router()

router.post('/item', (req, res) => {
    const body = req.body;
   
  if ( // validation
      !body.name||
      !body.productImage||
      !body.description||
      !body.price||
      !body.unit||
      !body.description

      
  ) {
      res.status(400).send({
          message: "required parameters missing",
      });
      return;
  }

  console.log(body)

    productModel.create({
        name:body.name ,
        image: body.productImage,
        category:body.category,
        unitName: body.unit,
        unitPrice:body.price,
        description:body.description
        
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);
                res.send({
                    message: "Product posted successfully"
                });
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })

})

router.post('/category', (req, res) => {
    const body = req.body;
   
  if ( // validation
      !body.category
       
  ) {
      res.status(400).send({
          message: "required parameters missing",
      });
      return;
  }

  console.log("cat body",body)

  categoryModel.findOne({ name: body.category }, (err, category) => {
    if (!err) {
        console.log("category: ", category);

        if (category) { // category already exist
            console.log("category already exist: ", category);
            res.status(400).send({ message: "category already exist, Please try a different name" });
            return;
        }

        else{
            categoryModel.create({
                name:body.category
            
            },
                (err, saved) => {
                    if (!err) {
                        console.log(saved);
                        res.send({
                            message: "Category posted successfully"
                        });
                    } else {
                        res.status(500).send({
                            message: "server error"
                        })
                    }
                })

        }
    }

   

})
})

router.get('/categories', (req, res) => {

    categoryModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "got all categories successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})





// router.get('/items', (req, res) => {
//     const productId = new mongoose.Types.ObjectId(req.body.token._id);

//     productModel.find(
//         { owner: userId },
//         {},
//         {
//             sort: { "_id": -1 },
//             limit: 50,
//             skip: 0,
//             populate:
//             {
//                 path: "owner",
//                 select: 'firstName lastName email profileImage'
//             }
//         }
//         , (err, data) => {
//             if (!err) {
//                 res.send({
//                     message: "got all tweets successfully",
//                     data: data
//                 })
//             } else {
//                 res.status(500).send({
//                     message: "server error"
//                 })
//             }
//         });
 
// })

router.get('/items', async (req, res) => {

    try {
        const q = req.query.q;
        console.log("q: ", q);

        let query;

        if (q) {
            query = productModel.find({ $text: { $search: q } })
        } else {
            query = productModel.find({})
        }

        const products = await query.exec();

        // const modifiedProductList = products.map(eachProduct => {

        //     let product = {
        //         _id: eachProduct._id,
        //         name: eachProduct.name,
        //         image:eachProduct.image,
        //         unitName:eachProduct.unitName,
        //         unitPrice:eachProduct.unitPrice,
        //         category:eachProduct.category,
        //         description:eachProduct.description,
        //     }
        // })

        res.send(products);

    } catch (e) {
        console.log("Error: ", e);
        res.send([]);
    }
})

// router.get('/item/:itemName', async (req, res) => {
//     let itemName = req.query.itemName
//     if(itemName === null) return
//     try {
//         const item = await productModel.find({ name: itemName }).exec()
//         if (!item) {
//             res.status(404).send({})
//             return;
//         } else {
//             res.status(200).send(user)
//         }


        
//     } catch (error) {
//         console.log("error: ", error);
//         res.status(500).send({
//             message: "something went wrong on server",
//         });
   
//     }

   
// })



router.get('/tweet/:id', (req, res) => {

    const id = req.params.id;

    productModel.findOne({ _id: id }, (err, data) => {
        if (!err) {
            if (data) {
                res.send({
                    message: `Get tweet by id: ${data._id} success`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: "Tweet not found",
                })
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

router.delete('/tweet/:ids', (req, res) => {
    const id =req.params.ids;
    productModel.deleteOne({
        _id: id,
        owner: new mongoose.Types.ObjectId(req.body.token._id)

    }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "tweet has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No tweet found with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });


    
})

router.put('/editName', async (req, res) => {

    const body = req.body;
    const email = body.email;
    const firstName = body.updatedFirstName
    const lastName = body.updatedLastName

    if ( // validation
        !body.text||
        !firstName||
        !lastName

     
    ) {
        res.status(400).send({
            message: "required parameters missing"
        });
        return;
    }

    try {
        let data = await userModel.findByIdAndUpdate(email,
            {
                firstName:firstName
                
              
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "Tweet modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})

export default router