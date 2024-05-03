import { Resend } from "resend";
import ResetPasswordEmail from "~/components/emailTemplates/resetPasswordTemplate";
import AdminRegistrationRequestEmail from "~/components/emailTemplates/adminRegistrationRequestTemplate";
import ReceiptRegisterEmail from "~/components/emailTemplates/receiptRegisterTemplate";
import AccountActivatedEmail from "~/components/emailTemplates/AccountActivatedTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ReactPasswordResetEmailType = {
  from: string;
  to: string[];
  subject: string;
  name: string;
  passwordLink: string;
};

export async function sendPasswordResetEmail(
  content: ReactPasswordResetEmailType
) {
  await resend.emails.send({
    from: content.from,
    to: content.to,
    subject: content.subject,
    react: (
      <ResetPasswordEmail
        name={content.name}
        passwdLink={content.passwordLink}
      />
    ),
  });
}

export type ReactAdminRegistrationRequestType = {
  from: string;
  to: string[];
  subject: string;
  urlLink: string;
};

export async function sendAdminRegistrationRequestEmail(
  content: ReactAdminRegistrationRequestType
) {
  await resend.emails.send({
    from: content.from,
    to: content.to,
    subject: content.subject,
    react: <AdminRegistrationRequestEmail urlLink={content.urlLink} />,
  });
}

export type ReactRegisterReceiptEmailType = {
  from: string;
  to: string[];
  subject: string;
  name: string;
};

export async function sendRegisterReceiptEmail(
  content: ReactRegisterReceiptEmailType
) {
  await resend.emails.send({
    from: content.from,
    to: content.to,
    subject: content.subject,
    react: <ReceiptRegisterEmail name={content.name} />,
  });
}

export async function sendAccountActivatedEmail(
  content: ReactPasswordResetEmailType
) {
  await resend.emails.send({
    from: content.from,
    to: content.to,
    subject: content.subject,
    react: (
      <AccountActivatedEmail
        name={content.name}
        passwdLink={content.passwordLink}
      />
    ),
  });
}
