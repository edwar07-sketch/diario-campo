# Diario de Campo — Tesis Doctoral

Aplicación web para registrar observaciones de campo con sincronización automática a OneDrive en formato Word.

## Características

✓ **Interfaz web moderna** — accesible desde cualquier navegador  
✓ **Guardado automático** — cada entrada genera un documento Word actualizado  
✓ **Sincronización con OneDrive** — los datos se guardan directamente en tu carpeta especificada  
✓ **Diseño responsivo** — funciona en celular y computadora  
✓ **Búsqueda y filtros** — encuentra rápidamente tus observaciones  
✓ **Matriz + notas densas** — estructura epistemológica para grounded theory  

## Instalación (5 minutos)

### Paso 1: Instalar Node.js

Si no tienes Node.js instalado:

1. Descargá desde [nodejs.org](https://nodejs.org/)
2. Descargá la versión **LTS** (Long Term Support)
3. Ejecutá el instalador
4. Aceptá todos los pasos por defecto

Para verificar que se instaló correctamente, abrí **Command Prompt** y ejecutá:

```bash
node --version
npm --version
```

Deberías ver versiones (ej: `v18.17.0`).

### Paso 2: Descargá los archivos

1. Descargá la carpeta `diario-campo/` que contiene:
   - `package.json`
   - `server.js`
   - `public/index.html`
   - `README.md` (este archivo)

2. Creá una carpeta en tu computadora, ej: `C:\Users\edwar\Diario-Campo\`

3. Mové todos los archivos a esa carpeta

### Paso 3: Instalá las dependencias

1. Abrí **Command Prompt**
2. Navegá a la carpeta del proyecto:
   ```bash
   cd C:\Users\edwar\Diario-Campo
   ```
3. Ejecutá:
   ```bash
   npm install
   ```
   Esto descargará las librerías necesarias (demora ~1-2 minutos)

### Paso 4: Inicia el servidor

En el mismo Command Prompt, ejecutá:

```bash
npm start
```

Deberías ver algo como:

```
╔════════════════════════════════════════════════╗
║     DIARIO DE CAMPO — Servidor activo         ║
╠════════════════════════════════════════════════╣
║ Abrí en tu navegador: http://localhost:3000   ║
╠════════════════════════════════════════════════╣
║ Carpeta OneDrive: C:\Users\edwar\OneDrive...  ║
║ Archivo Word: Diario_Observaciones.docx       ║
╚════════════════════════════════════════════════╝
```

### Paso 5: Abrí la aplicación

1. En tu navegador (Chrome, Firefox, Edge), andá a:
   ```
   http://localhost:3000
   ```

2. ¡La aplicación está lista para usar!

---

## Uso

### Crear una nueva entrada

1. Tocá **+ Nueva entrada**
2. Completá la **matriz** (información sistemática):
   - Fecha
   - Lugar
   - Perfil del informante
   - Identificador/seudónimo
   - Tipo de contacto
   - Duración aproximada

3. Completá las **notas densas** (escritura reflexiva):
   - Descripción densa
   - Marcadores literales (frases textuales del informante)
   - Memo analítico (a la Charmaz)
   - Conexiones teóricas
   - Reflexividad / posicionalidad
   - Preguntas emergentes

4. Tocá **Guardar y volver**

### ¿Qué pasa cuando guardás?

- La entrada se guarda **en el servidor** (en el archivo `entries.json`)
- Se genera automáticamente un archivo Word **`Diario_Observaciones.docx`**
- Este archivo se guarda **directamente en tu carpeta OneDrive**:
  ```
  C:\Users\edwar\OneDrive\Doc Tesis\Resultados\Datos Organizados\Cualitativos\Observación\
  ```
- El Word contiene **todas tus entradas**, estructuradas y formateadas

### Buscar y filtrar

- Usá el buscador para encontrar entradas por texto, lugar, perfil, etc.
- Todas tus observaciones están indexadas y búsqueda es instantánea

### Ver una entrada

- Tocá cualquier tarjeta para ver los detalles completos
- Podés editar o eliminar desde ahí

---

## Cómo detener el servidor

En Command Prompt, presioná:

```
Ctrl + C
```

Para iniciar nuevamente, ejecutá `npm start` de nuevo.

---

## Estructura de archivos

```
C:\Users\edwar\Diario-Campo\
├── package.json
├── server.js
├── entries.json (se crea automáticamente con tus datos)
├── public/
│   └── index.html
└── node_modules/ (se descarga con npm install)
```

---

## Solucionar problemas

### "Puerto 3000 en uso"
Si el puerto 3000 ya está en uso por otra aplicación, puedes cambiar el puerto en `server.js`:
- En la línea `const PORT = 3000;` cambialó a otro puerto, ej: `const PORT = 3001;`
- Reiniciá el servidor

### "Carpeta OneDrive no existe"
El servidor crea la carpeta automáticamente. Si hay un error de permisos:
- Verificá que la ruta sea correcta: `C:\Users\edwar\OneDrive\...`
- Asegurate de que la carpeta OneDrive esté sincronizada

### "El navegador no carga"
- Verificá que el servidor esté ejecutándose (deberías ver los mensajes en Command Prompt)
- Intentá accediendo a `http://localhost:3000` (con la "h" de http)
- Probá con un navegador diferente (Chrome, Edge, Firefox)

### "Datos no se guardan"
- Verificá que el archivo `entries.json` existe en la carpeta del proyecto
- Abrí Command Prompt en la carpeta y ejecutá `npm start` nuevamente
- Checkeá los mensajes de error en la consola

---

## Integración con tu flujo de tesis

### Exportación a Zotero
El archivo Word (`Diario_Observaciones.docx`) contiene:
- Matriz estructurada para cada entrada
- Secciones de notas densas claramente separadas
- Referencias teóricas listadas

Podés:
1. Abrí el Word en OneDrive
2. Copiá fragmentos relevantes con sus códigos teóricos
3. Pegá directamente en tus memos de Zotero

### Respaldo automático
OneDrive sincroniza el archivo automáticamente:
- Tu `Diario_Observaciones.docx` está siempre en la nube
- Podés acceder desde cualquier dispositivo
- Tenés historial de versiones en OneDrive

---

## Preguntas frecuentes

**¿Se pierden los datos si cierro el servidor?**  
No. Los datos se guardan en `entries.json` en tu computadora y en el Word en OneDrive.

**¿Puedo acceder desde otro dispositivo?**  
Sí, si estás en la misma red WiFi, cambiá `localhost` por la IP de tu computadora. Pedime ayuda si necesitás esta configuración.

**¿Cómo respaldo mis datos?**  
El archivo Word está en OneDrive (automáticamente sincronizado). El `entries.json` está en tu carpeta del proyecto (podés hacer copia de seguridad).

**¿Puedo editar el Word manualmente?**  
Sí, pero los cambios manuales se perderán cuando guardes la próxima entrada desde la app. Es mejor usar la app para cambios.

---

## Soporte

Si hay algún problema, verificá:
1. Node.js está instalado (`node --version` en Command Prompt)
2. Estás en la carpeta correcta (`cd C:\Users\edwar\Diario-Campo`)
3. Ejecutaste `npm install` (revisa si existe `node_modules/`)
4. El servidor inició sin errores (`npm start`)

---

**¡Buena suerte con tu investigación, Edwar! 📓**
