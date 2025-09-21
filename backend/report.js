const fs = require("fs");
const puppeteer = require("puppeteer");

// first we need to import the data and config
const data = require('./data');
const config = require('./config');
// now we need to get the session_id from the data
// why we need this because we had to load the data that is required for the report
function getsessionid(sessionId){
    return data.find(d=>d.session_id===sessionId);

}

// we need the assesment_id from the config to get the assesment
function getassesmentid(assesmentId){
    return config[assesmentId];
}

// we need to extract the field value dynamically 
function getfieldvalue(obj,path){
    return path.split('.').reduce((val,key)=>val?.[key],obj);
}

// generate report text
function generatereport(sessionId){
    // find the recored
    const record=getsessionid(sessionId);
    // check the record
    if(!record){
        return `No record found for session ID: ${sessionId}`;
    }
    // get the config
    const assesment=getassesmentid(record.assessment_id);
    // check the congig
    if(!assesment){
        return `No assessment found for assessment ID: ${record.assessment_id}`;
    }
    // start generating the report
    let report=`Report for Session ID: ${sessionId}\nAssessment ID: ${record.assessment_id}\n\n`;
    // assesment.sections.forEach(section=>{
    //     report+=`\n=== ${section} ===\n`;
    //     for(const [label,mapping] of Object.entries(assesment.fields)){
    //         if(Array.isArray(mapping)){
    //             const values=mapping.map(path=>getfieldvalue(record,path));
    //             report+=`${label}: ${values.join('/')}\n`;
    //         }else{
    //             report+=`${label}: ${getfieldvalue(record,mapping)}\n`;
    //         }
    //     }
    // })
    // return report;

    assesment.sections.forEach(section=>{
        report+=`\n=== ${section} ===\n`;
        for(const [label,details] of Object.entries(assesment.fields)){
            let rawvalue;
            if(Array.isArray(details.path)){
                const values=details.path.map(path=>getfieldvalue(record,path));
                rawvalue=values.join('/');}
                else{
                    rawvalue=getfieldvalue(record,details.path);
                }
                let classifiedval=rawvalue;
                if(details.classify){
                    classifiedval=config.classifications[details.classify](rawvalue);

                }

                if(Array.isArray(rawvalue)){
                    report += `${label}: ${rawValue.join("/")} (${classifiedval})\n`;

                }else{
                    report += `${label}: ${rawvalue} (${classifiedval})\n`;
                }
        }
        report += "\n";
    })
return report;
}


function generateHtmlreport(sessionId){
    const record=getsessionid(sessionId);
    const conf=getassesmentid(record.assessment_id);
    let sectionhtml='';
    conf.sections.forEach(section=>{
        sectionhtml+= `<h2>${section}</h2>`;
        for(const [label,details] of Object.entries(conf.fields)){
            let rawval=Array.isArray(details.path)?
            details.path.map(path=>getfieldvalue(record,path)): getfieldvalue(record,details.path);
            let classified=rawval;
            if(details.classify){
                classified=config.classifications[details.classify](rawval);
            }
            if(Array.isArray(rawval)){
                sectionhtml += `<div class="field"><strong>${label}:</strong> ${rawval.join("/")} (${classified})</div>`;
            }else{
                sectionhtml += `<div class="field"><strong>${label}:</strong> ${rawval} (${classified})</div>`;
            }

        }
    });
    let template = fs.readFileSync("template.html", "utf-8");
    template = template.replaceAll("{{session_id}}", sessionId)
    .replaceAll("{{assessment_id}}", record.assessment_id)
    .replaceAll("{{sections}}", sectionhtml);

    return template;
}

// async function generatePdfReport(sessionId){
//     const html=generateHtmlreport(sessionId);
//     const browser=await puppeteer.launch();
//     const page=await browser.newPage();
//     await page.setContent(html,{waitUntil:'networkidle0'});
//     await page.pdf({path:`report_${sessionId}.pdf`,format:'A4'});
//     await browser.close();
//     console.log(`PDF report generated: report_${sessionId}.pdf`);
// }

async function generatePdfReport(sessionId) {
    const html = generateHtmlreport(sessionId);

    // make sure reports folder exists
    if (!fs.existsSync("reports")) {
        fs.mkdirSync("reports");
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const filePath = `reports/report_${sessionId}.pdf`;
    await page.pdf({ path: filePath, format: 'A4' });

    await browser.close();
    console.log(`PDF report generated: ${filePath}`);

    return filePath;   // ✅ Now it returns a value
}


// console.log(generatereport('session_001'));
// console.log(generatereport('session_002'));
// generatePdfReport('session_001');
// generatePdfReport('session_002');

module.exports={generatePdfReport};