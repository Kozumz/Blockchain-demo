import { useState, useEffect } from 'react';
import {
    Paper,
    Stack,
    Title,
    Text,
    Group,
    Badge,
    Button,
    Card,
    Loader,
    Alert,
    Accordion,
    Code,
    Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconX,
    IconAlertTriangle,
    IconShieldCheck,
    IconRefresh,
    IconChevronDown,
} from '@tabler/icons-react';
import { blockchainApi } from '../services/api';
import type { Block, VerificationResult } from '../services/api';

export default function BlockchainView() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

    const fetchBlocks = async () => {
        try {
            setLoading(true);
            const data = await blockchainApi.getAllBlocks();
            setBlocks(data);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudieron cargar los bloques',
                color: 'red',
                icon: <IconX />,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setVerifying(true);
            const result = await blockchainApi.verifyChain();
            setVerificationResult(result);

            if (result.valid) {
                notifications.show({
                    title: '✓ Blockchain Válida',
                    message: 'Todos los bloques están íntegros',
                    color: 'green',
                    icon: <IconCheck />,
                });
            } else {
                notifications.show({
                    title: '⚠ Blockchain Comprometida',
                    message: `Se encontraron ${result.errors.length} error(es)`,
                    color: 'red',
                    icon: <IconAlertTriangle />,
                });
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo verificar la blockchain',
                color: 'red',
                icon: <IconX />,
            });
        } finally {
            setVerifying(false);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, []);

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
                    <Group justify="space-between" mb="md">
                        <div>
                            <Title order={2} style={{ color: '#fff' }}>
                                Estado de la Blockchain
                            </Title>
                            <Text c="dimmed" size="sm">
                                Total de bloques: {blocks.length}
                            </Text>
                        </div>
                        <Group>
                            <Button
                                leftSection={<IconRefresh size={18} />}
                                variant="light"
                                color="orange"
                                onClick={fetchBlocks}
                                loading={loading}
                            >
                                Actualizar
                            </Button>
                            <Button
                                leftSection={<IconShieldCheck size={18} />}
                                onClick={handleVerify}
                                loading={verifying}
                                style={{
                                    background: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',
                                }}
                            >
                                Verificar Integridad
                            </Button>
                        </Group>
                    </Group>

                    {verificationResult && (
                        <Alert
                            icon={verificationResult.valid ? <IconCheck /> : <IconAlertTriangle />}
                            title={verificationResult.valid ? 'Blockchain Válida' : 'Blockchain Comprometida'}
                            color={verificationResult.valid ? 'green' : 'red'}
                            mb="md"
                            styles={{
                                root: {
                                    background: verificationResult.valid
                                        ? 'rgba(64, 192, 87, 0.1)'
                                        : 'rgba(250, 82, 82, 0.1)',
                                    border: `1px solid ${verificationResult.valid ? 'rgba(64, 192, 87, 0.3)' : 'rgba(250, 82, 82, 0.3)'}`,
                                },
                            }}
                        >
                            {verificationResult.valid ? (
                                <Text size="sm">Todos los bloques han sido verificados y son válidos.</Text>
                            ) : (
                                <Stack gap="xs">
                                    <Text size="sm" fw={500}>
                                        Se detectaron los siguientes errores:
                                    </Text>
                                    {verificationResult.errors.map((error, index) => (
                                        <Text key={index} size="sm" c="red">
                                            • {error}
                                        </Text>
                                    ))}
                                </Stack>
                            )}
                        </Alert>
                    )}
                </Paper>

                {loading ? (
                    <Group justify="center" py="xl">
                        <Loader color="orange" size="lg" />
                    </Group>
                ) : (
                    <Accordion
                        variant="separated"
                        radius="lg"
                        chevron={<IconChevronDown size={20} />}
                        styles={{
                            item: {
                                background: 'rgba(26, 29, 53, 0.6)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 165, 0, 0.2)',
                                marginBottom: '12px',
                                '&[data-active]': {
                                    borderColor: 'rgba(255, 165, 0, 0.5)',
                                },
                            },
                            control: {
                                '&:hover': {
                                    background: 'rgba(255, 165, 0, 0.05)',
                                },
                            },
                        }}
                    >
                        {blocks.map((block, index) => (
                            <Accordion.Item key={block.id} value={`block-${block.id}`}>
                                <Accordion.Control>
                                    <Group justify="space-between">
                                        <Group>
                                            <Badge
                                                color={block.id === 1 ? 'blue' : 'orange'}
                                                variant="light"
                                                size="lg"
                                            >
                                                {block.id === 1 ? 'GÉNESIS' : `Bloque #${block.id}`}
                                            </Badge>
                                            <Text c="white" fw={500}>
                                                {block.data}
                                            </Text>
                                        </Group>
                                        <Text c="dimmed" size="sm">
                                            {new Date(block.timestamp).toLocaleString('es-ES')}
                                        </Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Stack gap="md">
                                        <div>
                                            <Text size="sm" c="dimmed" mb={4}>
                                                Hash Actual
                                            </Text>
                                            <Code
                                                block
                                                style={{
                                                    background: 'rgba(10, 14, 39, 0.6)',
                                                    color: '#4ade80',
                                                    fontSize: '12px',
                                                    padding: '8px',
                                                }}
                                            >
                                                {block.currentHash}
                                            </Code>
                                        </div>

                                        <div>
                                            <Text size="sm" c="dimmed" mb={4}>
                                                Hash Anterior
                                            </Text>
                                            <Code
                                                block
                                                style={{
                                                    background: 'rgba(10, 14, 39, 0.6)',
                                                    color: '#fbbf24',
                                                    fontSize: '12px',
                                                    padding: '8px',
                                                }}
                                            >
                                                {block.previousHash}
                                            </Code>
                                        </div>

                                        <Divider color="rgba(255, 165, 0, 0.2)" />

                                        <Group grow>
                                            <Card
                                                p="sm"
                                                radius="md"
                                                style={{
                                                    background: 'rgba(10, 14, 39, 0.4)',
                                                    border: '1px solid rgba(255, 165, 0, 0.1)',
                                                }}
                                            >
                                                <Text size="xs" c="dimmed">
                                                    ID
                                                </Text>
                                                <Text fw={500} c="white">
                                                    {block.id}
                                                </Text>
                                            </Card>
                                            <Card
                                                p="sm"
                                                radius="md"
                                                style={{
                                                    background: 'rgba(10, 14, 39, 0.4)',
                                                    border: '1px solid rgba(255, 165, 0, 0.1)',
                                                }}
                                            >
                                                <Text size="xs" c="dimmed">
                                                    Posición
                                                </Text>
                                                <Text fw={500} c="white">
                                                    {index + 1} de {blocks.length}
                                                </Text>
                                            </Card>
                                        </Group>
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </Stack>
        </div>
    );
}
