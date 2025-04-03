import fs from "fs";
import path from "path";
export const deleteFile=(filepath:string)=>{
    try{

        fs.unlinkSync(path.join(__dirname,"..",filepath));
    }catch(err){
        console.log("error deleting file")
    }
}