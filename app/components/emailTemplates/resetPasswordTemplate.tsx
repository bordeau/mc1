import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { SVGLogo } from "~/components/nav";
import { SYSTEM_TITLE } from "~/components/utils";

interface ResetPasswordEmailProps {
  name: string;
  passwdLink: string;
}

export const ResetPasswordEmail = ({
  name,
  passwdLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        You updated the password for your {SYSTEM_TITLE} account
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <SVGLogo /> {SYSTEM_TITLE}
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              You requested to change your password for your {SYSTEM_TITLE}{" "}
              account. If this was you, then click the link to{" "}
              <Link href={passwdLink} style={link}>
                reset your account password
              </Link>{" "}
            </Text>
            <Text style={paragraph}>
              However if you did NOT perform this password change, please
              consider changing your password using the link above.
            </Text>
            <Text style={paragraph}>
              Remember to use a password that is both strong and unique to your
              {SYSTEM_TITLE} account.
            </Text>
            <Text style={paragraph}>
              Still have questions? Please contact{" "}
              <Link href="#" style={link}>
                {SYSTEM_TITLE} Support
              </Link>
            </Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              {SYSTEM_TITLE} Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Text style={{ textAlign: "center", color: "#706a7b" }}>
              © 2024 {SYSTEM_TITLE}, All Rights Reserved <br />
              somewhere in Florida USA
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  id: "alanturing",
  name: "Alan Turing",
  updatedDate: new Date("June 23, 2022 4:06:00 pm UTC"),
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
};

const footer = {
  maxWidth: "580px",
  margin: "0 auto",
};

const content = {
  padding: "5px 20px 10px 20px",
};

const logo = {
  display: "flex",
  justifyContent: "center",
  alingItems: "center",
  padding: 30,
};

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid rgb(145,71,255)",
  width: "102px",
};

const link = {
  textDecoration: "underline",
};
