import { Resend } from "resend";
import { json } from "@remix-run/node";

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailType = {
  from: string;
  to: string[];
  subject: string;
  html: string;
};

export async function sendEmail(content: EmailType) {
  console.log("\n\n sendemail content:  " + JSON.stringify(content));

  /*
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "charlesbordeaux@gmail.com",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });
*/
  const { data, error } = await resend.emails.send({
    from: content.from,
    to: content.to,
    subject: content.subject,
    html: content.html,
  });

  // console.log("\n\n sendmail data: " + JSON.stringify(data));
  // console.log("\n\n sendmail error: " + JSON.stringify(error));

  if (error) return json({ error });
  else return json(data);
}
