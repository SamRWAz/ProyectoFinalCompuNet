# Proyecto Final de CompuNet

Este proyecto consiste en crear una **Tienda en Línea** como parte de nuestro proyecto final de CompuNet. La tienda incluye funcionalidades como administración de productos, carrito de compras, facturación y autenticación segura mediante **JSON Web Token (JWT)**.

---

## Equipo

- **Mariana De La Cruz**
- **Sharik Rueda**
- **Camilo Molina**
- **Samuel Dominguez**

---

## Requisitos para Ejecutar el Proyecto

### Herramientas Previas

1. **Node.js** (v16 o superior)
   - Descárgalo desde [nodejs.org](https://nodejs.org/).
2. **NPM** (v7 o superior)
   - Incluido automáticamente con Node.js.
3. **Editor de Código**
   - Recomendado: [Visual Studio Code](https://code.visualstudio.com/).
4. **Base de Datos JSON Local**
   - Se utiliza un archivo `db.json` ubicado en la carpeta `database` para almacenar datos de usuarios, productos y carritos.

---

## Dependencias del Proyecto

Ejecuta el siguiente comando para instalar todas las dependencias:
bash
npm install



### Lista de Dependencias 

1. **express**
   - Framework para manejar el servidor backend y las rutas.
   bash
   npm install express
   

2. **bcryptjs**
   - Biblioteca para encriptar contraseñas de forma segura.
   bash
   npm install bcryptjs
   
   - **Problemas comunes en Windows**:
     Si tienes problemas al instalar `bcryptjs`, usa los siguientes comandos:
     bash
     npm rebuild bcrypt --build-from-source
     npm install -g node-pre-gyp
     

3. **cors**
   - Middleware para manejar restricciones de CORS, permitiendo solicitudes entre frontend y backend.
   bash
   npm install cors
   

4. **dotenv**
   - Manejo de variables de entorno para claves sensibles como la clave JWT.
   bash
   npm install dotenv
   

5. **body-parser**
   - Middleware para analizar el cuerpo de las solicitudes HTTP (JSON y formularios).
   bash
   npm install body-parser
   

6. **bootstrap**
   - Framework CSS para estilizar el frontend de la aplicación.
   bash
   npm install bootstrap
   

7. **windows-build-tools** (para sistemas Windows si `bcrypt` falla)
   - Herramientas necesarias para compilar dependencias nativas en Windows.
   bash
   npm install --global windows-build-tools
   

---

## Pasos para Ejecutar el Proyecto

1. **Clonar el repositorio**:
   bash
   git clone https://github.com/SamRWAz/ProyectoFinalCompuNet.git
   cd ProyectoFinalCompuNet
   

2. **Instalar dependencias**:
   bash
   npm install
   

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto con contenido similar a:
   env
   SECRET_KEY=tu_clave_secreta
   PORT=3000
   

4. **Ejecutar el servidor**:
   Existen varias opciones:
   - Para desarrollo:
     bash
     npm run dev
     
   - Directamente:
     bash
     node src/app.js
     
   - Usando el comando por defecto:
     bash
     npm start
     

---

## Implementación de Seguridad con JWT

El proyecto utiliza **JSON Web Token (JWT)** para manejar la autenticación. A continuación, se explica el flujo:

1. **Generar un Token**:
   - Se genera al iniciar sesión y contiene datos del usuario como `id`, `email` y `role`.
   - Ejemplo:
     javascript
     const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
     

2. **Proteger Rutas**:
   - El middleware `authMiddleware.verifyToken` verifica que el token sea válido antes de permitir el acceso a ciertas rutas.
   - Ejemplo:
     javascript
     router.get('/cart', authMiddleware.verifyToken, CartController.getCart);
     

3. **Verificar Roles**:
   - Con `authMiddleware.checkRole`, se limita el acceso a rutas dependiendo del rol (admin o cliente).
   - Ejemplo:
     javascript
     router.post('/admin/products', authMiddleware.checkRole(['admin']), ProductController.create);
     

4. **Manejo de Tokens Expirados o Inválidos**:
   - Si un token es inválido o ha expirado, el servidor responde con un error `401 Unauthorized`.

---

## Soluciones a Problemas Comunes

1. **Problemas con `bcryptjs` en Windows**:
   - Si ocurre un error durante la instalación de `bcryptjs`, ejecuta:
     bash
     npm rebuild bcrypt --build-from-source
     npm install -g node-pre-gyp
     

2. **Errores relacionados con herramientas de compilación**:
   - Instala las herramientas de compilación necesarias con:
     bash
     npm install --global windows-build-tools
     

3. **Errores al correr con npm run dev**
    Reinstalar los módulos con la versión actual de Node.js:

    Primero, elimina la carpeta node_modules y el archivo package-lock.json:
     bash
        rm -rf node_modules package-lock.json

        Luego, reinstala las dependencias:

        npm install
     
---

4. *Para ejecutar el proyecto*
Se puede usar cualquiera de estas opciones
    - npm run dev
    - node src/app.js
    - npm start

¡Gracias por revisar el proyecto!
