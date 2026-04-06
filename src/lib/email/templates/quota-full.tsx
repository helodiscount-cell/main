import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface QuotaFullEmailProps {
  name: string;
  upgradeUrl: string;
}

export const QuotaFullEmail = ({
  name = "there",
  upgradeUrl,
}: QuotaFullEmailProps) => (
  <Html>
    <Head />
    <Preview>Your credit limit has been reached</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Quota Exceeded</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          This is an automated alert to inform you that you have reached your
          monthly credit limit for Instagram automation.
        </Text>
        <Section style={alertSection}>
          <Text style={alertText}>
            Further automations will be paused until your next billing cycle OR
            until you upgrade to a higher plan.
          </Text>
        </Section>
        <Section style={btnContainer}>
          <Button style={button} href={upgradeUrl}>
            Upgrade Plan
          </Button>
        </Section>
        <Text style={text}>
          If you have any questions, please contact our support team.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          DMBroo Automation Team • 123 Automation Way, Cloud City
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
};

const alertSection = {
  padding: "16px 48px",
  backgroundColor: "#fff5f5",
  borderLeft: "4px solid #f56565",
  margin: "24px 0",
};

const alertText = {
  color: "#c53030",
  fontSize: "15px",
  margin: "0",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5f51e8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  margin: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
  textAlign: "center" as const,
};
