import { useState } from 'react';
import { MantineProvider, AppShell, Container, Tabs, rem, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { IconCoin, IconList, IconShieldCheck } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

import TransactionPanel from './components/TransactionPanel';
import BlockchainView from './components/BlockchainView';
import AdminPanel from './components/AdminPanel';

function App() {
  const [activeTab, setActiveTab] = useState<string | null>('transactions');
  const iconStyle = { width: rem(20), height: rem(20) };

  return (
    <MantineProvider
      theme={{
        primaryColor: 'orange',
        colors: {
          dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5c5f66',
            '#373A40',
            '#2C2E33',
            '#25262b',
            '#1A1B1E',
            '#141517',
            '#101113',
          ],
        },
      }}
      defaultColorScheme="dark"
    >
      <Notifications position="top-right" />
      <AppShell
        header={{ height: 70 }}
        footer={{ height: 60 }}
        padding="md"
        styles={{
          main: {
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)',
            minHeight: '100vh',
          },
        }}
      >
        <AppShell.Header
          style={{
            background: 'rgba(26, 29, 53, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 165, 0, 0.2)',
          }}
        >
          <Container size="xl" h="100%" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconCoin size={36} color="#ffa500" stroke={2} />
              <h1
                style={{
                  margin: 0,
                  fontSize: '28px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '1px',
                }}
              >
                LEOCOIN
              </h1>
              <span
                style={{
                  fontSize: '14px',
                  color: '#888',
                  marginLeft: '8px',
                  fontWeight: 500,
                }}
              >
                Blockchain Demo
              </span>
            </div>
          </Container>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="xl" py="xl">
            <Tabs value={activeTab} onChange={setActiveTab} variant="pills">
              <Tabs.List
                style={{
                  background: 'rgba(26, 29, 53, 0.6)',
                  backdropFilter: 'blur(10px)',
                  padding: '8px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 165, 0, 0.1)',
                }}
              >
                <Tabs.Tab value="transactions" leftSection={<IconCoin style={iconStyle} />}>
                  Transacciones
                </Tabs.Tab>
                <Tabs.Tab value="blockchain" leftSection={<IconList style={iconStyle} />}>
                  Blockchain
                </Tabs.Tab>
                <Tabs.Tab value="admin" leftSection={<IconShieldCheck style={iconStyle} />}>
                  Admin Panel
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="transactions">
                <TransactionPanel />
              </Tabs.Panel>

              <Tabs.Panel value="blockchain">
                <BlockchainView />
              </Tabs.Panel>

              <Tabs.Panel value="admin">
                <AdminPanel />
              </Tabs.Panel>
            </Tabs>
          </Container>
        </AppShell.Main>

        <AppShell.Footer
          style={{
            background: 'rgba(26, 29, 53, 0.8)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 165, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            size="sm"
            c="dimmed"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#888' }}>demo</span>
            <span style={{ color: '#555' }}>•</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
              }}
            >
              Carlos Josue Moreno Mireles
            </span>
          </Text>
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
