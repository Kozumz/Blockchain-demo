package com.blockchain.demo.controller;

import com.blockchain.demo.dto.AddBlockRequest;
import com.blockchain.demo.dto.BlockchainVerificationResult;
import com.blockchain.demo.dto.ModifyBlockRequest;
import com.blockchain.demo.entity.Block;
import com.blockchain.demo.service.BlockchainService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controlador REST para operaciones de blockchain: gestión de bloques y verificación de integridad
@RestController
@RequestMapping("/api/blocks")
@CrossOrigin(origins = "*")
public class BlockchainController {

    private final BlockchainService blockchainService;

    public BlockchainController(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    // Agrega un nuevo bloque a la blockchain
    @PostMapping
    public ResponseEntity<Block> addBlock(@RequestBody AddBlockRequest request) {
        Block newBlock = blockchainService.addBlock(request.getData());
        return ResponseEntity.status(HttpStatus.CREATED).body(newBlock);
    }

    // Obtiene todos los bloques de la blockchain en orden secuencial
    @GetMapping
    public ResponseEntity<List<Block>> getAllBlocks() {
        List<Block> blocks = blockchainService.getAllBlocks();
        return ResponseEntity.ok(blocks);
    }

    // Obtiene un bloque específico por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Block> getBlockById(@PathVariable Long id) {
        Block block = blockchainService.getBlockById(id);
        if (block != null) {
            return ResponseEntity.ok(block);
        }
        return ResponseEntity.notFound().build();
    }

    // Verifica la integridad de toda la blockchain (consistencia de hashes y
    // enlaces)
    @GetMapping("/verify")
    public ResponseEntity<BlockchainVerificationResult> verifyChain() {
        BlockchainVerificationResult result = blockchainService.verifyChain();
        return ResponseEntity.ok(result);
    }

    // Modifica datos de un bloque SIN recalcular hash (para demostrar detección de
    // manipulación)
    @PutMapping("/{id}")
    public ResponseEntity<Block> modifyBlock(@PathVariable Long id, @RequestBody ModifyBlockRequest request) {
        Block modifiedBlock = blockchainService.modifyBlock(id, request.getData());
        if (modifiedBlock != null) {
            return ResponseEntity.ok(modifiedBlock);
        }
        return ResponseEntity.notFound().build();
    }
}
