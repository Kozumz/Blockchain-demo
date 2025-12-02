package com.blockchain.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Representa un bloque en la blockchain con ID, timestamp, datos y hashes criptográficos
@Entity
@Table(name = "blocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Block {

    @Id
    private Long id; // Identificador único y número secuencial del bloque

    @Column(nullable = false)
    private LocalDateTime timestamp; // Fecha y hora de creación del bloque

    @Column(nullable = false, length = 1000)
    private String data; // Datos almacenados en el bloque (transacción, mensaje, etc.)

    @Column(nullable = false)
    private String previousHash; // Hash del bloque anterior (el génesis tiene "0")

    @Column(nullable = false)
    private String currentHash; // Hash SHA-256 calculado: H(id || timestamp || data || previousHash)
}
