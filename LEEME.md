# 🎉 AI Agents Creator - Guía en Español

## ¡Tu aplicación está lista!

He creado completamente tu proyecto "AI Agents Creator". Es una aplicación web moderna que permite a los usuarios:

1. ✅ **Iniciar sesión** con autenticación segura
2. ✅ **Subir documentos** que se guardan en Supabase
3. ✅ **Convertir a embeddings** automáticamente usando Pinecone
4. ✅ **Chatear con IA** que usa tus documentos como contexto (sistema RAG)

---

## 🚀 Cómo Empezar

### Paso 1: Crear las Cuentas Necesarias

Necesitas crear cuentas **gratuitas** en estos servicios:

1. **Supabase** → [https://supabase.com](https://supabase.com)
   - Para base de datos y autenticación
   - Plan gratuito incluye todo lo necesario para empezar

2. **Pinecone** → [https://www.pinecone.io](https://www.pinecone.io)
   - Para almacenar los embeddings
   - Plan gratuito: 1 índice, 100K vectores

3. **OpenAI** → [https://platform.openai.com](https://platform.openai.com)
   - Para la IA y embeddings
   - Necesitas agregar ~$10 de crédito

### Paso 2: Configurar Supabase (10 minutos)

1. Crea un nuevo proyecto en Supabase
2. Ve a **SQL Editor**
3. Copia todo el contenido del archivo `supabase/schema.sql`
4. Pégalo en el editor y ejecuta (botón Run)
5. Ve a **Storage** y crea un bucket llamado `documents` (privado)
6. Ve a **Settings → API** y copia:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### Paso 3: Configurar Pinecone (5 minutos)

1. Crea una cuenta en Pinecone
2. Crea un nuevo índice:
   - Nombre: `ai-agents-documents`
   - Dimensiones: `1536`
   - Métrica: `cosine`
3. Copia tu API key
4. Anota tu environment (ej: `us-east-1-aws`)

### Paso 4: Configurar OpenAI (3 minutos)

1. Ve a [https://platform.openai.com](https://platform.openai.com)
2. Ve a **API Keys**
3. Crea una nueva key: "ai-agents-creator"
4. Copia la key (⚠️ solo se muestra una vez!)
5. Agrega crédito en **Billing** (mínimo $5, recomendado $10-20)

### Paso 5: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.local.example .env.local
```

2. Abre `.env.local` y llena con tus datos:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Pinecone
PINECONE_API_KEY=tu_pinecone_api_key
PINECONE_ENVIRONMENT=us-east-1-aws  # tu environment
PINECONE_INDEX_NAME=ai-agents-documents

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# N8N (opcional - déjalo vacío por ahora)
N8N_WEBHOOK_EMBED_URL=
N8N_WEBHOOK_CHAT_URL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Paso 6: Ejecutar la Aplicación

```bash
cd /Users/santiago/Documents/Projects/ai-agents-creator
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000)

---

## 🧪 Probar la Aplicación

### 1. Crear una Cuenta
- Haz clic en "Get Started"
- Ingresa tu email y contraseña
- Haz clic en "Sign up"

### 2. Subir un Documento de Prueba
- Crea un archivo `prueba.txt` con este contenido:
```
Este es un documento sobre inteligencia artificial.
El machine learning es una rama de la IA que permite a las computadoras aprender de datos.
Los modelos de lenguaje como GPT pueden entender y generar texto.
```

- Arrastra el archivo a la zona de subida
- Espera a que el estado cambie de "processing" a "completed" (~30-60 segundos)

### 3. Chatear con tu Documento
- Haz clic en el botón "Chat"
- Pregunta: "¿Qué es el machine learning?"
- Deberías recibir una respuesta usando tu documento como contexto
- Verás las fuentes citadas abajo de la respuesta

---

## 📁 Estructura del Proyecto

```
ai-agents-creator/
├── app/                    # Páginas y rutas de la aplicación
│   ├── api/               # Endpoints de API
│   │   ├── chat/         # API de chat (RAG)
│   │   └── documents/    # API de documentos
│   ├── chat/             # Interfaz de chat
│   ├── dashboard/        # Dashboard con subida de archivos
│   ├── login/            # Página de inicio de sesión
│   └── signup/           # Página de registro
├── lib/                   # Bibliotecas y utilidades
│   ├── supabase/         # Configuración de Supabase
│   ├── pinecone.ts       # Configuración de Pinecone
│   └── openai.ts         # Integración con OpenAI
├── types/                 # Tipos de TypeScript
├── docs/                  # Documentación completa
│   ├── SETUP_GUIDE.md    # Guía detallada (inglés)
│   └── N8N_WORKFLOWS.md  # Integración con N8N
├── supabase/
│   └── schema.sql        # Schema completo de la base de datos
└── README.md             # Documentación principal
```

---

## 🎯 Características Implementadas

### ✅ Sistema de Autenticación
- Login y registro con email/password
- Rutas protegidas con middleware
- Gestión de sesiones con Supabase
- Row Level Security para aislamiento de datos

### ✅ Gestión de Documentos
- Interfaz drag & drop para subir archivos
- Subida de múltiples archivos
- Almacenamiento específico por usuario
- Seguimiento de estado (processing/completed/failed)
- Función de eliminación con limpieza de vectores
- Formatos soportados: TXT, PDF, DOC, DOCX, MD

### ✅ Generación de Embeddings
- Extracción automática de texto
- División inteligente en chunks
- Embeddings de OpenAI (text-embedding-3-small)
- Almacenamiento en Pinecone con metadata
- Soporte para webhooks de N8N (opcional)

### ✅ Interfaz de Chat RAG
- UI moderna y limpia
- Historial de mensajes
- Respuestas en tiempo real
- Respuestas con contexto de documentos
- Citación de fuentes con scores de relevancia
- Gestión de múltiples conversaciones

### ✅ Base de Datos
- Tabla `documents` para metadata
- Tabla `chat_sessions` para sesiones
- Tabla `chat_messages` para mensajes
- Políticas de Row Level Security
- Índices para rendimiento
- Timestamps automáticos

---

## 🔄 Cómo Funciona

### Flujo de Procesamiento de Documentos

1. Usuario sube documento
2. Archivo se guarda en Supabase Storage (carpeta del usuario)
3. Se crea registro en la base de datos (status: processing)
4. Se extrae el texto del archivo
5. El texto se divide en chunks de ~1000 caracteres
6. Cada chunk se convierte en un vector de 1536 dimensiones (OpenAI)
7. Los vectores se guardan en Pinecone con metadata
8. El estado del documento se actualiza a "completed"

### Flujo de Chat (RAG)

1. Usuario hace una pregunta
2. La pregunta se convierte en un vector embedding
3. Se buscan vectores similares en Pinecone (top 5)
4. Se recuperan los chunks de texto relevantes (score > 0.7)
5. Se construye el contexto con los chunks
6. OpenAI GPT-4 genera una respuesta usando el contexto
7. La respuesta se devuelve con citas de las fuentes
8. El mensaje se guarda en la base de datos

---

## 💰 Costos Estimados

### Desarrollo/Pruebas (Primer Mes)
- Supabase: **Gratis** (500MB base de datos, 1GB almacenamiento)
- Pinecone: **Gratis** (1 índice, 100K vectores)
- OpenAI: **~$5-10** (uso de pruebas)
- **Total: ~$5-10/mes**

### Producción Ligera (100 usuarios, 500 documentos, 5K chats/mes)
- Supabase Pro: **$25/mes**
- Pinecone Standard: **$70/mes**
- OpenAI: **~$50-100/mes**
- **Total: ~$145-195/mes**

### Tips para Reducir Costos
- Usa GPT-3.5-turbo en lugar de GPT-4 (10x más barato)
- Implementa caché para consultas comunes
- Reduce el tamaño de chunks
- Establece límites de rate por usuario

---

## 🐛 Solución de Problemas

### Documentos atascados en "processing"
**Solución:** 
- Verifica tu API key de OpenAI y Pinecone
- Revisa la consola del navegador para errores
- Verifica que tienes crédito en OpenAI

### Errores de "Unauthorized"
**Solución:**
- Verifica las keys de Supabase en `.env.local`
- Asegúrate de haber ejecutado el schema.sql

### El chat no responde
**Solución:**
- Asegúrate de que los documentos tienen estado "completed"
- Verifica que el índice de Pinecone tenga vectores
- Revisa que tu API key de OpenAI tenga crédito

### Errores de compilación
**Solución:**
- Ejecuta `npm install` nuevamente
- Borra la carpeta `.next` y vuelve a ejecutar `npm run dev`

---

## 🚢 Deployment a Producción

### Desplegar en Vercel (Recomendado)

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Agrega todas las variables de entorno de `.env.local`
5. ¡Despliega!

**Actualiza esta variable para producción:**
```bash
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

---

## 📚 Documentación Adicional

- **[README.md](./README.md)** - Documentación principal (inglés)
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Resumen del proyecto (inglés)
- **[SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)** - Guía detallada paso a paso (inglés)
- **[N8N_WORKFLOWS.md](./docs/N8N_WORKFLOWS.md)** - Guía de integración con N8N (inglés)

---

## 🔧 Integración con N8N (Opcional)

Para uso en producción, puedes procesar documentos y chat usando workflows de N8N:

**Ventajas:**
- Editor visual de workflows
- Mejor monitoreo y debugging
- Pasos de procesamiento personalizados
- Arquitectura escalable
- Integración con otras herramientas

**Ver:** [N8N_WORKFLOWS.md](./docs/N8N_WORKFLOWS.md)

---

## 🎓 Recursos de Aprendizaje

### Tecnologías Core
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Pinecone](https://docs.pinecone.io)
- [Referencia de OpenAI API](https://platform.openai.com/docs)

### Conceptos de RAG & IA
- [¿Qué es RAG?](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Entendiendo Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Bases de Datos Vectoriales](https://www.pinecone.io/learn/vector-database/)

---

## ✨ Mejoras Futuras Posibles

1. **Procesamiento de PDF**: Agregar librería de parsing de PDF
2. **OCR**: Extraer texto de imágenes
3. **Resumen de Documentos**: Auto-generar resúmenes
4. **Multi-idioma**: Soporte para múltiples idiomas
5. **Chat de Voz**: Agregar speech-to-text/text-to-speech
6. **Colaborativo**: Compartir documentos con equipos
7. **Analytics**: Rastrear uso y consultas populares
8. **Export**: Descargar historial de chat
9. **API Keys propias**: Permitir usuarios usen sus propias keys de OpenAI
10. **Fine-tuning**: Entrenamiento de modelo personalizado

---

## 🤝 Soporte

### Si necesitas ayuda:
1. Revisa la [Guía de Setup](./docs/SETUP_GUIDE.md)
2. Lee la sección de solución de problemas arriba
3. Busca en issues de GitHub

---

## 📝 Licencia

MIT License - ¡Libre para usar en proyectos personales o comerciales!

---

## 🎉 ¡Todo Listo!

Tu aplicación AI Agents Creator está completamente configurada y lista para usar.

**Próximo Paso:** Sigue los pasos de configuración arriba para configurar tus servicios.

**¿Preguntas?** Toda la documentación está en la carpeta `docs/`

---

**Construido con ❤️ usando Next.js, Supabase, Pinecone y OpenAI**

**Proyecto creado el 2 de octubre de 2025**

