//Project on scrapping faculty members of bpit ECE from their official site
let req=require("request");
let ch= require("cheerio");
let fs=require("fs");
let path=require("path");
let xlsx=require("xlsx");
req("http://www.bpitindia.com/electrical-and-electronics-engineering-faculty-profile.html",finding);
function finding(err,res,html){
    console.log(res.statusCode);
    let tool=ch.load(html);
    let outputDetails = tool("div.col-md-8")
    let outputNames = tool("div.col-md-4")
    ;let branch=tool("h4.course-title").text();
    let b=branch.split("Departments");
    branch=b[0].trim();
    for (let i = 0; i < outputNames.length; i++) {
        let name=tool(outputNames[i]).find("a.d_inline.fw_600").text();
     let rowteach = tool(outputDetails[i]).find("table.table.table-bordered.table-responsive").find("tbody tr");  
         let rowcol = tool(rowteach).find("td")
         let qualification= tool(rowcol[0]).text().trim();
         let email= tool(rowcol[2]).text().trim();
         let exp= tool(rowcol[4]).text().trim();
         let research= tool(rowcol[6]).text().trim();
          let public= tool(rowcol[8]).text().trim();
          let inter= tool(rowcol[10]).text().trim();
     
         console.log(`Name: ${name} \nQualification: ${qualification} \nEmail: ${email} \nExperience: ${exp} \nResearch: ${research} \nNational Publications: ${public} \nInternational Publications: ${inter}`);
          console.log("''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''");
         staff(branch,name,qualification,email,exp,research,public,inter);
         }

    }
   
   
    

function staff(branch,name,qualification,email,exp,research,public,inter){
    let dirPath=branch;
    let  staff={
        Branch:branch,
        Name:name,
        Qualification:qualification,
        Email:email,
        Experience:exp,
        Research:research,
        National_Publications:public,
        International_Publications:inter
    }
    if (fs.existsSync(dirPath)) {
    }else{
        fs.mkdirSync(dirPath);
    }
    let teacherFilePath= path.join(dirPath,name+".xlsx");
    let pData=[];
    if(fs.existsSync(teacherFilePath)){
     pData=excelReader(teacherFilePath,name)
     pData.push(staff);
    }else{
    console.log("File of player",teacherFilePath,"created");
    pData=[staff];
    }
    excelWriter(teacherFilePath,pData,name);
    }
    
    function excelReader(filePath, name) {
        if (!fs.existsSync(filePath)) {
            return null;
        } else{
    let wt = xlsx.readFile(filePath);
    let excelData = wt.Sheets[name];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
        }
    }
    function excelWriter(filePath, json, name) {
        let newWB = xlsx.utils.book_new();
        let newWS = xlsx.utils.json_to_sheet(json);
        xlsx.utils.book_append_sheet(newWB, newWS, name); 
        xlsx.writeFile(newWB, filePath);
    }
    