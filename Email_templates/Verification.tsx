import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  interface RaycastMagicLinkEmailProps {
    magicLink?: string;
  }
  
  export const VerifyEmail = ({
    magicLink,
  }: RaycastMagicLinkEmailProps) => (
    <Html>
      <Head />
      <Preview>Verifica tu email</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`https://i.imgur.com/bpz1bHK.png`} // Relative path to the logo
            width={50}
            height={50}
            alt='ClassMatch'
          />
          <Heading style={heading}>Tu link de ingreso</Heading>
          <Section style={body}>
            <Text style={paragraph}>
            <Link style={link} href={`https://classmatch.site/verificaremail/${magicLink}`}
                {' '}
                👉 Haz click aquí 👈
              </Link>
            </Text>
            <Text style={paragraph}>
              Si no pediste esto, por favor ignora este email.
            </Text>
          </Section>
          <Text style={paragraph}>
            Gracias,
            <br />- Equipo de Classmatch
          </Text>
          <Hr style={hr} />
          <Img
            src={`https://i.imgur.com/bpz1bHK.png`} // Relative path to the logo
            width={32}
            height={32}
            alt='ClassMatch Logo'
            style={{
              WebkitFilter: 'grayscale(100%)',
              filter: 'grayscale(100%)',
              margin: '20px 0',
            }}
          />
          <Text style={footer}>
            Si tienes alguna pregunta, contáctanos en{' '}
            <Link href='mailto:team@classmatch.site'>
              support@classmatch.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
  VerifyEmail.PreviewProps = {
    magicLink: 'https://classmatch.site/verification/test-token', // Local testing
  } as RaycastMagicLinkEmailProps;
  
  const main = {
    backgroundColor: '#fff',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 25px 48px',
    backgroundImage: 'url("https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-3883.jpg?w=360")', // Background image URL
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat', // Prevent repeating
    backgroundSize: 'cover', // Stretch the image to cover the container
    backgroundColor: '#ffffff', // Fallback background color
    '@media (maxWidth: 600px)': {
      padding: '10px 15px 24px',
    },
  };
  
  const heading = {
    color: '#104d5c',
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '48px',
  };
  
  const body = {
    margin: '24px 0',
  };
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
  };
  
  const link = {
    color: '#104d5c',
  };
  
  const hr = {
    borderColor: '#dddddd',
    marginTop: '48px',
  };
  
  const footer = {
    color: '#ffffff', // White color for the text
    fontSize: '12px',
    marginLeft: '4px',
  };
