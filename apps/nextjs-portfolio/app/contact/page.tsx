import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | WiSiHe',
  description:
    'Get in touch with Henrik Sissener for collaboration opportunities, questions about projects, or just to say hello.',
  alternates: {
    canonical: 'https://www.wisihe.no/contact',
  },
  openGraph: {
    title: 'Contact | WiSiHe',
    description:
      'Get in touch with Henrik Sissener for collaboration opportunities, questions about projects, or just to say hello.',
    type: 'website',
    url: 'https://www.wisihe.no/contact',
    siteName: 'WiSiHe',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Contact | WiSiHe',
    description:
      'Get in touch with Henrik Sissener for collaboration opportunities, questions about projects, or just to say hello.',
  },
};

export default function ContactPage() {
  return (
    <main>
      <h1>Contact</h1>
    </main>
  );
}
