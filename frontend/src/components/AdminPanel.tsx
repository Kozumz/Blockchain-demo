import { useState, useEffect } from 'react';
import {
    Paper,
    Stack,
    Title,
    Text,
    Group,
    Button,
    Select,
    TextInput,
    Card,
    Loader,
    Alert,
    Badge,
    Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconX,
    IconEdit,
    IconShieldCheck,
    IconAlertTriangle,
} from '@tabler/icons-react';
import { blockchainApi } from '../services/api';
import type { Block } from '../services/api';

export default function AdminPanel() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [newData, setNewData] = useState('');
    const [loading, setLoading] = useState(true);
    const [modifying, setModifying] = useState(false);

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

    useEffect(() => {
        fetchBlocks();
    }, []);

    const selectedBlock = blocks.find((b) => b.id.toString() === selectedBlockId);

    const handleModify = async () => {
        if (!selectedBlockId || !newData.trim()) {
            notifications.show({
                title: 'Error',
                message: 'Selecciona un bloque e ingresa nuevos datos',
                color: 'red',
                icon: <IconX />,
            });
            return;
        }

        try {
            setModifying(true);
            await blockchainApi.modifyBlock(parseInt(selectedBlockId), newData);
            notifications.show({
                title: '⚠ Bloque Modificado',
                message: 'El bloque ha sido alterado sin recalcular el hash',
                color: 'yellow',
                icon: <IconAlertTriangle />,
            });
            setNewData('');
            setSelectedBlockId(null);
            await fetchBlocks();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo modificar el bloque',
                color: 'red',
                icon: <IconX />,
            });
        } finally {
            setModifying(false);
        }
    };

    const handleVerify = async () => {
        try {
            const result = await blockchainApi.verifyChain();

            if (result.valid) {
                notifications.show({
                    title: '✓ Blockchain Válida',
                    message: 'Todos los bloques están íntegros',
                    color: 'green',
                    icon: <IconCheck />,
                    autoClose: 5000,
                });
            } else {
                notifications.show({
                    title: '⚠ Blockchain Comprometida',
                    message: `Se encontraron ${result.errors.length} error(es). Revisa la pestaña Blockchain para más detalles.`,
                    color: 'red',
                    icon: <IconAlertTriangle />,
                    autoClose: 7000,
                });
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'No se pudo verificar la blockchain',
                color: 'red',
                icon: <IconX />,
            });
        }
    };

    return (
        <div className="fade-in">
            <Stack gap="xl">
                <Alert
                    icon={<IconAlertTriangle />}
                    title="Panel de Administrador - Demo"
                    color="yellow"
                    styles={{
                        root: {
                            background: 'rgba(250, 176, 5, 0.1)',
                            border: '1px solid rgba(250, 176, 5, 0.3)',
                        },
                    }}
                >
                    <Text size="sm">
                        Este panel permite modificar bloques <strong>sin recalcular el hash</strong>, lo que
                        demuestra cómo se detecta la manipulación en una blockchain. En un sistema real, esto
                        requeriría autenticación y permisos especiales.
                    </Text>
                </Alert>

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
                            <IconEdit size={32} color="#ffa500" />
                            <Title order={2} style={{ color: '#fff' }}>
                                Modificar Bloque
                            </Title>
                        </Group>
                        <Text c="dimmed" size="sm">
                            Selecciona un bloque y modifica sus datos para demostrar la detección de manipulación
                        </Text>

                        {loading ? (
                            <Group justify="center" py="xl">
                                <Loader color="orange" />
                            </Group>
                        ) : (
                            <Stack gap="md">
                                <Select
                                    label="Seleccionar Bloque"
                                    placeholder="Elige un bloque para modificar"
                                    value={selectedBlockId}
                                    onChange={setSelectedBlockId}
                                    data={blocks
                                        .filter((b) => b.id !== 1) // Don't allow modifying genesis block
                                        .map((block) => ({
                                            value: block.id.toString(),
                                            label: `Bloque #${block.id} - ${block.data}`,
                                        }))}
                                    searchable
                                    clearable
                                    nothingFoundMessage="No hay bloques disponibles"
                                    comboboxProps={{
                                        shadow: 'md',
                                        transitionProps: { transition: 'pop', duration: 200 }
                                    }}
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
                                        dropdown: {
                                            background: 'rgba(26, 29, 53, 0.95)',
                                            border: '1px solid rgba(255, 165, 0, 0.3)',
                                            backdropFilter: 'blur(10px)',
                                        },
                                        option: {
                                            color: '#fff',
                                            '&[data-combobox-selected]': {
                                                background: 'rgba(255, 165, 0, 0.3)',
                                            },
                                            '&:hover': {
                                                background: 'rgba(255, 165, 0, 0.15)',
                                            },
                                        },
                                    }}
                                />


                                {selectedBlock && (
                                    <Card
                                        p="md"
                                        radius="md"
                                        style={{
                                            background: 'rgba(10, 14, 39, 0.4)',
                                            border: '1px solid rgba(255, 165, 0, 0.2)',
                                        }}
                                    >
                                        <Stack gap="xs">
                                            <Group justify="space-between">
                                                <Text size="sm" c="dimmed">
                                                    Datos Actuales:
                                                </Text>
                                                <Badge color="orange" variant="light">
                                                    Bloque #{selectedBlock.id}
                                                </Badge>
                                            </Group>
                                            <Text c="white" fw={500}>
                                                {selectedBlock.data}
                                            </Text>
                                            <Divider color="rgba(255, 165, 0, 0.2)" my="xs" />
                                            <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                                                Hash: {selectedBlock.currentHash.substring(0, 32)}...
                                            </Text>
                                        </Stack>
                                    </Card>
                                )}

                                <TextInput
                                    label="Nuevos Datos"
                                    placeholder="Ingresa los nuevos datos del bloque"
                                    value={newData}
                                    onChange={(e) => setNewData(e.currentTarget.value)}
                                    disabled={!selectedBlockId}
                                    styles={{
                                        input: {
                                            background: 'rgba(10, 14, 39, 0.6)',
                                            border: '1px solid rgba(255, 165, 0, 0.3)',
                                            color: '#fff',
                                            '&:focus': {
                                                borderColor: '#ffa500',
                                            },
                                            '&:disabled': {
                                                background: 'rgba(10, 14, 39, 0.3)',
                                                opacity: 0.5,
                                            },
                                        },
                                        label: {
                                            color: '#fff',
                                            fontWeight: 500,
                                        },
                                    }}
                                />

                                <Group grow>
                                    <Button
                                        leftSection={<IconEdit size={18} />}
                                        onClick={handleModify}
                                        loading={modifying}
                                        disabled={!selectedBlockId || !newData.trim()}
                                        color="yellow"
                                        variant="light"
                                    >
                                        Modificar Bloque
                                    </Button>
                                    <Button
                                        leftSection={<IconShieldCheck size={18} />}
                                        onClick={handleVerify}
                                        style={{
                                            background: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)',
                                        }}
                                    >
                                        Verificar Blockchain
                                    </Button>
                                </Group>
                            </Stack>
                        )}
                    </Stack>
                </Paper>

                <Paper
                    p="xl"
                    radius="lg"
                    style={{
                        background: 'rgba(26, 29, 53, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(64, 192, 87, 0.2)',
                        boxShadow: '0 8px 32px rgba(64, 192, 87, 0.1)',
                    }}
                >
                    <Stack gap="md">
                        <Group>
                            <IconShieldCheck size={28} color="#40c057" />
                            <Title order={3} style={{ color: '#fff' }}>
                                Cómo Funciona
                            </Title>
                        </Group>
                        <Stack gap="sm">
                            <Text c="dimmed" size="sm">
                                <strong style={{ color: '#ffa500' }}>1. Modificación:</strong> Al modificar un
                                bloque, sus datos cambian pero el hash NO se recalcula.
                            </Text>
                            <Text c="dimmed" size="sm">
                                <strong style={{ color: '#ffa500' }}>2. Detección:</strong> La verificación
                                recalcula el hash y lo compara con el almacenado, detectando la manipulación.
                            </Text>
                            <Text c="dimmed" size="sm">
                                <strong style={{ color: '#ffa500' }}>3. Cadena Rota:</strong> Los bloques
                                posteriores también fallarán la verificación porque su previousHash ya no coincide.
                            </Text>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </div>
    );
}
