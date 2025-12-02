import { useState, useEffect } from 'react';
import {
    Paper,
    TextInput,
    Button,
    Stack,
    Title,
    Text,
    Group,
    Badge,
    Timeline,
    Loader,
    Card,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCoin, IconCheck, IconX, IconClock } from '@tabler/icons-react';
import { blockchainApi } from '../services/api';
import type { Block } from '../services/api';

export default function TransactionPanel() {
    const [transactionData, setTransactionData] = useState('');
    const [loading, setLoading] = useState(false);
    const [recentTransactions, setRecentTransactions] = useState<Block[]>([]);
    const [fetchingTransactions, setFetchingTransactions] = useState(true);

    const fetchRecentTransactions = async () => {
        try {
            setFetchingTransactions(true);
            const blocks = await blockchainApi.getAllBlocks();
            // Get last 5 transactions (excluding genesis block)
            const recent = blocks.filter(b => b.id !== 1).slice(-5).reverse();
            setRecentTransactions(recent);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setFetchingTransactions(false);
        }
    };

    useEffect(() => {
        fetchRecentTransactions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionData.trim()) {
            notifications.show({
                title: 'Error',
                message: 'Por favor ingresa datos para la transacción',
                color: 'red',
                icon: <IconX />,
            });
            return;
        }

        setLoading(true);
        try {
            const newBlock = await blockchainApi.addBlock(transactionData);
            notifications.show({
                title: '¡Transacción exitosa!',
                message: `Bloque #${newBlock.id} agregado a la blockchain`,
                color: 'green',
                icon: <IconCheck />,
            });
            setTransactionData('');
            await fetchRecentTransactions();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo procesar la transacción',
                color: 'red',
                icon: <IconX />,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <Stack gap="xl">
                <Paper
                    p="xl"
                    radius="lg"
                    style={{
                        background: 'rgba(26, 29, 53, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 165, 0, 0.2)',
                        boxShadow: '0 8px 32px rgba(255, 165, 0, 0.1)',
                    }}
                >
                    <Stack gap="md">
                        <Group>
                            <IconCoin size={32} color="#ffa500" />
                            <Title order={2} style={{ color: '#fff' }}>
                                Nueva Transacción LEOCOIN
                            </Title>
                        </Group>
                        <Text c="dimmed" size="sm">
                            Ingresa los detalles de tu transacción para agregarla a la blockchain
                        </Text>

                        <form onSubmit={handleSubmit}>
                            <Stack gap="md">
                                <TextInput
                                    label="Datos de la Transacción"
                                    placeholder="Ej: Transferir 100 LEOCOIN a Usuario123"
                                    value={transactionData}
                                    onChange={(e) => setTransactionData(e.currentTarget.value)}
                                    size="md"
                                    styles={{
                                        input: {
                                            background: 'rgba(10, 14, 39, 0.6)',
                                            border: '1px solid rgba(255, 165, 0, 0.3)',
                                            color: '#fff',
                                            '&:focus': {
                                                borderColor: '#ffa500',
                                            },
                                        },
                                        label: {
                                            color: '#fff',
                                            fontWeight: 500,
                                        },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    size="md"
                                    loading={loading}
                                    leftSection={<IconCoin size={20} />}
                                    style={{
                                        background: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    styles={{
                                        root: {
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 24px rgba(255, 165, 0, 0.4)',
                                            },
                                        },
                                    }}
                                >
                                    Enviar Transacción
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>

                <Paper
                    p="xl"
                    radius="lg"
                    style={{
                        background: 'rgba(26, 29, 53, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 165, 0, 0.2)',
                        boxShadow: '0 8px 32px rgba(255, 165, 0, 0.1)',
                    }}
                >
                    <Stack gap="md">
                        <Title order={3} style={{ color: '#fff' }}>
                            Transacciones Recientes
                        </Title>

                        {fetchingTransactions ? (
                            <Group justify="center" py="xl">
                                <Loader color="orange" />
                            </Group>
                        ) : recentTransactions.length === 0 ? (
                            <Card
                                p="xl"
                                radius="md"
                                style={{
                                    background: 'rgba(10, 14, 39, 0.4)',
                                    border: '1px solid rgba(255, 165, 0, 0.1)',
                                }}
                            >
                                <Text c="dimmed" ta="center">
                                    No hay transacciones recientes
                                </Text>
                            </Card>
                        ) : (
                            <Timeline
                                active={recentTransactions.length}
                                bulletSize={24}
                                lineWidth={2}
                                color="orange"
                            >
                                {recentTransactions.map((block) => (
                                    <Timeline.Item
                                        key={block.id}
                                        bullet={<IconClock size={12} />}
                                        title={
                                            <Group gap="xs">
                                                <Text fw={500} c="white">
                                                    Bloque #{block.id}
                                                </Text>
                                                <Badge color="orange" variant="light" size="sm">
                                                    Confirmado
                                                </Badge>
                                            </Group>
                                        }
                                    >
                                        <Text c="dimmed" size="sm" mt={4}>
                                            {block.data}
                                        </Text>
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {new Date(block.timestamp).toLocaleString('es-ES')}
                                        </Text>
                                        <Text
                                            size="xs"
                                            c="dimmed"
                                            mt={4}
                                            style={{
                                                fontFamily: 'monospace',
                                                wordBreak: 'break-all',
                                            }}
                                        >
                                            Hash: {block.currentHash.substring(0, 16)}...
                                        </Text>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </div>
    );
}
