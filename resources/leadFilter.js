const Resource = require('./resource');

const MeetingResource = require('./meeting_resource');

module.exports = class ProfileResource extends Resource {

    format(resource) {
        return {
            id: resource._id || null,
            date: resource.date || null,
            createdAt: resource.createdAt || null,
            //  branchId: resource.branchId || null,
             branchId: resource.branchId ? {
              id: resource.branchId._id,
              name: resource.branchId.name,
            } : null,
          
            // leadSourceId: resource.name || null,
            leadSourceId: resource.leadSourceId ? {
              id: resource.leadSourceId._id,
              name: resource.leadSourceId.name,
            } : null,
            leadTypeId: resource.leadTypeId || null,
            // salesModelId: resource.salesModelId || null,
            salesModelId: resource.salesModelId ? {
              id: resource.salesModelId._id,
              name: resource.salesModelId.name,
            } : null,
            // badminId: resource.badminId|| null,
            badminId: resource.badminId ? {
              id: resource.badminId._id,
              name: resource.badminId.name,
            } : null,
             stlId: resource.stlId || null,
             smId: resource.smId || null,
             stTcId: resource.stTcId || null,
             dtlId: resource.dtlId || null,
             daId: resource.daId || null,
             pmcId: resource.pmcId|| null,

            name: resource.name || null,
            mobile: resource.mobile || null,
            // landline: resource.landline || null,
            // email: resource.email || null,
            businessType: resource.businessType|| null,
            // dealer: {
            //   name: resource.dealer ? resource.dealer.name : null,
            //   mobile: resource.dealer ? resource.dealer.mobile : null,
            //   email: resource.dealer ? resource.dealer.email : null,
            //   companyName: resource.dealer ? resource.dealer.companyName : null,
            // },
            // fmc: {
            //   name: resource.fmc ? resource.fmc.name : null,
            //   mobile: resource.fmc ? resource.fmc.mobile : null,
            //   email: resource.fmc ? resource.fmc.email : null,
            //   companyName: resource.fmc ? resource.fmc.companyName : null,
            // },
            cityId: resource.cityId || null,
            sector: resource.sector || null,
            location: resource.location || null,
             project: resource.project || null,
            // towerNo: resource.towerNo || null,
            // unitNo: resource.unitNo || null,
            // floor: resource.floor || null,
            // superArea: resource.superArea || null,
            // carpetArea: resource.carpetArea || null,
            status: resource.status || null,
            // requirementType: resource.requirementType || null,
            // requirement: resource.requirement || null,
            budgetType: resource.budgetType || null,
             budget: resource.budget || null,
            // projectFeeType: resource.projectFeeType || null,
            // projectFee: resource.projectFee || null,
            // projectFeeRemarks: resource.projectFeeRemarks || null,
             status: resource.status || null,
            // welcomeCall: resource.welcomeCall || null,
            // welcomeText: resource.welcomeText || null,
            // welcomeMail: resource.welcomeMail || null,
            // designProposal: resource.designProposal || null,
            // testFitout: resource.testFitout || null,
            // boq: resource.boq || null,
            // finalLayout: resource.finalLayout || null,
            // whatsappGroupLead: resource.whatsappGroupLead || null,
            // whatsappGroupPMC: resource.whatsappGroupPMC || null,
            // whatsappGroupOwner: resource.whatsappGroupOwner || null,
            // whatsappGroupTenant: resource.whatsappGroupTenant || null,
            // loi: resource.loi || null,
            // agreement: resource.agreement || null,
            // siteVisit: resource.siteVisit || null,
            // meeting: resource.meeting || null,
            followupDate: resource.followupDate || null,
            remarks: resource.remarks || null,
            status: resource.status || null,
            pipelineDate: resource.pipelineDate || null,
            // meetings: new MeetingResource(resource.meetings) || null,
            // inventory: resource.inventory || null,
            // superArea: resource.superArea || null,
            // carpetArea: resource.carpetArea || null,
            closureDate: resource.closureDate || null,
            // furnishingValue: resource.furnishingValue || null,
            // saleValue: resource.saleValue || null,
            // leaseValue: resource.leaseValue || null,
            isActive: resource.isActive || null,
            createdBy: resource.createdBy ? {
              id: resource.createdBy._id,
              name: resource.createdBy.name,
            } : null,
           
        };
    }

}
