import nodemailer from "nodemailer";

const sendEmail = async (to,subject,htmlData)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })

    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to,
        subject,
        html:htmlData
    })
}
export default sendEmail;