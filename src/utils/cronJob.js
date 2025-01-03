import { scheduleJob } from "node-schedule"
import moment from "moment";
import { URLModel } from "../../DB/urlModel.js";

export const deleteExpiredURLsCron = ()=>{
    scheduleJob('0 0 * * *',async function ()
    {
        // await URLModel.deleteMany({
        //     expiresAt: { $lt: new Date() },
        //   })

        await URLModel.updateMany(
            {
              expiresAt: { $lt: new Date() }, 
              isActive: { $ne: false } 
            },
            {
              $set: { isActive: false }
            }
          );

        console.log('cron is running');
    })
}