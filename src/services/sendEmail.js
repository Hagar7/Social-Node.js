import nodemailer from 'nodemailer';


export const sendEmail = async({to='',message="",subject=""})=>{
    const transport = nodemailer.createTransport({
        host: 'localhost',
        port:587,
        secure:false,
        service:'gmail',
        auth:{
            user:'hagar.14.ha@gmail.com',
            pass:"bgwasvkbzniztzzg"
        }
    })
    let info = await transport.sendMail({
        from:'hagar.14.ha@gmail.com',
        to,
        subject,
        html: message,
    })
    if(info.accepted.length){
        return true
    }else{
        return false;
    }
    }