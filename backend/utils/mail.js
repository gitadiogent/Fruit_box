const nodemailer = require("nodemailer");
const config = require("../config");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  port: 465,
  auth: {
    user: config.AUTH_EMAIL,
    pass: config.AUTH_Password,
  },
});

// transporter.verify((error,success)=>{
// 	if(error){
// 		console.log(error)
// 	}
// 	else{
// 		console.log("Ready for messages !!")
// 		console.log(success)
// 	}
// })

const FROM = `"Adiogent™" <${config.AUTH_EMAIL}>`;
const OUR_EMAILS = [
  "singhmayank.ms123@gmail.com",
  "st38217@gmail.com",
  "adiogent@gmail.com",
];

//======== On Order Creation Notification Mail ==========
const sendOrderNotificationMail = async (
  customer_name,
  customer_email,
  customer_phone_number,
  customer_address,
  product_count,
  order_total,
  order_notification_email
) => {
  await transporter.sendMail(
    {
      from: FROM,
      to: order_notification_email,
      subject: "New Order | You Got New Order !!",
      html: `
         <!DOCTYPE html>
        <html>
        <head>
        <title>Adiogent | Simplify Ecommerce</title>
        <style>
        .main_div{
        width:50%;
        margin:auto;
        padding:0px 40px;
        padding-bottom:30px;
        background-color:white;
        border-top: 6px solid #0072ff;
        }
        .logo{
        margin-top:30px;
        width:180px;
        }
        .content{
        font-size:16px;
        line-height:30px;
        }
        @media(max-width:768px){
            .main_div{
           width:auto;
           }
           }
        </style>
        </head>
      
        <body style="background-color:#F8F8F8;" >
        
        <div class="main_div" >
    <p class='content' >
    <b>Someone Purchase From Your Store.</b> <br/> <br/>
    Customer Name - ${customer_name} <br/> 
    Customer Email - ${customer_email}  <br/> 
    Customer Phone - ${customer_phone_number}  <br/> 
    Customer Address - ${customer_address} <br/> <br/>
    <b>Buys ${product_count} Products of Total ${order_total} <b> <br/> <br/>
    We're always happy to help you :)<br/>
    <b>Frout Box</b></p>
        </div> 
        </body>
        </html>`,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );
};
//======== On Order Creation Notification Mail ==========

//======== sendContactEnquery ==========
const sendContactEnquery = async (
  customer_name,
  customer_email,
  customer_phone_number,
  order_notification_email,
  message
) => {
  await transporter.sendMail(
    {
      from: FROM,
      to: order_notification_email,
      subject: "Enquery | You Got New Enquery !!",
      html: `
           <!DOCTYPE html>
          <html>
          <head>
          <title>Adiogent | Simplify Ecommerce</title>
          <style>
          .main_div{
          width:50%;
          margin:auto;
          padding:0px 40px;
          padding-bottom:30px;
          background-color:white;
          border-top: 6px solid #0072ff;
          }
          .logo{
          margin-top:30px;
          width:180px;
          }
          .content{
          font-size:16px;
          line-height:30px;
          }
          @media(max-width:768px){
              .main_div{
             width:auto;
             }
             }
          </style>
          </head>
        
          <body style="background-color:#F8F8F8;" >
          
          <div class="main_div" >
      <p class='content' >
      <b>You Got a New Enquiry.</b> <br/> <br/>
      Name - ${customer_name} <br/> 
      Email - ${customer_email}  <br/> 
      Phone - ${customer_phone_number}  <br/> 
      Message - ${message} <br/> <br/>
      <br/>
      <br/>
      <b>Frout Box</b></p>
          </div> 
          </body>
          </html>`,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );
};
//======== sendContactEnquery ==========

//======== On Register Notification Mail ==========
const sendOurNotificationMail = async (appId, phoneNumber) => {
  await transporter.sendMail(
    {
      from: FROM,
      to: OUR_EMAILS,
      subject: "Adiogent - New user has been registerd !!",
      html: `
         <!DOCTYPE html>
        <html>
        <head>
        <title>Adiogent</title>
        <style>
        .main_div{
        width:50%;
        margin:auto;
        padding:0px 40px;
        padding-bottom:30px;
        background-color:white;
        border-top: 6px solid #0072ff;
        }
        .logo{
        margin-top:30px;
        width:180px;
        }
        .content{
        font-size:16px;
        line-height:30px;
        }
        @media(max-width:768px){
            .main_div{
           width:auto;
           }
           }
        </style>
        </head>
      
        <body style="background-color:#F8F8F8;" >
        
        <div class="main_div" >
    <p class='content' >
    <b>New user has been registerd to adiogent</b> <br/> <br/>
        AppID - ${appId} , <br/>
        Phone Number - ${phoneNumber}</b><br/> <br/>
    We're always happy to help you :)<br/>
    <b>Frout Box</b></p>
        </div> 
        </body>
        </html>`,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );
};
//======== On Register Notification Mail ==========

// ============= App Details Submitted Success Mail =============
const sendAppSubmitMail = async (
  storeName,
  app_id,
  email,
  app_color,
  app_type,
  app_template,
  address
) => {
  await transporter.sendMail(
    {
      from: FROM,
      to: email,
      // subject:"Adiogent - Thank you for customizing your app 😊",
      subject: "Welcome to Adiogent Family, Your Gateway to Online Success!",
      html: `<!DOCTYPE html>
        <html>
        <head>
        <title>Adiogent</title>
        <style>
        .main_div{
        width:50%;
        margin:auto;
        padding:0px 40px;
        padding-bottom:30px;
        background-color:white;
        border-top: 6px solid #0072ff;
        }
        .logo{
        margin-top:30px;
        width:180px;
        }
        .content{
        font-size:16px;
        line-height:30px;
        }
        @media(max-width:768px){
            .main_div{
           width:auto;
           }
           }
        </style>
        </head>
        <body style="background-color:#F8F8F8;" >
        <div class="main_div" >

  <p class='content' >Hey <b>${storeName}</b>,<br/><br/>

        Congratulations on finishing the design and customization of your app with Adiogent! We are pleased to inform you that your application is now available for release. Welcome to the next phase of your digital journey!<br/><br/>
        
        You've put your creative touch into every detail of your app, ensuring it reflects your brand's identity and resonates with your target audience. There's no better moment than now to release your app to the public and make a significant mark on the digital marketplace.<br/><br/>
        
        Thank you for choosing Adiogent as the platform to bring your application to life. We are confident that your app will have a significant impact on your business and propel it to new heights.<br/><br/>

        Once again, congratulations on your accomplishments! We are delighted to contribute to the growth of your app and your continued success.<br/><br/>
      
        
        Let us know if you stumble in between and get in touch with us at support@adiogent.in <br/> <br/>
        
        We're always happy to help you :)<br/>
       <b>Frout Box</b></p>
        </div> 
        </body>
        </html>`,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );

  // =========== Our Notification ======
  await transporter.sendMail(
    {
      from: FROM,
      to: OUR_EMAILS,
      subject: "Adiogent - Someone Customize Your App!",
      html: `<!DOCTYPE html>
        <html>
        <head>
        <title>Adiogent</title>
        <style>
        .main_div{
        width:50%;
        margin:auto;
        padding:0px 40px;
        padding-bottom:30px;
        background-color:white;
        border-top: 6px solid #0072ff;
        }
        .logo{
        margin-top:30px;
        width:180px;
        }
        .content{
        font-size:16px;
        line-height:30px;
        }
        @media(max-width:768px){
            .main_div{
           width:auto;
           }
           }
        </style>
        </head>
      
        <body style="background-color:#F8F8F8;" >
        
        <div class="main_div" >
  <p class='content' > <b>${storeName} is Customized Your App To Adiogent!</b> <br/> <br/>
     App ID - ${app_id} <br/> 
     App Name - ${storeName} <br/> 
    Email - ${email}  <br/> 
    App Type - ${app_type} <br/> 
    App Color - ${app_color} <br/> 
    App Template - ${app_template} <br/> 
    Address - ${address} <br/> <br/>
    We're always happy to help you :)<br/>
    <b>Frout Box</b></p>
        </div> 
        </body>
        </html>
        `,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );
  // =========== Our Notification ======
};
// ============= App Details Submitted Success Mail =============

//============ APP PUBLISH MAIL =========
const sendAppPublishMail = async (
  app_publish_id,
  app_id,
  dateAndTime,
  app_publish_type,
  email,
  app_name
) => {
  // =========== User Notification for app publish request ======
  await transporter.sendMail(
    {
      from: FROM,
      to: email,
      subject: "Adiogent - Thank you for requesting to publish your app.",
      html: `<!DOCTYPE html>
        <html>
        <head>
        <title>Adiogent</title>
        <style>
        .main_div{
        width:50%;
        margin:auto;
        padding:0px 40px;
        padding-bottom:30px;
        background-color:white;
        border-top: 6px solid #0072ff;
        }
        .logo{
        margin-top:30px;
        width:180px;
        }
        .content{
        font-size:16px;
        line-height:30px;
        }
        @media(max-width:768px){
            .main_div{
           width:auto;
           }
           }
        </style>
        </head>
        <body style="background-color:#F8F8F8;" >
        <div class="main_div" >
        <p class='content' >Hey <b>${app_name}</b>,<br/>

        Congratulations!!<br/><br/>

        Thank you, We received your app publish request. <br/>

        Your app will take 24 working hours to publish. <br/> <br/>
        
        Note:- Publishing it multiple times will not change its queue position or priority.<br/> <br/>
        
        Let us know if you stumble in between and get in touch with us at support@adiogent.in <br/> <br/>
        
        We're always happy to help you :)<br/>
       <b>Frout Box</b></p>
        </div> 
        </body>
        </html>
        `,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );
  // =========== User Notification for app publish request ======

  // =========== Our Notification ======
  await transporter.sendMail(
    {
      from: FROM,
      to: OUR_EMAILS,
      subject: "Adiogent - Someone is Request To Publsih App!",
      html: `<!DOCTYPE html>
        <html>
        <head>
        <title>Adiogent</title>
        <style>
        .main_div{
        width:50%;
        margin:auto;
        padding:0px 40px;
        padding-bottom:30px;
        background-color:white;
        border-top: 6px solid #0072ff;
        }
        .logo{
        margin-top:30px;
        width:180px;
        }
        .content{
        font-size:16px;
        line-height:30px;
        }
        @media(max-width:768px){
            .main_div{
           width:auto;
           }
           }
        </style>
        </head>
      
        <body style="background-color:#F8F8F8;" >
        
        <div class="main_div" >
    <p class='content' >
    <b>Someone is Request To Publish App!</b> <br/> <br/>
    App Publish ID - ${app_publish_id} <br/> 
    App ID - ${app_id}  <br/> 
    Date & Time - ${dateAndTime} <br/> 
    App Publish Type - ${app_publish_type} <br/> <br/>
    We're always happy to help you :)<br/>
    <b>Frout Box</b></p>
        </div> 
        </body>
        </html>
        `,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );
  // =========== Our Notification ======
};
//============ APP PUBLISH MAIL =========

//======================= GET MORE SERVICE NOTIFICATION ==============================
const sendgetMoreServiceMail = async (app_id, phoneNumber, service_name) => {
  // =========== Our Notification ======
  await transporter.sendMail(
    {
      from: FROM,
      to: OUR_EMAILS,
      subject: "Adiogent - Someone is Request For More Services",
      html: `<!DOCTYPE html>
        <html>
        <head>
        <title>Adiogent</title>
        <style>
        .main_div{
        width:50%;
        margin:auto;
        padding:0px 40px;
        padding-bottom:30px;
        background-color:white;
        border-top: 6px solid #0072ff;
        }
        .logo{
        margin-top:30px;
        width:180px;
        }
        .content{
        font-size:16px;
        line-height:30px;
        }
        @media(max-width:768px){
            .main_div{
           width:auto;
           }
           }
        </style>
        </head>
      
        <body style="background-color:#F8F8F8;" >
        
        <div class="main_div" >
    <p class='content' >
    <b>Someone is Request For More Adiogents Services</b> <br/> <br/>
    App ID - ${app_id}  <br/> 
    Phone Number - ${phoneNumber} <br/> 
    Service Name - ${service_name} <br/> <br/>
    We're always happy to help you :)<br/>
    <b>Frout Box</b></p>
        </div> 
        </body>
        </html>
        `,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );
  // =========== Our Notification ======
};
//======================= GET MORE SERVICE NOTIFICATION ==============================

//======== sendBulkEnquery ==========
const sendBulkEnquery = async (
  username,
  qty,
  phone_number,
  message,
  productCode,
  order_notification_email
) => {
  await transporter.sendMail(
    {
      from: FROM,
      to: order_notification_email,
      subject: "Enquiry | You Got New Bulk Enquiry !!",
      html: `
           <!DOCTYPE html>
          <html>
          <head>
          <title>Adiogent | Simplify Ecommerce</title>
          <style>
          .main_div{
          width:50%;
          margin:auto;
          padding:0px 40px;
          padding-bottom:30px;
          background-color:white;
          border-top: 6px solid #0072ff;
          }
          .logo{
          margin-top:30px;
          width:180px;
          }
          .content{
          font-size:16px;
          line-height:30px;
          }
          @media(max-width:768px){
              .main_div{
             width:auto;
             }
             }
          </style>
          </head>
        
          <body style="background-color:#F8F8F8;" >
          
          <div class="main_div" >
      <p class='content' >
      <b>You Got a New Bulk Enquiry.</b> <br/> <br/>
      Name - ${username} <br/> 
      Product Code - ${productCode} <br/> 
      Quantity - ${qty}  <br/> 
      Phone - ${phone_number}  <br/> 
      Message - ${message} <br/> <br/>
      <br/>
      <br/>
      <b>Frout Box</b></p>
          </div> 
          </body>
          </html>`,
    },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(success)
        console.log("MAIL SENT SUCCESS");
      }
    }
  );
};
//======== sendBulkEnquery ==========

module.exports = {
  sendOurNotificationMail,
  sendAppSubmitMail,
  sendAppPublishMail,
  sendgetMoreServiceMail,
  sendOrderNotificationMail,
  sendContactEnquery,
  sendBulkEnquery,
};
