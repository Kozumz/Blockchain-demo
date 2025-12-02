package com.blockchain.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

// DTO para resultados de verificación de la blockchain con estado de validación y errores
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainVerificationResult {

    private boolean valid; // Indica si la blockchain es válida (false si hay errores)
    private List<String> errors = new ArrayList<>(); // Lista de errores de integridad detectados
    private int totalBlocks; // Número total de bloques verificados

    // Agrega un error a la lista y marca la cadena como inválida
    public void addError(String error) {
        this.errors.add(error);
        this.valid = false;
    }
}
