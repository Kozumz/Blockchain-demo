# LEOCOIN - Blockchain Demo

**Autor:** Carlos Josue Moreno Mireles

---

## 📚 Introducción

### ¿Qué es un Hash?

Un **hash** es una función criptográfica que toma una entrada de cualquier tamaño y produce una salida de tamaño fijo (en este caso, 256 bits con SHA-256). Las características principales son:

- **Determinístico**: La misma entrada siempre produce el mismo hash
- **Irreversible**: No se puede obtener la entrada original desde el hash
- **Efecto avalancha**: Un pequeño cambio en la entrada cambia completamente el hash
- **Resistente a colisiones**: Es prácticamente imposible encontrar dos entradas diferentes con el mismo hash

**Ejemplo:**
```
Entrada: "Transferir 100 LEOCOIN"
Hash SHA-256: 68b0d02f4a1c7f42e3d8a9b5c1f2e4d7a8c3b6f1e9d2c5a8b4f7e1d3c6a9b2f5
```

### Concepto Básico de Blockchain

Una **blockchain** es una cadena de bloques enlazados criptográficamente donde:

1. Cada bloque contiene:
   - **Datos**: Información de la transacción
   - **Hash actual**: Huella digital única del bloque
   - **Hash anterior**: Referencia al bloque previo
   - **Timestamp**: Marca de tiempo
   - **ID**: Identificador secuencial

2. Los bloques están **encadenados**: El hash del bloque anterior se incluye en el cálculo del hash del bloque actual

3. **Inmutabilidad**: Si alguien modifica un bloque, su hash cambia, rompiendo la cadena y haciendo evidente la manipulación

Este proyecto simula estos conceptos fundamentales de blockchain de manera educativa.

---

## 🏗️ Estructura de Datos y Lógica de Encadenamiento

### Estructura de un Bloque

Cada bloque en LEOCOIN tiene la siguiente estructura:

```java
public class Block {
    private Long id;                  // Identificador único y secuencial
    private LocalDateTime timestamp;  // Fecha y hora de creación
    private String data;              // Datos de la transacción
    private String previousHash;      // Hash del bloque anterior
    private String currentHash;       // Hash SHA-256 de este bloque
}
```

### Cálculo del Hash

El hash de cada bloque se calcula usando **SHA-256** sobre la concatenación de:

```
Hash = SHA256(id + timestamp + data + previousHash)
```

**Código:**
```java
public static String calculateHash(Long id, LocalDateTime timestamp, 
                                   String data, String previousHash) {
    String timestampStr = timestamp.toString();
    String input = id + timestampStr + data + previousHash;
    return DigestUtils.sha256Hex(input);
}
```

### Lógica de Encadenamiento

1. **Bloque Génesis** (primer bloque):
   - ID: 1
   - previousHash: "0" (no tiene bloque anterior)
   - Se crea automáticamente al iniciar la aplicación

2. **Bloques Subsecuentes**:
   - ID: incrementa secuencialmente (2, 3, 4...)
   - previousHash: toma el `currentHash` del bloque anterior
   - currentHash: se calcula con todos los datos del bloque

3. **Verificación de Integridad**:
   ```
   Para cada bloque:
     1. Recalcular hash con sus datos actuales
     2. Comparar con el hash almacenado
     3. Verificar que previousHash coincida con el hash del bloque anterior
   
   Si alguna verificación falla → Blockchain comprometida
   ```

### Diagrama de Encadenamiento

```
┌─────────────────────┐
│   Bloque Génesis    │
│  ID: 1              │
│  Data: "Genesis"    │
│  prevHash: "0"      │
│  currHash: 68b0d... │
└──────────┬──────────┘
           │
           ▼ (previousHash)
┌─────────────────────┐
│     Bloque 2        │
│  ID: 2              │
│  Data: "Tx 1"       │
│  prevHash: 68b0d... │◄── Referencia al hash anterior
│  currHash: cec09... │
└──────────┬──────────┘
           │
           ▼ (previousHash)
┌─────────────────────┐
│     Bloque 3        │
│  ID: 3              │
│  Data: "Tx 2"       │
│  prevHash: cec09... │◄── Referencia al hash anterior
│  currHash: f3989... │
└─────────────────────┘
```

### Base de Datos

Los bloques se persisten en **SQLite** con el siguiente esquema:

```sql
CREATE TABLE blocks (
    id BIGINT PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    data VARCHAR(1000) NOT NULL,
    previous_hash VARCHAR(255) NOT NULL,
    current_hash VARCHAR(255) NOT NULL
);
```

---

## 📸 Capturas de Pantalla de la Aplicación

### 1. Agregando Registros (Transacciones)

**Panel de Transacciones:**

La interfaz permite crear nuevas transacciones LEOCOIN de manera sencilla:

- **Formulario**: Campo de texto para ingresar los datos de la transacción
- **Botón "Enviar Transacción"**: Crea un nuevo bloque en la blockchain
- **Timeline**: Muestra las 5 transacciones más recientes con:
  - Número de bloque
  - Datos de la transacción
  - Timestamp
  - Hash (primeros 16 caracteres)

**Flujo:**
1. Usuario ingresa: "Transferir 100 LEOCOIN a Alice"
2. Click en "Enviar Transacción"
3. Sistema crea nuevo bloque con:
   - ID automático (siguiente en la secuencia)
   - Timestamp actual
   - Hash calculado automáticamente
   - previousHash del último bloque
4. Notificación de éxito
5. Actualización automática del timeline

---

### 2. Mostrando la Cadena Completa

**Vista de Blockchain:**

Accordion expandible que muestra todos los bloques de la cadena:

- **Badge "GÉNESIS"**: Identifica el primer bloque (azul)
- **Badge "Bloque #N"**: Bloques normales (naranja)
- **Información visible**: Datos de la transacción y timestamp
- **Al expandir un bloque**:
  - **Hash Actual** (verde): Huella digital del bloque
  - **Hash Anterior** (amarillo): Enlace con el bloque previo
  - **ID y Posición**: Ubicación en la cadena
  
**Características:**
- Ordenados cronológicamente (ID ascendente)
- Diseño glassmorphism con efectos de blur
- Colores distintivos para identificar tipos de hash

---

### 3. Verificando la Integridad

**Proceso de Verificación:**

Botón "Verificar Integridad" que ejecuta:

1. **Recálculo de hashes**: Para cada bloque, recalcula el hash usando sus datos actuales
2. **Comparación**: Compara hash calculado vs hash almacenado
3. **Validación de enlaces**: Verifica que previousHash coincida con el hash del bloque anterior
4. **Resultado visual**:
   - ✅ **Alert verde**: "Blockchain Válida - Todos los bloques están íntegros"
   - ⚠️ **Alert rojo**: "Blockchain Comprometida - Se encontraron N error(es)"

**Información mostrada:**
- Total de bloques verificados
- Lista detallada de errores (si existen):
  - "Block X: Hash mismatch. Expected: ABC..., Found: XYZ..."
  - "Block X: Previous hash mismatch. Chain is broken..."

---

### 4. Demostrando la Detección de Alteración

**Panel de Administrador:**

Permite modificar bloques para demostrar cómo se detecta la manipulación:

**Paso 1: Seleccionar Bloque**
- Dropdown con todos los bloques (excepto génesis)
- Búsqueda integrada
- Muestra: "Bloque #N - Datos actuales"

**Paso 2: Modificar Datos**
- Card muestra datos actuales del bloque
- Campo de texto para nuevos datos
- **Importante**: El hash NO se recalcula (intencional para demo)

**Paso 3: Aplicar Modificación**
- Click en "Modificar Bloque"
- Notificación amarilla: "⚠ Bloque Modificado - El bloque ha sido alterado sin recalcular el hash"

**Paso 4: Verificar Detección**
- Click en "Verificar Blockchain"
- Sistema detecta:
  ```
  Block 3: Hash mismatch. Expected: f3989b9d..., Found: cec09545...
  (Block has been tampered)
  
  Block 4: Previous hash mismatch. Chain is broken between blocks 3 and 4
  ```

**Resultado:**
- Alert roja mostrando errores
- Bloques posteriores también fallan (cadena rota)
- Demuestra la inmutabilidad de blockchain

---

## ⚠️ Limitaciones del Sistema

Este proyecto es una **simulación educativa** de blockchain. **NO es una blockchain completa** por las siguientes razones:

### 1. **Falta de Consenso Distribuido**
- ❌ **No hay red P2P**: Solo existe un nodo (servidor único)
- ❌ **No hay mecanismo de consenso**: No implementa Proof of Work, Proof of Stake, etc.
- ✅ **Simulación**: Un solo servidor centralizado maneja toda la blockchain

### 2. **Sin Minería ni Proof of Work**
- ❌ **No hay dificultad**: Los bloques se crean instantáneamente
- ❌ **No hay nonce**: No se busca un hash que cumpla condiciones específicas
- ❌ **No hay recompensas**: No existe incentivo económico para validadores
- ✅ **Simulación**: El hash se calcula directamente sin trabajo computacional

### 3. **Ausencia de Criptografía Asimétrica**
- ❌ **No hay firmas digitales**: Las transacciones no están firmadas
- ❌ **No hay wallets**: No existen claves públicas/privadas
- ❌ **No hay autenticación**: Cualquiera puede crear transacciones
- ✅ **Simulación**: Solo se usa hash SHA-256 para integridad

### 4. **Centralización**
- ❌ **Base de datos única**: SQLite en un solo servidor
- ❌ **Punto único de fallo**: Si el servidor cae, todo se pierde
- ❌ **Control centralizado**: El administrador puede modificar bloques
- ✅ **Simulación**: Demuestra conceptos, no descentralización real

### 5. **Sin Validación de Transacciones**
- ❌ **No hay verificación de saldos**: No se valida si hay fondos suficientes
- ❌ **No hay doble gasto**: No se previene gastar lo mismo dos veces
- ❌ **No hay formato estricto**: Los datos son texto libre
- ✅ **Simulación**: Cualquier texto es válido como transacción

### 6. **Persistencia Local**
- ❌ **No hay replicación**: Los datos solo existen en un lugar
- ❌ **No hay sincronización**: No se comparte con otros nodos
- ✅ **Simulación**: SQLite local para persistencia básica

### 7. **Seguridad Limitada**
- ❌ **Panel admin sin autenticación**: Cualquiera puede modificar bloques
- ❌ **No hay control de acceso**: No existen roles ni permisos
- ❌ **CORS abierto**: Acepta peticiones de cualquier origen
- ✅ **Simulación**: Enfocado en educación, no en seguridad

---

## 🚀 Posibles Mejoras

### Mejoras de Seguridad

#### 1. **Implementar Firma Digital**
```java
// Agregar campos a Block
private String senderPublicKey;
private String signature;

// Firmar transacción
String signature = signTransaction(privateKey, data);

// Verificar firma
boolean valid = verifySignature(publicKey, data, signature);
```

**Beneficios:**
- Autenticación del remitente
- No repudio (el firmante no puede negar la transacción)
- Integridad adicional

#### 2. **Sistema de Wallets**
```java
public class Wallet {
    private KeyPair keyPair;
    private String address;
    private BigDecimal balance;
    
    public Transaction createTransaction(String recipient, BigDecimal amount) {
        // Verificar balance
        // Crear y firmar transacción
    }
}
```

**Beneficios:**
- Gestión de claves públicas/privadas
- Direcciones únicas para usuarios
- Control de propiedad de fondos

### Mejoras de Consenso

#### 3. **Proof of Work (PoW)**
```java
public class Block {
    private int nonce;
    private int difficulty = 4; // Número de ceros iniciales requeridos
    
    public void mineBlock() {
        String target = new String(new char[difficulty]).replace('\0', '0');
        while (!currentHash.substring(0, difficulty).equals(target)) {
            nonce++;
            currentHash = calculateHash();
        }
    }
}
```

**Beneficios:**
- Costo computacional para crear bloques
- Protección contra spam
- Simulación de minería real

#### 4. **Red P2P Multi-Nodo**
```java
public class Node {
    private List<Peer> peers;
    private Blockchain blockchain;
    
    public void broadcastBlock(Block block) {
        peers.forEach(peer -> peer.receiveBlock(block));
    }
    
    public void synchronize() {
        // Obtener blockchain de peers
        // Resolver conflictos (cadena más larga gana)
    }
}
```

**Beneficios:**
- Descentralización real
- Tolerancia a fallos
- Consenso distribuido

### Mejoras de Validación

#### 5. **Validación de Transacciones**
```java
public class Transaction {
    private String sender;
    private String recipient;
    private BigDecimal amount;
    
    public boolean validate() {
        // Verificar firma
        // Verificar balance del sender
        // Verificar formato de direcciones
        return isValid;
    }
}
```

**Beneficios:**
- Prevención de doble gasto
- Validación de saldos
- Integridad de datos

#### 6. **Smart Contracts**
```java
public class SmartContract {
    private String code;
    private Map<String, Object> state;
    
    public Object execute(String method, Object... args) {
        // Ejecutar código del contrato
        // Actualizar estado
        return result;
    }
}
```

**Beneficios:**
- Lógica de negocio programable
- Automatización de acuerdos
- Funcionalidad extendida

### Mejoras de Infraestructura

#### 7. **Base de Datos Distribuida**
- Reemplazar SQLite por Cassandra o MongoDB
- Replicación entre nodos
- Sharding para escalabilidad

#### 8. **API Gateway y Balanceo**
- Nginx como reverse proxy
- Load balancing entre múltiples instancias
- Rate limiting y throttling

#### 9. **Monitoreo y Métricas**
```java
@Metrics
public class BlockchainService {
    @Timed
    public Block addBlock(String data) {
        // Registrar tiempo de ejecución
        // Contar transacciones
        // Alertas de anomalías
    }
}
```

**Herramientas:**
- Prometheus para métricas
- Grafana para visualización
- ELK Stack para logs

### Mejoras de Interfaz

#### 10. **Visualización de Red**
- Gráfico de nodos conectados
- Estado de sincronización
- Métricas en tiempo real

#### 11. **Explorador de Blockchain**
- Búsqueda por hash, dirección, bloque
- Historial de transacciones por wallet
- Estadísticas de la red

#### 12. **WebSocket para Actualizaciones en Tiempo Real**
```typescript
const socket = new WebSocket('ws://localhost:8080/blockchain');

socket.onmessage = (event) => {
    const newBlock = JSON.parse(event.data);
    updateBlockchainView(newBlock);
};
```

**Beneficios:**
- Notificaciones instantáneas de nuevos bloques
- Sincronización automática
- Mejor experiencia de usuario

---

## 🎓 Conclusión

Este proyecto **LEOCOIN** es una excelente herramienta educativa para entender los conceptos fundamentales de blockchain:

✅ **Hashing criptográfico** (SHA-256)  
✅ **Encadenamiento de bloques**  
✅ **Detección de manipulación**  
✅ **Inmutabilidad de datos**  
✅ **Verificación de integridad**  

Sin embargo, es importante recordar que **NO es una blockchain de producción**. Las limitaciones mencionadas son significativas y las mejoras propuestas serían necesarias para un sistema real.

### Uso Recomendado

- 📚 **Educación**: Aprender conceptos de blockchain
- 🧪 **Experimentación**: Probar modificaciones y ver efectos
- 💡 **Demostración**: Mostrar cómo funciona la detección de manipulación
- 🚫 **NO para producción**: No usar para aplicaciones reales

---

**demo - Carlos Josue Moreno Mireles**
