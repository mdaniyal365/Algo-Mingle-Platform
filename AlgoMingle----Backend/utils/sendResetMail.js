const { MailtrapClient } = require("mailtrap");
exports.sendResetMailWithTemplate = async function({to , resetLink}){

    const TOKEN = "b0ddcdae95629627fc09b980103c7a15";
    const ENDPOINT = "https://send.api.mailtrap.io/";
    const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
    const sender = {
        email: "reset@hayatsoftwares.com",
        name: "Reset Password",
    };
    const recipients = [
     {
    email: to,
    }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "0c4f3093-55c2-4752-b6f9-4db380eb02fe",
    template_variables: {
      "user_email": to,
      "pass_reset_link": resetLink
    }
  })
  .then(console.log, console.error);
}
exports.sendNewRegisterMail = async function({email , name }){
    

const TOKEN = "b0ddcdae95629627fc09b980103c7a15";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "welcome@hayatsoftwares.com",
  name: "Welcome to AlgoMingle.com",
};
const recipients = [
  {
    email,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    template_uuid: "16de3d6f-4453-4509-b4e3-383b241b6dbd",
    template_variables: {
      "user_name": name,
      "next_step_link": "http://localhost:5173",
      "get_started_link": "Test_Get_started_link",
      "onboarding_video_link": "Test_Onboarding_video_link"
    }
  })
  .then(console.log, console.error);
}