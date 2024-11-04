const nodemailer = require("nodemailer");
exports.sendMail = async function(options){
    const transporter = nodemailer.createTransport({
        host : "live.smtp.mailtrap.io",
        port : 587,
        auth : {
            user : "api",
            pass : "b0ddcdae95629627fc09b980103c7a15"
        }
    });
    const message = await transporter.sendMail({
        from : "reset@hayatsoftwares.com",
        to : options.email,
        template_uuid: "0c4f3093-55c2-4752-b6f9-4db380eb02fe",
        template_variables: {
            "user_email": options.email,
            "pass_reset_link": options.message
        }
    })
    await transporter.sendMail(message);
}