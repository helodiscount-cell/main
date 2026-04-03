/**
 * React Email template for sending billing invoices.
 */
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EMAIL_CONFIG } from "../config";

interface InvoiceEmailProps {
  name: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  paymentUrl: string;
}

// Visual invoice summary layout
export const InvoiceEmail = ({
  name,
  invoiceNumber,
  amount,
  currency,
  dueDate,
  paymentUrl,
}: InvoiceEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Invoice {invoiceNumber} from {EMAIL_CONFIG.APP.NAME}
    </Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Heading style={styles.h1}>New Invoice Prepared</Heading>
        <Text style={styles.text}>Hi {name},</Text>
        <Text style={styles.text}>
          Thank you for being a valued {EMAIL_CONFIG.APP.NAME} customer. A new
          invoice is ready for payment.
        </Text>
        <Section style={styles.summaryBox}>
          <Row>
            <Column>
              <Text style={styles.summaryLabel}>Invoice Number</Text>
              <Text style={styles.summaryValue}>{invoiceNumber}</Text>
            </Column>
            <Column>
              <Text style={styles.summaryLabel}>Due Date</Text>
              <Text style={styles.summaryValue}>{dueDate}</Text>
            </Column>
          </Row>
          <Hr style={styles.hr} />
          <Row>
            <Column>
              <Text style={styles.totalLabel}>Total Due</Text>
            </Column>
            <Column style={{ textAlign: "right" }}>
              <Text style={styles.totalValue}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency,
                }).format(amount)}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section style={styles.buttonContainer}>
          <Button style={styles.button} href={paymentUrl}>
            Pay Invoice Online
          </Button>
        </Section>
        <Hr style={styles.hr} />
        <Text style={styles.footer}>
          This is an automated billing message. Please do not reply directly to
          this email.
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
    border: `1px solid ${EMAIL_CONFIG.COLORS.SLATE[200]}`,
    maxWidth: "580px",
  },
  h1: {
    color: EMAIL_CONFIG.COLORS.SLATE[900],
    fontSize: "24px",
    textAlign: "center" as const,
  },
  text: {
    color: EMAIL_CONFIG.COLORS.SLATE[600],
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const,
  },
  summaryBox: {
    padding: "24px",
    backgroundColor: EMAIL_CONFIG.COLORS.SLATE[50],
    borderRadius: "8px",
    margin: "30px 0",
  },
  summaryLabel: {
    color: EMAIL_CONFIG.COLORS.SLATE[600],
    fontSize: "12px",
    textTransform: "uppercase" as const,
    fontWeight: "bold",
    margin: 0,
  },
  summaryValue: {
    color: EMAIL_CONFIG.COLORS.SLATE[900],
    fontSize: "14px",
    margin: "4px 0 0",
  },
  totalLabel: {
    color: EMAIL_CONFIG.COLORS.SLATE[900],
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
  },
  totalValue: {
    color: EMAIL_CONFIG.COLORS.PRIMARY,
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
  },
  hr: {
    borderColor: EMAIL_CONFIG.COLORS.SLATE[200],
    margin: "16px 0",
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
  footer: {
    color: EMAIL_CONFIG.COLORS.SLATE[600],
    fontSize: "12px",
    textAlign: "center" as const,
  },
};
