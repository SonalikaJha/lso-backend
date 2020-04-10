const Lead = require("../models/lead");
const moment = require('moment');
const User = require("../models/user");

module.exports = class DashboardController {
    static async getFollowUpData(req, res) {

        console.log(req.body);
        console.log("in follow up")
        let options = {
            isDeleted: false
        };
        if (req.user.roleId.code != "sadmin") {
            options.branchId = req.user.branchId._id;
            options["$or"] = [
                {badminId: req.user._id},
                {stlId: req.user._id},
                {smId: req.user._id},
                {stTcId: req.user._id},
                {dtlId: req.user._id},
                {daId: req.user._id}
            ];
        }
        let today = '';
        let startDate = '';
        let endDate = '';
        let userId = '';
        console.log("user id", req.body.userId);
        if (req.body.userId !== '') {
            userId = req.body.userId;
        }

        if (req.body.today === undefined) {
            startDate = moment(req.body.startDate, 'YYYY-MM-DD');
            endDate = moment(req.body.endDate, 'YYYY-MM-DD');
        } else {
            console.log("in today");
            today = moment(req.body.today, 'YYYY-MM-DD');

        }
        let result = [];
        try {
            let response = await Lead.find(options)
                .populate('createdBy', 'name').populate("salesModelId")
                .select('closureDate pipelineDate status followupDate mobile email createdAt name businessType salesModelId');
            response.filter((object) => {

                // console.log("start date",startDate);
                // console.log("end date",endDate);
                if (userId !== '') {
                    if (userId === object.createdBy.id) {
                        if (object.followupDate.length > 0) {
                            object.followupDate.filter((date, index) => {
                                if (today === '') {

                                    if (moment(date.date).isBetween(startDate, endDate)) {
                                        //         delete object.followupDate[index]._id;
                                        //         delete object.followupDate[index].isDone;
                                        object.id = object._id;
                                        delete object._id;
                                        result.push(object);
                                    }

                                } else {
                                    if (moment(date.date).isSame(today)) {
                                        console.log("in today data filter")
                                        //         delete object.followupDate[index]._id;
                                        //         delete object.followupDate[index].isDone;
                                        object.id = object._id;
                                        delete object._id;
                                        result.push(object);
                                    }
                                }
                            });
                        }
                    }
                } else {
                    if (object.followupDate.length > 0) {
                        object.followupDate.filter((date, index) => {
                            if (today === '') {

                                if (moment(date.date).isBetween(startDate, endDate)) {
                                    //         delete object.followupDate[index]._id;
                                    //         delete object.followupDate[index].isDone;
                                    object.id = object._id;
                                    delete object._id;
                                    result.push(object);
                                }

                            } else {
                                if (moment(moment(date.date).format("YYYY-MM-DD")).isSame(today)) {
                                    //         delete object.followupDate[index]._id;
                                    //         delete object.followupDate[index].isDone;
                                    object.id = object._id;
                                    delete object._id;
                                    result.push(object);
                                }
                            }
                        });
                    }
                }
            });
        } catch (e) {
            console.log('response', e);
        }
        res.json({
            message: "FollowUp Data",
            data: result
        });

    }


    static async followUpNotification(req, res) {

        console.log("email",req.user);
        let user=req.user;
        let options = {
            isDeleted: false
        };
        if (req.user.roleId.code != "sadmin") {
            options.branchId = req.user.branchId._id;
            options["$or"] = [
                {badminId: req.user._id},
                {stlId: req.user._id},
                {smId: req.user._id},
                {stTcId: req.user._id},
                {dtlId: req.user._id},
                {daId: req.user._id}
            ];
        }
        let userId;
        if (req.body.userId !== '') {
            userId = req.body.userId;
        }


        let result = [];
        try {
            let response = await Lead.find(options).populate('createdBy', 'name');
            response.filter((object) => {

                // console.log("start date",startDate);
                // console.log("end date",endDate);

                if (object.followupDate.length > 0) {
                    object.followupDate.filter((date, index) => {
                       let folDate =moment(date.date).format("YYYY-MM-DD");
                       let todayDate=moment().format("YYYY-MM-DD");
                            if (moment(folDate).isSame(todayDate)) {
                                //         delete object.followupDate[index]._id;
                                //         delete object.followupDate[index].isDone;
                                object.id = object._id;
                                delete object._id;
                                    console.log(object);
                                console.log(user._id);
                                        if((user.roleId.code==="stl") ){
                                            console.log("inside u");
                                            result.push(object);
                                        }else if(user.id===object.createdBy.id){
                                            console.log("inside u");
                                            result.push(object);
                                        }


                            }


                    });
                }
            });
        }catch (e) {
            console.log('response', e);
        }
        res.json({
            message: "Today You have Follow-Up",
            data: result
        });

    }

};

