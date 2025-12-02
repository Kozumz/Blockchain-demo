package com.blockchain.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO para modificar datos de un bloque existente (usado para demostrar detección de manipulación)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModifyBlockRequest {

    private String data; // Nuevos datos para reemplazar los datos existentes del bloque
}
