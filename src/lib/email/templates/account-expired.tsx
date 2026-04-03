/**
 * React Email template for alerting users about subscription expiry.
 */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EMAIL_CONFIG } from "../config";

interface AccountExpiredEmailProps {
  name: string;
  expirationDate: string;
  reactivateUrl: string;
}

// Alert visual for account expiration
export const AccountExpiredEmail = ({
  name,
  expirationDate,
  reactivateUrl,
}: AccountExpiredEmailProps) => (
  <Html>
    <Head />
    <Preview>Your {EMAIL_CONFIG.APP.NAME} subscription has expired</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Heading style={styles.h1}>Account Access Expired</Heading>
        <Text style={styles.text}>Hi {name},</Text>
        <Text style={styles.text}>
          We wanted to let you know that your subscription to{" "}
          {EMAIL_CONFIG.APP.NAME}
          expired on <strong>{expirationDate}</strong>.
        </Text>
        <Text style={styles.text}>
          To keep enjoying our features, please reactivate your account by
          clicking the button below.
        </Text>
        <Section style={styles.buttonContainer}>
          <Button style={styles.button} href={reactivateUrl}>
            Reactivate Now
          </Button>
        </Section>
        <Text style={styles.footerNote}>
          If you believe this is a mistake, please reach out to our support
          team.
        </Text>
      </Container>
    </Body>
  </Html>
);

const styles = {
  main: {
    backgroundColor: EMAIL_CONFIG.COLORS.SLATE[50],
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  },
  container: {
    margin: "0 auto",
    padding: "40px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    borderTop: `4px solid ${EMAIL_CONFIG.COLORS.DANGER}`,
    borderLeft: `1px solid ${EMAIL_CONFIG.COLORS.SLATE[200]}`,
    borderRight: `1px solid ${EMAIL_CONFIG.COLORS.SLATE[200]}`,
    borderBottom: `1px solid ${EMAIL_CONFIG.COLORS.SLATE[200]}`,
    maxWidth: "580px",
  },
  h1: {
    color: EMAIL_CONFIG.COLORS.DANGER,
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
  },
  text: {
    color: EMAIL_CONFIG.COLORS.SLATE[600],
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const,
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "34px 0",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: EMAIL_CONFIG.COLORS.DANGER,
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
  },
  footerNote: {
    color: EMAIL_CONFIG.COLORS.SLATE[600],
    fontSize: "14px",
    lineHeight: "20px",
    textAlign: "center" as const,
    marginTop: "30px",
    fontStyle: "italic",
  },
};
