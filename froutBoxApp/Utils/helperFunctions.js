// format date 
export const convertDate = (d)=>{
    return new Date(d).toUTCString()?.slice(0,16);
  }
  
export const convertDateForOrder = (d)=>{
    return new Date(d).toUTCString()?.slice(0,22);
  }