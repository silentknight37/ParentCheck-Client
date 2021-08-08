import { handleResponse,authHeader } from "../../services/service.backend";
//const now = new Date()
const calanderEvents=[];
const getEvent = async () => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`calender/event`,requestOptions)
   .then(handleResponse)
   .then(response => {

       response.calenderEvents.map(i=>
        
        calanderEvents.push({id:i.id,start:new Date(i.fromDate),end:new Date(i.toDate),title:i.subject})
        )
   });
 }
 await getEvent();
 async export default calanderEvents;