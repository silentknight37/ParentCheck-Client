import { handleResponse } from "../../services/service.backend";
//const now = new Date()
const calanderEvents=[];
const getEvent = async () => {
        
  return fetch(`calender/event`)
   .then(handleResponse)
   .then(response => {

       response.calenderEvents.map(i=>
        
        calanderEvents.push({id:i.id,start:new Date(i.fromDate),end:new Date(i.toDate),title:i.subject})
        )
   });
 }
 await getEvent();
 async export default calanderEvents;