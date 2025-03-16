# 📌 API REST de Usuarios con Autenticación y Roles + Consumo de API de Ghibli

Esta API permite gestionar usuarios con diferentes roles y autenticación basada en JWT.
Integra consumo de datos de la API de **Studio Ghibli** de acuerdo al rol del usuario.
Solo los usuarios admin puede crear otros usuarios admin
---

## 🚀 Instalación y Configuración

### **1️⃣ Clonar el repositorio**
```sh
git clone <URL_DEL_REPOSITORIO>
cd user-api-node
```

### **2️⃣ Instalar dependencias**
```sh
npm install
```

### **3️⃣ Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
MONGODB_URI=tu_url_de_mongodb_atlas
JWT_SECRET=tu_secreto_jwt
PORT=4000
```

### **4️⃣ Iniciar el servidor**
Ejecuta el siguiente comando para levantar el servidor:
```sh
npm run dev
```
Esto iniciará la API en `http://localhost:4000`.

### **5️⃣ Ejecutar los tests**
```sh
npm test
```
Esto ejecutará las pruebas automatizadas con **Jest y Supertest**.

---

## 📌 Endpoints Disponibles

### **🔐 Autenticación**
| Método | Ruta                         | Descripción      |
|--------|------------------------------|------------------|
| `POST` | `/api/auth/register`         | Crear un usuario |
| `POST` | `/api/auth/register/admin`   | Crear un admin   |
| `POST` | `/api/auth/login`            | Iniciar sesión   |

### **👤 Usuarios**
| Método | Ruta                   | Descripción                  |
|--------|------------------------|------------------------------|
| `GET`  | `/api/users`           | Obtener todos los usuarios   |
| `GET`  | `/api/users/:id`       | Obtener un usuario específico|
| `PATCH`| `/api/users/:id`       | Actualizar usuario           |
| `DELETE`| `/api/users/:id`      | Eliminar usuario             |

### **🌍 API de Ghibli**
| Método | Ruta                   | Descripción                                                 |
|--------|------------------------|-------------------------------------------------------------|
| `GET`  | `/api/ghibli`          | Obtener datos de la API de Ghibli según el rol del usuario  |

---

## 📥 Uso de la API con Postman
Puedes importar la colección de Postman con los endpoints preconfigurados desde el siguiente archivo JSON:

📂 **[Descargar Postman Collection](Banpay.postman_collection.json)**

Para usarlo en **Postman**:
1. Abre Postman.
2. Ve a "Importar" y carga el archivo `Banpay.postman_collection.json`.
3. Prueba los endpoints fácilmente.

---

## 📜 Licencia
MIT
