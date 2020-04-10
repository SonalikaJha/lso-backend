const Lead = require("../models/lead");
const Helper = require("../config/helper");
const LeadResource = require("../resources/closure_resource");
const CreateLeadValidator = require("../validators/create_lead");
const UpdateLeadValidator = require("../validators/edit_lead");
const moment = require("moment");
const importRequest = require("./importDataRequest");
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

const csvFields = {
    date: "Date", // date
    branchId: "Branch", // branchID
    leadSourceId: "Lead Source", // leadSourceId
    leadTypeId: "Lead Type", // leadTypeId
    salesModelId: "Sales Model", // salesModelId
    badminId: "Branch Admin", // badminId
    stlId: "STL", // stlId
    smId: "SM", // smId
    stTcId: "ST TC", // stTcId
    dtlId: "DTL", // dtlId
    daId: "DA", // daId
    name: "Client Name", // name
    mobile: "Mobile", // mobile
    landline: "Landline", // landline
    email: "Email", // email
    businessType: "Business Type", // businessType
    dealerName: "Dealer Name", // dealer
    dealerMobile: "Dealer Mobile", // dealer
    dealerEmail: "Dealer Email", // dealer
    dealerCompany: "Dealer Company", // dealer
    fmcName: "FMC Name", // fmc
    fmcMobile: "FMC Mobile", // fmc
    fmcEmail: "FMC Email", // fmc
    fmcCompany: "FMC Company", // fmc
    cityId: "City", // cityId
    sector: "Sector", // sector
    location: "Location", // location
    project: "Project", // project
    towerNo: "Tower No", // towerNo
    unitNo: "Unit No", // unitNo
    floor: "Floor", // floor
    superArea: "Super Area", // superArea
    carpetArea: "Carpet Area", // carpetArea
    status: "Status", // status
    remarks: "Remarks", // remarks
    requirementType: "Requirement Type", // requirementType
    requirement: "Requirement", // requirement
    budgetType: "Budget Type", // budgetType
    budget: "Budget", // budget
    projectFeeType: "Project Fee Type", // projectFeeType
    projectFee: "Project Fee", // projectFee
    projectFeeRemarks: "Project Fee Remark", // projectFeeRemarks
    welcomeCall: "Welcome Call", // welcomeCall
    welcomeText: "Welcome Text", // welcomeText
    welcomeMail: "Welcome Mail", // welcomeMail
    designProposal: "Design Proposal", // designProposal
    testFitout: "Test Fitout", // testFitout
    boq: "BOQ", // boq
    finalLayout: "Final Layout", // finalLayout
    whatsappGroupLead: "Whatsapp Group Lead", // whatsappGroupLead
    whatsappGroupPMC: "Whatsapp Group PMC", // whatsappGroupPMC
    whatsappGroupOwner: "Whatsapp Group Owner", // whatsappGroupOwner
    whatsappGroupTenant: "Whatsapp Group Tenant", // whatsappGroupTenant
    loi: "LOI", // loi
    agreement: "Agreement", // agreement
    followupDate: "Followup Date", // followupDate
    pipelineDate: "Pipeline Date", // pipelineDate
    meetings: "Meetings", // meetings
    closureDate: "Closure Date", // closureDate
    createdBy: "Created By", // createdBy
    updatedBy: "Updated By", // updatedBy
    isActive: "Is Active" // isActive
    // createdAt: "Created At", // createdAt
    // updatedAt: "Updated At", // updatedAt
};

function getInvertedCSVFields(chunk = {}) {
    let reverted = {};
    let revertedChunk = {};
    for (const key in csvFields) {
        if (csvFields.hasOwnProperty(key)) {
            reverted[csvFields[key]] = key;
        }
    }
    return reverted;
    for (const key in chunk) {
        if (chunk.hasOwnProperty(key)) {
            revertedChunk[reverted[key]] = chunk[key];
        }
    }
    return revertedChunk;
}

function getNameFromModel(model = {}) {
    if (!model || typeof model != "object") {
        return "";
    }
    if ("name" in model) {
        return model.name;
    } else {
        return "";
    }
}

function getModelFromName(name = "", model = undefined) {
    let actualModel = null;
    return actualModel;
}

function formatDate(date) {
    let data = "";
    try {
        data = moment(date).format("Y-M-D");
    } catch (e) {
    }
    return data;
}

function getIdFromName(chunk = {}, req) {
    return new Promise((resolve, reject) => {
        try {
            let leadBranchId = "";
            Promise.all([
                Branch.findOne({
                    // branchId
                    isDeleted: false,
                    name: chunk.branchId
                }),
                LeadSource.findOne({
                    // leadSourceId
                    isDeleted: false,
                    name: chunk.leadSourceId
                }),
                LeadType.findOne({
                    // leadTypeId
                    isDeleted: false,
                    name: chunk.leadTypeId
                }),
                Array.isArray(chunk.salesModelId) // salesModelId
                    ? Promise.all(
                    chunk.salesModelId.map(e =>
                        SalesModelSalesModel.find({
                            isDeleted: false,
                            name: e.id
                        })
                    )
                    )
                    : new Promise((rs, rj) => rs([])),
                User.findOne({
                    // badminId
                    isDeleted: false,
                    name: chunk.badminId
                }).populate("roleId"),
                User.findOne({
                    // stlId
                    isDeleted: false,
                    name: chunk.stlId
                }).populate("roleId"),
                User.findOne({
                    // smId
                    isDeleted: false,
                    name: chunk.smId
                }).populate("roleId"),
                User.findOne({
                    // stTcId
                    isDeleted: false,
                    name: chunk.stTcId
                }).populate("roleId"),
                User.findOne({
                    // dtlId
                    isDeleted: false,
                    name: chunk.dtlId
                }).populate("roleId"),
                User.findOne({
                    // daId
                    isDeleted: false,
                    name: chunk.daId
                }).populate("roleId"),
                City.findOne({
                    // cityId
                    name: chunk.cityId
                }),
                User.findOne({
                    // createdBy
                    isDeleted: false,
                    name: chunk.createdBy
                }),
                User.findOne({
                    // updatedBy
                    isDeleted: false,
                    name: chunk.updatedBy
                })
            ]).then(ids => {
                const [
                    branchId,
                    leadSourceId,
                    leadTypeId,
                    salesModelId,
                    badminId,
                    stlId,
                    smId,
                    stTcId,
                    dtlId,
                    daId,
                    cityId,
                    createdBy,
                    updatedBy
                ] = ids;

                // validate every record
                if (
                    !branchId ||
                    !leadSourceId ||
                    !leadTypeId ||
                    !salesModelId ||
                    (salesModelId && salesModelId.length == 0) ||
                    !badminId ||
                    !stlId ||
                    !smId ||
                    !stTcId ||
                    !dtlId ||
                    !daId ||
                    !cityId ||
                    !createdBy ||
                    !updatedBy
                ) {
                    reject('Some of the resource ids are invalid');
                }
                // validate every record end

                chunk.branchId = branchId ? branchId._id : null;
                chunk.leadSourceId = leadSourceId ? leadSourceId._id : null;
                chunk.leadTypeId = leadTypeId ? leadTypeId._id : null;
                chunk.salesModelId = salesModelId ? salesModelId._id : null;
                chunk.salesModelId = salesModelId ? salesModelId.map(e => e._id) : [];
                chunk.badminId = badminId ? badminId._id : null;
                chunk.stlId = stlId ? stlId._id : null;
                chunk.smId = smId ? smId._id : null;
                chunk.stTcId = stTcId ? stTcId._id : null;
                chunk.dtlId = dtlId ? dtlId._id : null;
                chunk.daId = daId ? daId._id : null;
                chunk.cityId = cityId ? cityId._id : null;
                chunk.createdBy = createdBy ? createdBy._id : null;
                chunk.updatedBy = updatedBy ? updatedBy._id : null;
                console.log(chunk);
                resolve(chunk);
            });
        } catch (e) {
            reject(e);
        }
    });
}

function makeTable(fields = {}, leads = []) {
    const count = Object.keys(fields).length;
    let response = "<html><body><table border=1>";
    // make header
    response += "<tr>";
    for (const key in fields) {
        response += "<th>" + fields[key] + "</th>";
    }
    response += "</tr>";
    // make header end
    // make body
    for (lead of leads) {
        response += "<tr>";
        for (const key in lead) {
            if (fields.includes(key)) {
                response += "<td>" + lead[key] + "</td>";
                // response += '<td>' + key + ': ' + lead[key] + '</td>';
            }
        }
        response += "</tr>";
    }
    // make body end
    response += "</table></body></html>";
    return response;
}

module.exports = class Controller {
    static export(req, res) {
        let fields = Object.values(csvFields);

        let options = {
            isDeleted: false
        };
        // if (req.user.roleId.code != "sadmin") {
        //   options.branchId = req.user.branchId;
        // }

        Lead.find(options)
            .populate("branchId")
            .populate("leadSourceId")
            .populate("leadTypeId")
            .populate("salesModelId")
            .populate("badminId")
            .populate("stlId")
            .populate("smId")
            .populate("stTcId")
            .populate("dtlId")
            .populate("daId")
            .populate("requirementType")
            .populate("createdBy")
            .populate("updatedBy")
            .then(leads => {
                // serialize all data
                leads = leads.map(lead => {
                    let newLead = {};
                    for (const key in lead) {
                        switch (key) {
                            case "dealer":
                                newLead["Dealer Name"] = lead.dealer ? lead.dealer.name : "";
                                newLead["Dealer Mobile"] = lead.dealer
                                    ? lead.dealer.mobile
                                    : "";
                                newLead["Dealer Email"] = lead.dealer ? lead.dealer.email : "";
                                newLead["Dealer Company"] = lead.dealer
                                    ? lead.dealer.companyName
                                    : "";
                                break;
                            case "fmc":
                                newLead["FMC Name"] = lead.fmc ? lead.fmc.name : "";
                                newLead["FMC Mobile"] = lead.fmc ? lead.fmc.mobile : "";
                                newLead["FMC Email"] = lead.fmc ? lead.fmc.email : "";
                                newLead["FMC Company"] = lead.fmc ? lead.fmc.companyName : "";
                                break;

                            default:
                                newLead[csvFields[key]] = lead[key];
                                break;
                        }
                    }
                    // -------------------------------------------------------------------
                    // get name for all related models
                    newLead["Branch"] = getNameFromModel(newLead["Branch"]);
                    newLead["Lead Source"] = getNameFromModel(newLead["Lead Source"]);
                    newLead["Lead Type"] = getNameFromModel(newLead["Lead Type"]);
                    newLead["Sales Model"] = getNameFromModel(newLead["Sales Model"]);
                    newLead["Branch Admin"] = getNameFromModel(newLead["Branch Admin"]);
                    newLead["STL"] = getNameFromModel(newLead["STL"]);
                    newLead["SM"] = getNameFromModel(newLead["SM"]);
                    newLead["ST TC"] = getNameFromModel(newLead["ST TC"]);
                    newLead["DTL"] = getNameFromModel(newLead["DTL"]);
                    newLead["DA"] = getNameFromModel(newLead["DA"]);
                    newLead["Created By"] = getNameFromModel(newLead["Created By"]);
                    newLead["Updated By"] = getNameFromModel(newLead["Updated By"]);
                    // get name for all related models end
                    // fix everything wrong
                    newLead["Mobile"] = "'" + newLead["Mobile"].join(",");
                    newLead["Email"] = newLead["Email"].join(",");

                    newLead["Date"] = formatDate(newLead["Date"]);

                    for (const key in newLead) {
                        if (newLead[key] !== false && !newLead[key]) {
                            newLead[key] = "-";
                        }
                    }
                    // fix everything wrong end
                    // -------------------------------------------------------------------
                    return newLead;
                });
                const parser = new Parser({fields});
                let csv = [];
                if (req.params.type == "sample") {
                    csv = parser.parse([]);
                } else {
                    csv = parser.parse(leads);
                }
                // res.send(csv);
                res.attachment("leads.csv");
                return res.status(200).send(csv);
                // return res.send(makeTable(fields, leads));
            });
    }

    static async import(req, res) {
        if ("file" in req.files && (req.files.file.mimetype == "text/csv" || req.files.file.mimetype == "application/vnd.ms-excel")) {
            // console.log("file", file);
            const csv = req.files.file;
            console.log('csv file', csv);
            const storage = require("../config/storage");
            const filePath = path.join(process.cwd(), storage.storageDir, csv.name);

            csv
                .mv(filePath)
                .then(_ => {
                    const readStream = fs.createReadStream(filePath);
                    const data = [];
                    // let sent = false;
                   readStream
                        .pipe(CsvParser())
                        .on("data", async chunk  => {

                            let newLead = {};
                            // console.log("import data",chunk);
                            // unfix everything wrong
                            // for (const key in chunk) {
                            //   if (chunk[key].trim() === "-") {
                            //     chunk[key] = undefined;
                            //   }
                            // }
                            //console.log("chunk sale ids",chunk[""]);

                            // Sale MOdel
                            newLead.salesModelId = await importRequest.salesModelData(chunk["salesModelNames"]);
                            console.log("salesModelId::", newLead.salesModelId);
                            // Emails
                            newLead.email = [];
                            if (chunk["email"].includes(",")) {
                                let salesModelList = chunk["email"].split(",");
                                salesModelList.filter(s => {
                                    newLead.email.push(s);
                                });
                            } else {
                                newLead.email.push(chunk["email"]);
                            }
                            // MObiles

                            newLead.mobile = [];
                            if (chunk["mobile"].includes(",")) {
                                let salesModelList = chunk["mobile"].split(",");
                                salesModelList.filter(s => {
                                    newLead.mobile.push(s);
                                });
                            } else {
                                newLead.mobile.push(chunk["mobile"]);
                            }

                            City.findOne({name: chunk["cityName"]}).then(result => {
                                console.log("city id::", result._id);
                                newLead.cityId = result._id;
                                console.log("newLead.cityId", newLead.cityId);
                            }).catch(err=>{

                            });
                            // lead type
                            LeadType.findOne({name: chunk["leadTypeName"]}).then(result => {
                                newLead.leadTypeId = result._id;
                                console.log(" newLead.leadTypeId", newLead.leadTypeId);
                            }).catch(err=>{

                            });
                            // lead source
                            LeadSource.findOne({name: chunk["leadSourceName"]}).then(result => {
                                newLead.leadSourceId = result._id;
                                console.log(" newLead.leadSourceId", newLead.leadSourceId);
                            }).catch(err=>{

                            });
                            // let response = await User.find({isDeleted: false,name:chunk["branchAdmin"]}) .populate("roleId");
                            // response.forEach(user=>{
                            //     console.log("user.roleId.code",user.roleId.code, user.name);
                            //     if(user.roleId.code==="badmin" && user.name===chunk["branchAdmin"]){
                            //         console.log("role id::",user._id);
                            //         newLead.badminId=user._id;
                            //     }
                            // });

                            // User.find({
                            //     isDeleted: false
                            // })
                            //     .populate("roleId")
                            //     .then(users => {
                            //         const categorizedUsers = {
                            //             sadmin: [],
                            //             badmin: [],
                            //             stl: [],
                            //             sm: [],
                            //             tc: [],
                            //             dtl: [],
                            //             da: [],
                            //             pmc: []
                            //         };
                            //         users.forEach(user => {
                            //             if (user.roleId.code in categorizedUsers) {
                            //                 categorizedUsers[user.roleId.code].push(
                            //                     new MinimalUserResource(user)
                            //                 );
                            //             }
                            //         });
                            //         categorizedUsers.badmin.forEach(ba => {
                            //             if (ba.name === chunk["branchAdmin"]) {
                            //                 newLead.badminId = ba._id;
                            //             }
                            //         });
                            //         categorizedUsers.stl.forEach(s => {
                            //             if (s.name === chunk["stlName"]) {
                            //                 newLead.stlId = s._id;
                            //             }
                            //         });
                            //         categorizedUsers.sm.forEach(ba => {
                            //             if (ba.name === chunk["smName"]) {
                            //                 newLead.smId = ba._id;
                            //             }
                            //         });
                            //         categorizedUsers.tc.forEach(ba => {
                            //             if (ba.name === chunk["stTcName"]) {
                            //                 newLead.stTcId = ba._id;
                            //             }
                            //         });
                            //         categorizedUsers.dtl.forEach(ba => {
                            //             if (ba.name === chunk["dtlName"]) {
                            //                 newLead.dtlId = ba._id;
                            //             }
                            //         });
                            //         categorizedUsers.da.forEach(ba => {
                            //             if (ba.name === chunk["daName"]) {
                            //                 newLead.daId = ba._id;
                            //             }
                            //         });
                            //         categorizedUsers.pmc.forEach(ba => {
                            //             if (ba.name === chunk["pmcName"]) {
                            //                 newLead.pmcId = ba._id;
                            //             }
                            //         });
                            //
                            //
                            //         // let personId = [];
                            //         // if (chunk["meetingDoneBy"].includes(",")) {
                            //         //     let meetingsss = chunk["meetingDoneBy"].split(",");
                            //         //     meetingsss.filter(s => {
                            //         //         console.log("meetings", s);
                            //         //         User.findOne({name: s}).then(result => {
                            //         //             personId.push(result.id);
                            //         //         }).catch(err=>{
                            //         //
                            //         //         });
                            //         //     });
                            //         //     newLead.meetings.personId = personId;
                            //         //     newLead.meetings.remarks = chunk["meetingRemarks"];
                            //         //     console.log("meetings::", newLead.meetings);
                            //         // } else {
                            //         //     User.findOne({name: chunk["meetingDoneBy"]}).then(result => {
                            //         //         console.log("meeting done::", result);
                            //         //         console.log("meeting done::", result._id);
                            //         //         personId.push(result._id);
                            //         //         newLead.meetings.personId = personId;
                            //         //         newLead.meetings.remarks = chunk["meetingRemarks"];
                            //         //
                            //         //     }).catch(err=>{
                            //         //
                            //         //     });
                            //         // }
                            //
                            //     }).catch(error => {
                            //         console.log(error);
                            // });
                            newLead.meetingss = {};
                            //newLead.meetings.personId=[];
                          // let ides= await importRequest.meetings(chunk["meetingDoneBy"]);
                           // newLead.meetings.personId.push(ides);
                            newLead.meetingDoneBy=chunk["meetingDoneBy"];
                            newLead.meetingss.remarks = chunk["meetingRemarks"];
                            newLead.meetingss.personId=[];
                            newLead.badminId =chunk["branchAdmin"];
                            newLead.stlId = chunk["stlName"];
                            newLead.smId = chunk["smName"];
                            newLead.stTcId =chunk["stTcName"];
                            newLead.dtlId = chunk["dtlName"];
                            newLead.daId = chunk["daName"];
                            newLead.pmcId = chunk["pmcName"];

                            newLead.createdBy=chunk["createdByName"];
                            newLead.branchId=chunk["branchName"];
                            console.log("newLead.createdBy::", newLead.createdBy);
                            // console.log("sale",sale);
                            //  salesModelIDs.push(sale._id);

                            //chunk["Date"] = moment(chunk["date"]);
                            // chunk["Email"] = chunk["Email"].split(",");
                            // chunk["Mobile"] = chunk["Mobile"].split(",");
                            // chunk["Followup Date"] = chunk["Followup Date"]
                            //   .split(",")
                            //   .filter(e => e);
                            // chunk["Meetings"] = chunk["Meetings"].split(",").filter(e => e);

                            // unfix everything wrong end
                            // -------------------------------------------------------------------
                            //let reverseCSVField = getInvertedCSVFields();
                            // let newLead = {};
                            //newLead.status=chunk["status"];
                            // newLead.branchName=chunk["branchName"];
                            if(chunk["pipelineDate"]!==""){
                                newLead.pipelineDate = moment(chunk["pipelineDate"]);
                            }else{
                                newLead.pipelineDate=null;
                            }
                            if(chunk["closureDate"]!==""){
                                newLead.closureDate = moment(chunk["closureDate"]);
                            }else{
                                newLead.closureDate=null;
                            }
                            if(chunk["misDate"]!==""){
                                newLead.misDate = moment(chunk["misDate"]);
                            }else{
                                newLead.misDate=null;
                            }
                            // newLead.closureDate = moment(chunk["closureDate"]);
                            // newLead.misDate = moment(chunk["misDate"]);

                            newLead.name = chunk["clientName"];

                            newLead.landline = chunk["landline"];

                            newLead.businessType = chunk["businessType"];

                            newLead.stateName = chunk["stateName"];
                            newLead.countryName = chunk["countryName"];
                            newLead.location = chunk["location"];
                            newLead.sector = chunk["sector"];
                            newLead.project = chunk["project"];
                            newLead.area = chunk["area"];
                            newLead.superArea = chunk["superArea"];
                            newLead.carpetArea = chunk["carpetArea"];
                            newLead.towerNo = chunk["towerNo"];
                            newLead.unitNo = chunk["unitNo"];
                            newLead.floor = chunk["floor"];
                            newLead.budget = chunk["budget"];
                            newLead.budgetType = chunk["budgetType"];
                            newLead.requirement = chunk["requirement"];
                           // newLead.requirementType=chunk["requirementType"];
                            newLead.projectStatus = chunk["projectStatus"];
                            newLead.projectFeeRemarks = chunk["projectRemarks"];
                            newLead.projectFee = chunk["brokerage"];
                            newLead.projectFeeType = chunk["brokerageType"];
                            //newLead.brokerageRemarks = chunk["brokerageRemarks"];
                            newLead.remarks = chunk["remarks"];
                            //newLead.meetingDoneBy=chunk["meetingDoneBy"];
                            newLead.meetingRemarks = chunk["meetingRemarks"];
                            newLead.welcomeCall = chunk["welcomeCall"];
                            newLead.welcomeText = chunk["welcomeText"];
                            newLead.welcomeMail = chunk["welcomeMail"];
                            newLead.testFitout = chunk["testFitout"];
                            newLead.boq = chunk["boq"];
                            newLead.agreement = chunk["agreement"];
                            newLead.designProposal = chunk["designProposal"];
                            newLead.whatsappGroup = chunk["whatsappGroup"];
                            newLead.loi = chunk["loi"];
                            newLead.siteVisit = chunk["siteVisit"];
                            newLead.meeting = chunk["meetingDone"];
                            newLead.whatsappGroupLead = chunk["whatsappGroupLEAD"];
                            newLead.whatsappGroupPMC = chunk["whatsappGroupPMC"];
                            newLead.whatsappGroupOwner = chunk["whatsappGroupOWNER"];
                            newLead.whatsappGroupTenant = chunk["whatsappGroupTENANT"];
                            newLead.finalLayout = chunk["finalLayout"];
                            newLead.status = chunk["leadStatus"];
                            newLead.date = chunk["date"];
                            newLead.followupDate = [];
                            let follow = {};
                            follow.date = moment(chunk["followDate"]);
                            follow.isDone = chunk["followIsDone"];
                            follow.followupRemarks = chunk["followRemarks"];

                            newLead.followupDate.push(follow);
                            newLead.dealer = {};
                            newLead.dealer.name = chunk["dealerName"];
                            newLead.dealer.mobile = chunk["dealerMobile"];
                            newLead.dealer.email = chunk["dealerEmail"];
                            newLead.dealer.companyName = chunk["dealerCompany"];
                            newLead.updatedBy = req.user.id;
                            //newLead.createdBy=moment();
                            newLead.fmc = {};
                            newLead.fmc.name = chunk["fmcName"];
                            newLead.fmc.mobile = chunk["fmcMobile"];
                            newLead.fmc.email = chunk["fmcEmail"];
                            newLead.fmc.companyName = chunk["fmcCompany"];
                            newLead.createdAt=moment();
                            newLead.updatedAt=moment();
                            // for (const key in chunk) {
                            //   // console.log({key, fields: reverseCSVField[key], chunk: chunk[key]});
                            //   newLead[reverseCSVField[key]] = chunk[key];
                            // }
                            //data.push(newLead);

                            console.log("prepare lead data", newLead);

                            data.push(newLead);
                        })
                        .on("end",async _=> {


                            for (const lead of data) {

                                // if (lead.meetingss.personId.includes(",")) {
                                //     let meetingsss = lead.meetingss.personId.split(",");
                                //     let personId=[];
                                //     meetingsss.forEach( async  s => {
                                //         console.log("meetings", s);
                                //         let response = await User.findOne({name: s});
                                //         personId.push(response._id);
                                //
                                //     });
                                //     lead.meetingss.personId=personId;
                                //
                                // } else {
                                //     let response = await User.findOne({name: meetingDoneBy});
                                //
                                //     personId.push(response._id);
                                //
                                // }
                               // let personIds= await importRequest.meetings(lead.meetings.personId);
                                //lead.meetings.personId=[];
                                lead.meetingDoneBy = await importRequest.meetings(lead.meetingDoneBy);

                                lead.meetingss.ids=lead.meetingDoneBy;
                                lead.meetings=[];
                                lead.meetings.push(lead.meetingss);

                                console
                                lead.badminId= await importRequest.roles("badmin",lead.badminId);
                                lead.smId= await importRequest.roles("sm",lead.smId);
                                lead.stlId= await importRequest.roles("stl",lead.stlId);
                                lead.stTcId= await importRequest.roles("tc",lead.stTcId);
                                lead.dtlId= await importRequest.roles("dtl",lead.dtlId);
                                lead.daId= await importRequest.roles("da",lead.daId);
                                lead.pmcId= await importRequest.roles("pmc",lead.pmcId);

                                lead.createdBy= await importRequest.createdBy(lead.createdBy);
                                lead.branchId= await importRequest.branchData(lead.branchId);


                                console.log("lead end::",lead);
                            }


                            const failures = [];
                            const success = [];
                            Promise.all(data)
                              .then(leads => {
                                return Promise.all(
                                  leads.map((e, i) =>

                                          Lead.create(e)
                                              .then(_ => {
                                                  success.push("Imported lead no. " + (i + 1));
                                                  console.log("lead created successfully!!");
                                              })
                                              .catch(e => {
                                                  console.log(e);
                                                  failures.push("Could not import lead no. " + (i + 1));
                                              })
                                  )
                                );
                              })
                              .then(insertedLeads => {
                                return res.json({
                                  message: "Import Complete!",
                                  data: { failures, success }
                                });
                              })
                              .catch(err => {
                                console.log(err);
                                return res.json(err);
                              });

                        });
                })
                .catch(err => {
                    console.log("error occur", err);
                    throw err;
                    return Helper.main.response500(res);
                });
        } else {
            res.status(422).json({message: 'Validation Error', errors: {file: ['CSV file is required!']}});
        }
    }


    // static importLeads(req, res) {
    //     if ("file" in req.files && (req.files.file.mimetype == "text/csv" || req.files.file.mimetype == "application/vnd.ms-excel")) {
    //         // console.log("file", file);
    //         const csv = req.files.file;
    //         console.log('csv file', csv);
    //         const storage = require("../config/storage");
    //         const filePath = path.join(process.cwd(), storage.storageDir, csv.name);
    //         csv
    //             .mv(filePath)
    //             .then(_ => {
    //                 const readStream = fs.createReadStream(filePath);
    //                 console.log('readStream', readStream);
    //                 const data = [];
    //                 // let sent = false;
    //                 readStream
    //                     .pipe(CsvParser())
    //                     .on("data", chunk => {
    //                         console.log("import data", chunk);
    //                         // unfix everything wrong
    //                         for (const key in chunk) {
    //                             if (chunk[key].trim() === "-") {
    //                                 chunk[key] = undefined;
    //                             }
    //                         }
    //
    //                         chunk["Date"] = moment(chunk["Date"]);
    //                         chunk["Email"] = chunk["Email"].split(",");
    //                         chunk["Created By"]=chunk["Created By"];
    //                         chunk["Mobile"] = chunk["Mobile"].split(",");
    //                         chunk["Followup Date"] = chunk["Followup Date"]
    //                             .split(",")
    //                             .filter(e => e);
    //                         chunk["Meetings"] = chunk["Meetings"].split(",").filter(e => e);
    //
    //                         // unfix everything wrong end
    //                         // -------------------------------------------------------------------
    //                         let reverseCSVField = getInvertedCSVFields();
    //                         let newLead = {};
    //                         newLead.dealer = {};
    //                         newLead.dealer.name = chunk["Dealer Name"];
    //                         newLead.dealer.mobile = chunk["Dealer Mobile"];
    //                         newLead.dealer.email = chunk["Dealer Email"];
    //                         newLead.dealer.companyName = chunk["Dealer Company"];
    //                         newLead.fmc = {};
    //                         newLead.fmc.name = chunk["FMC Name"];
    //                         newLead.fmc.mobile = chunk["FMC Mobile"];
    //                         newLead.fmc.email = chunk["FMC Email"];
    //                         newLead.fmc.companyName = chunk["FMC Company"];
    //                         for (const key in chunk) {
    //                             // console.log({key, fields: reverseCSVField[key], chunk: chunk[key]});
    //                             newLead[reverseCSVField[key]] = chunk[key];
    //                         }
    //                         data.push(newLead);
    //                     })
    //                     .on("end", _ => {
    //                         const failures = [];
    //                         const success = [];
    //                         Promise.all(data.map(e => getIdFromName(e, req)))
    //                             .then(leads => {
    //                                 return Promise.all(
    //                                     leads.map((e, i) =>
    //                                         Lead.create(e)
    //                                             .then(_ => {
    //                                                 success.push("Imported lead no. " + (i + 1));
    //                                             })
    //                                             .catch(e => {
    //                                                 failures.push("Could not import lead no. " + (i + 1));
    //                                             })
    //                                     )
    //                                 );
    //                             })
    //                             .then(insertedLeads => {
    //                                 return res.json({
    //                                     message: "Import Complete!",
    //                                     data: {failures, success}
    //                                 });
    //                             })
    //                             .catch(err => {
    //                                 console.log(err);
    //                                 return res.json(err);
    //                             });
    //                     });
    //             })
    //             .catch(err => {
    //                 throw err;
    //                 return Helper.main.response500(res);
    //             });
    //     } else {
    //         res.status(422).json({message: 'Validation Error', errors: {file: ['CSV file is required!']}});
    //     }
    // }

    ////////////////////////////////////////////////

    // static importold(req, res) {
    //     if ("file" in req.files && (req.files.file.mimetype == "text/csv" || req.files.file.mimetype == "application/vnd.ms-excel")) {
    //         // console.log("file", file);
    //         const csv = req.files.file;
    //         console.log('csv file', csv);
    //         const storage = require("../config/storage");
    //         const filePath = path.join(process.cwd(), storage.storageDir, csv.name);
    //         csv
    //             .mv(filePath)
    //             .then(_ => {
    //                 const readStream = fs.createReadStream(filePath);
    //                 console.log('readStream', readStream);
    //                 const data = [];
    //                 // let sent = false;
    //                 readStream
    //                     .pipe(CsvParser())
    //                     .on("data", chunk => {
    //                         console.log("import data", chunk);
    //                         // unfix everything wrong
    //                         for (const key in chunk) {
    //                             if (chunk[key].trim() === "-") {
    //                                 chunk[key] = undefined;
    //                             }
    //                         }
    //
    //                       //  chunk["Date"] = moment(chunk["Date"]);
    //
    //                         chunk["Date"] = moment(chunk["Date"]);
    //                         chunk["Email"] = chunk["Email"];
    //                         chunk["Created By"]=chunk["Created By"];
    //                         chunk["Mobile"] = chunk["Mobile"];
    //                         chunk["Followup Date"] = chunk["Followup Date"];
    //                         chunk["Meetings"] = chunk["Meetings"];
    //
    //
    //                         // unfix everything wrong end
    //                         // -------------------------------------------------------------------
    //                         let reverseCSVField = getInvertedCSVFields();
    //                         let newLead = {};
    //                         newLead.dealer = {};
    //                         newLead.dealer.name = chunk["Dealer Name"];
    //                         newLead.dealer.mobile = chunk["Dealer Mobile"];
    //                         newLead.dealer.email = chunk["Dealer Email"];
    //                         newLead.dealer.companyName = chunk["Dealer Company"];
    //                         newLead.fmc = {};
    //                         newLead.fmc.name = chunk["FMC Name"];
    //                         newLead.fmc.mobile = chunk["FMC Mobile"];
    //                         newLead.fmc.email = chunk["FMC Email"];
    //                         newLead.fmc.companyName = chunk["FMC Company"];
    //                         for (const key in chunk) {
    //                             // console.log({key, fields: reverseCSVField[key], chunk: chunk[key]});
    //                             newLead[reverseCSVField[key]] = chunk[key];
    //                         }
    //                         data.push(newLead);
    //                     })
    //                     .on("end", _ => {
    //                         const failures = [];
    //                         const success = [];
    //                         Promise.all(data.map(e => getIdFromName(e, req)))
    //                             .then(leads => {
    //                                 return Promise.all(
    //                                     leads.map((e, i) =>
    //                                         Lead.create(e)
    //                                             .then(_ => {
    //                                                 success.push("Imported lead no. " + (i + 1));
    //                                             })
    //                                             .catch(e => {
    //                                                 failures.push("Could not import lead no. " + (i + 1));
    //                                             })
    //                                     )
    //                                 );
    //                             })
    //                             .then(insertedLeads => {
    //                                 return res.json({
    //                                     message: "Import Complete!",
    //                                     data: {failures, success}
    //                                 });
    //                             })
    //                             .catch(err => {
    //                                 console.log(err);
    //                                 return res.json(err);
    //                             });
    //                     });
    //             })
    //             .catch(err => {
    //                 throw err;
    //                 return Helper.main.response500(res);
    //             });
    //     } else {
    //         res.status(422).json({message: 'Validation Error', errors: {file: ['CSV file is required!']}});
    //     }
    // }


};
