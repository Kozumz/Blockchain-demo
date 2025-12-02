package com.blockchain.demo.util;

import org.apache.commons.codec.digest.DigestUtils;

import java.time.LocalDateTime;

// Utilidad para operaciones de hash criptográfico usando SHA-256
public class HashUtil {

    // Calcula el hash SHA-256 de un bloque: SHA256(id || timestamp || data ||
    // previousHash)
    public static String calculateHash(Long id, LocalDateTime timestamp, String data, String previousHash) {
        String timestampStr = timestamp.toString(); // Formato ISO para consistencia
        String input = id + timestampStr + data + previousHash;
        return DigestUtils.sha256Hex(input);
    }
}
