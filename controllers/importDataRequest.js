const Lead = require("../models/lead");
const Helper = require("../config/helper");
const LeadResource = require("../resources/closure_resource");
const CreateLeadValidator = require("../validators/create_lead");
const UpdateLeadValidator = require("../validators/edit_lead");
const moment = require("moment");

const Branch = require("../models/branch");
const LeadSource = require("../models/lead_source");
const LeadType = require("../models/lead_type");
const SalesModel = require("../models/sales_model");
const User = require("../models/user");
const Meeting = require("../models/meeting");
const City = require("../models/city");
const MinimalUserResource = require("../resources/user_minimal_resource");
const {Parser} = require("json2csv");
const CsvParser = require("csv-parser");
const path = require("path");
const fs = require("fs");
const Model = require("mongoose");
const Schema = Model.Schema;


class importDataRequest {

     static salesModelData(salesModelNames) {
        let salesIds = [];
        if (salesModelNames.includes(",")) {
            let salesModelList = salesModelNames.split(",");
            salesModelList.filter(s => {
                console.log("sales model", s);
                SalesModel.findOne({name: s}).then(result => {
                    salesIds.push(result._id);

                }).catch(error => {
                    console.log(error)
                });
            });
            return salesIds;
        } else {
            SalesModel.findOne({name: salesModelNames}).then(result => {
                salesIds.push(result.id);
                return salesIds;
            });
        }


    }
     static async branchData(branchName){
        console.log("bname",branchName);
         let response = await Branch.findOne({name: branchName});
         console.log("branch data in iim", response);
         return response._id
         // .then(result => {
         //     console.log("branch id::", result._id);
         //     return result._id;
         //
         // }).catch(error => {
         //     console.log(error)
         // });;

     }

     static async createdBy(userName){


         let response= await  User.findOne({name: userName});
           return response._id;
         // User.findOne({name: userName}).then(result => {
         //     console.log("import createdBy One", result);
         //
         //     //newLead.createdBy.id=Schema.type.objectId( result._id);
         //     console.log("import createdBy id",result.id);
         //     return result.id;
         //
         // }).catch(err=>{
         //    console.log(err);
         // });

     }

    static  async meetings(meetingDoneBy){

        let personId = [];
        if (meetingDoneBy.includes(",")) {
            let meetingsss = meetingDoneBy.split(",");
            meetingsss.forEach( async  s => {
                let response = await User.findOne({name: meetingDoneBy});
                console.log("meetings", s);
                if(response!=null) {
                    personId.push(response._id);
                    return personId;
                }
            });


        } else {
            let response = await User.findOne({name: meetingDoneBy});
            if(response!=null) {
                personId.push(response._id);
                return personId;
            }
        }

    }

    static async roles(role,name){
        let response = await User.find({isDeleted: false,name:name}) .populate("roleId");
        let id;

       response.forEach( user =>{
           console.log("user.roleId.code",user.roleId.code, user.name);
           if(user.roleId.code===role && user.name===name){
               console.log("role id::",user._id);
               id= user._id;
           }
       });
       return id;

            // .then(users => {
            //     const categorizedUsers = {
            //         sadmin: [],
            //         badmin: [],
            //         stl: [],
            //         sm: [],
            //         tc: [],
            //         dtl: [],
            //         da: [],
            //         pmc: []
            //     };
            //     users.forEach(user => {
            //         if (user.roleId.code in categorizedUsers) {
            //             categorizedUsers[user.roleId.code].push(
            //                 new MinimalUserResource(user)
            //             );
            //         }
            //     });
            //     categorizedUsers.badmin.forEach(ba => {
            //         if (ba.name === chunk["branchAdmin"]) {
            //             newLead.badminId = ba._id;
            //         }
            //     });
            //     categorizedUsers.stl.forEach(s => {
            //         if (s.name === chunk["stlName"]) {
            //             newLead.stlId = s._id;
            //         }
            //     });
            //     categorizedUsers.sm.forEach(ba => {
            //         if (ba.name === chunk["smName"]) {
            //             newLead.smId = ba._id;
            //         }
            //     });
            //     categorizedUsers.tc.forEach(ba => {
            //         if (ba.name === chunk["stTcName"]) {
            //             newLead.stTcId = ba._id;
            //         }
            //     });
            //     categorizedUsers.dtl.forEach(ba => {
            //         if (ba.name === chunk["dtlName"]) {
            //             newLead.dtlId = ba._id;
            //         }
            //     });
            //     categorizedUsers.da.forEach(ba => {
            //         if (ba.name === chunk["daName"]) {
            //             newLead.daId = ba._id;
            //         }
            //     });
            //     categorizedUsers.pmc.forEach(ba => {
            //         if (ba.name === chunk["pmcName"]) {
            //             newLead.pmcId = ba._id;
            //         }
            //     });
            // });
    }
    static  async branchId(branchName){

        Branch.findOne({name:branchName}).then(result => {
           return result._id;
        });
    }


}

module.exports= importDataRequest;
