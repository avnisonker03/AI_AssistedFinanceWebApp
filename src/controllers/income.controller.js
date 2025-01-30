import { Income } from "../models/income.model.js";
import { User } from "../models/user.model.js";

export const createIncomeSource=(async(req,res)=>{
try {
        const userId=req.userId;
        console.log("userid",userId)
        if(!userId){
            return res.status(404).json({
                message:"you are not authorised to add income"
            })
        }
        const {sourceName,monthlyAmount}=req.body
        if(!sourceName || !monthlyAmount){
            return res.status(404).json({
                message:"kindly provide income source name and monthly Amount"
            })
        }
    
        const newIncome=await Income.create({
            sourceName:sourceName,
            monthlyAmount:monthlyAmount,
            userId:userId
        })
    
        if(!newIncome){
            return res.status(500).json({
                message:"error creating new income"
            })
        }
    
        await User.findByIdAndUpdate(
            userId,
            { $push: { incomes: newIncome._id } }
        );
    
        return res.status(201).json({
            message:"income created successfully",
            income: newIncome 
        })
} catch (error) {
    console.log("error creating income",error);
    return res.status(500).json({
        message:"error creating new income"
    })
}

})

export const updateIncomeSource = (async (req, res) => {
    try {
        const  userId  = req.userId;
        if (!userId) {
            return res.status(404).json({
                message: "you are not authorised to update the income source"
            });
        }

        const { incomeId, updatedSourceIncome, updatedMonthlyAmount } = req.body;
        
        // Check if all required fields are present
        if (!updatedSourceIncome || !updatedMonthlyAmount || !incomeId) {
            return res.status(404).json({
                message: "details are missing provide essentials details to update"
            });
        }

        // First verify if this income belongs to the user
        const existingIncome = await Income.findOne({
            _id: incomeId,
            userId: userId
        });

        if (!existingIncome) {
            return res.status(404).json({
                message: "Income source not found or you're not authorized to update it"
            });
        }

        // Prepare update data
        const updateData = {
            sourceName: updatedSourceIncome,
            monthlyAmount: updatedMonthlyAmount
        };

        // Set options for update
        const options = { 
            new: true,         // Return updated document
            runValidators: true // Run schema validators
        };

        // Update the income
        const updatedIncome = await Income.findByIdAndUpdate(
            incomeId,
            updateData,
            options
        );

        if (!updatedIncome) {
            return res.status(500).json({
                message: "Error updating income source"
            });
        }

        return res.status(200).json({
            message: "Income source updated successfully",
            income: updatedIncome
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating income source",
            error: error.message
        });
    }
});

export const deleteIncomeSource=(async(req,res)=>{
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(404).json({
                message: "you are not authorised to delete the income source"
            });
        }

        const { incomeId } = req.body;
        
        // Check if all required fields are present
        if (!incomeId) {
            return res.status(404).json({
                message: "IncomeID is missing"
            });
        }

        // First verify if this income belongs to the user
        const isIncomeExists = await Income.findOne({
            _id: incomeId,
            userId: userId
        });

        if (!isIncomeExists) {
            return res.status(404).json({
                message: "Income source not found or you're not authorized to delete it"
            });
        }  

       await Income.findByIdAndDelete(incomeId);
       await User.findByIdAndUpdate(
        userId,
        { $pull: { incomes: incomeId } }  // Remove income ID from array
    );

        return res.status(200).json({
            message: "Income source deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting income source",
            error: error.message
        });
    }
})

export const getIncomeById=(async(req,res)=>{
 try {
      const userId=req.userId;
      if(!userId){
       return res.status(401).json({
           message:"you are not authorised to view this income details"
       })
      }
      const {incomeId}=req.params;
      if(!incomeId){
       return res.status(400).json({
           message:"kindly provide income ID"
       })
      }
      const incomeDetails=await Income.findById(incomeId).select("-createdAt -updatedAt")
   
      if(!incomeDetails){
       return res.status(500).json({
           message:"error fetching income details income id must be incorrect"
       })
      }
   
      return res.status(200).json({
        message:"income details fetched successfully",
         incomeDetails,
      })
 } catch (error) {
    console.log("error fetching income details",error)
    return res.status(500).json({
        message:"error fetching income details"
    })
 }

})

export const getAllIncomeLists=(async(req,res)=>{
try {
        const userId=req.userId
        if(!userId){
            return res.status(400).json({
                message:"you are not authorised to view the income details"
            })
        }
        const { page = 1, limit = 10 ,sortBy, sortType} = req.query
        const pageNumber=parseInt(page)
        const limitNumber=parseInt(limit)
        const skip=(pageNumber-1)*limitNumber
       
        let sort={}
        if(sortBy){
            sort[sortBy]=sortType==='desc'? -1:1
        }
    
        const incomeList=await Income.find({userId})
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
    
        const totalIncomeEntries=await Income.countDocuments({userId});
    
        if(!incomeList){
            return res.status(500).json({
                message:"error fetching income lists"
            })
        }
    
        if(totalIncomeEntries===undefined){
            return res.status(500).json({
                message:"error fetching income count"
            })
        }
    
        return res.status(200).json({
            message:"Income lists fetched successfully",
            incomeList,
            totalIncomeEntries
        })
} catch (error) {
    console.log("error fetching lists",error)
    return res.status(500).json({
        message:"error fetching income lists"
    })
}


})