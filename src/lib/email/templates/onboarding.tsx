/**
 * React Email template for welcoming new users.
 */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EMAIL_CONFIG } from "../config";

interface OnboardingEmailProps {
  name: string;
  company?: string;
  loginUrl: string;
}

// Visual layout for welcoming new users
export const OnboardingEmail = ({
  name,
  company,
  loginUrl = `${EMAIL_CONFIG.APP.URL}/login`,
}: OnboardingEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Welcome to {EMAIL_CONFIG.APP.NAME}, {name}!
    </Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Heading style={styles.h1}>Welcome aboard!</Heading>
        <Text style={styles.text}>Hi {name},</Text>
        <Text style={styles.text}>
          Thank you for joining {EMAIL_CONFIG.APP.NAME}
          {company ? ` at ${company}` : ""}. We're excited to help you automate
          your workflows and grow your presence online.
        </Text>
        <Section style={styles.buttonContainer}>
          <Button style={styles.button} href={loginUrl}>
            Get Started
          </Button>
        </Section>
        <Hr style={styles.hr} />
        <Text style={styles.footer}>
          If you have any questions, feel free to reply to this email. We're
          here to help!
        </Text>
        <Text style={styles.footer}>
          &copy; {new Date().getFullYear()} {EMAIL_CONFIG.APP.NAME} Inc.
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles must be inlined for email clients
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
    border: `1px solid ${EMAIL_CONFIG.COLORS.SLATE[200]}`,
    maxWidth: "580px",
  },
  h1: {
    color: EMAIL_CONFIG.COLORS.SLATE[900],
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
    backgroundColor: EMAIL_CONFIG.COLORS.PRIMARY,
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
  },
  hr: {
    borderColor: EMAIL_CONFIG.COLORS.SLATE[200],
    margin: "20px 0",
  },
  footer: {
    color: EMAIL_CONFIG.COLORS.SLATE[600],
    fontSize: "14px",
    lineHeight: "20px",
    textAlign: "center" as const,
  },
};
