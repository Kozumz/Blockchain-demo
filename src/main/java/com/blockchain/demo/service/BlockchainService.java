package com.blockchain.demo.service;

import com.blockchain.demo.dto.BlockchainVerificationResult;
import com.blockchain.demo.entity.Block;
import com.blockchain.demo.repository.BlockRepository;
import com.blockchain.demo.util.HashUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

// Servicio para operaciones de blockchain: creación, consulta, modificación y verificación de integridad
@Service
public class BlockchainService {

    private final BlockRepository blockRepository;

    public BlockchainService(BlockRepository blockRepository) {
        this.blockRepository = blockRepository;
    }

    // Inicializa la blockchain con un bloque génesis si la cadena está vacía
    // (previousHash = "0")
    @PostConstruct
    public void initializeGenesisBlock() {
        if (blockRepository.count() == 0) {
            Block genesis = new Block();
            genesis.setId(1L);
            genesis.setTimestamp(LocalDateTime.now().withNano(0)); // Truncar a segundos para consistencia
            genesis.setData("Genesis Block");
            genesis.setPreviousHash("0");
            genesis.setCurrentHash(HashUtil.calculateHash(1L, genesis.getTimestamp(), genesis.getData(), "0"));
            blockRepository.save(genesis);
        }
    }

    // Agrega un nuevo bloque al final de la blockchain calculando automáticamente
    // el hash y enlazándolo al anterior
    @Transactional
    public Block addBlock(String data) {
        Block newBlock = new Block();
        newBlock.setTimestamp(LocalDateTime.now().withNano(0)); // Truncar a segundos para consistencia
        newBlock.setData(data);

        Block lastBlock = blockRepository.findTopByOrderByIdDesc().orElse(null); // Obtener último bloque

        if (lastBlock != null) {
            newBlock.setPreviousHash(lastBlock.getCurrentHash());
            newBlock.setId(lastBlock.getId() + 1);
        } else {
            newBlock.setPreviousHash("0"); // Fallback si no existe bloque génesis
            newBlock.setId(1L);
        }

        // Calcular hash con el ID asignado
        String hash = HashUtil.calculateHash(
                newBlock.getId(),
                newBlock.getTimestamp(),
                newBlock.getData(),
                newBlock.getPreviousHash());
        newBlock.setCurrentHash(hash);

        return blockRepository.save(newBlock);
    }

    // Obtiene todos los bloques de la blockchain ordenados por ID
    public List<Block> getAllBlocks() {
        return blockRepository.findAllByOrderByIdAsc();
    }

    // Obtiene un bloque específico por su ID
    public Block getBlockById(Long id) {
        return blockRepository.findById(id).orElse(null);
    }

    // Modifica los datos de un bloque SIN recalcular su hash (para demostrar
    // detección de manipulación)
    @Transactional
    public Block modifyBlock(Long id, String newData) {
        Block block = blockRepository.findById(id).orElse(null);
        if (block != null) {
            block.setData(newData);
            return blockRepository.save(block); // Intencionalmente NO se recalcula el hash
        }
        return null;
    }

    /**
     * Verifica la integridad completa de la blockchain.
     * Comprueba: 1) Hash de cada bloque coincide con el recalculado
     * 2) previousHash de cada bloque coincide con currentHash del anterior
     */
    public BlockchainVerificationResult verifyChain() {
        List<Block> blocks = blockRepository.findAllByOrderByIdAsc();
        BlockchainVerificationResult result = new BlockchainVerificationResult();
        result.setValid(true);
        result.setTotalBlocks(blocks.size());

        if (blocks.isEmpty()) {
            result.addError("Blockchain is empty");
            return result;
        }

        for (int i = 0; i < blocks.size(); i++) {
            Block currentBlock = blocks.get(i);

            // Recalcular hash y verificar que coincide con el almacenado
            String recalculatedHash = HashUtil.calculateHash(
                    currentBlock.getId(),
                    currentBlock.getTimestamp(),
                    currentBlock.getData(),
                    currentBlock.getPreviousHash());

            if (!recalculatedHash.equals(currentBlock.getCurrentHash())) {
                result.addError(String.format(
                        "Block %d: Hash mismatch. Expected: %s, Found: %s (Block has been tampered)",
                        currentBlock.getId(),
                        recalculatedHash,
                        currentBlock.getCurrentHash()));
            }

            // Verificar enlace de la cadena (excepto para el bloque génesis)
            if (i > 0) {
                Block previousBlock = blocks.get(i - 1);
                if (!currentBlock.getPreviousHash().equals(previousBlock.getCurrentHash())) {
                    result.addError(String.format(
                            "Block %d: Previous hash mismatch. Chain is broken between blocks %d and %d",
                            currentBlock.getId(),
                            previousBlock.getId(),
                            currentBlock.getId()));
                }
            } else {
                // Verificar que el bloque génesis tiene previousHash = "0"
                if (!"0".equals(currentBlock.getPreviousHash())) {
                    result.addError(String.format(
                            "Block %d: Genesis block should have previousHash = '0', but found: %s",
                            currentBlock.getId(),
                            currentBlock.getPreviousHash()));
                }
            }
        }

        return result;
    }
}
