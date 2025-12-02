package com.blockchain.demo.repository;

import com.blockchain.demo.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repositorio para operaciones de base de datos sobre la entidad Block
@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {

    List<Block> findAllByOrderByIdAsc(); // Obtiene todos los bloques ordenados por ID ascendente

    Optional<Block> findTopByOrderByIdDesc(); // Obtiene el último bloque de la cadena (ID más alto)
}
