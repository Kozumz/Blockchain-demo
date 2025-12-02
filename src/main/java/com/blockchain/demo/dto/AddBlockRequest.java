package com.blockchain.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO para solicitud de agregar un nuevo bloque a la blockchain
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddBlockRequest {

    private String data; // Datos/contenido a almacenar en el nuevo bloque
}
