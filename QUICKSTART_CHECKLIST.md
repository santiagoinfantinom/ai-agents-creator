# ✅ Quick Start Checklist

Use esta lista para configurar tu aplicación paso a paso. Marca cada item cuando lo completes.

---

## 📋 Pre-requisitos
- [ ] Node.js 18+ instalado
- [ ] Navegador web moderno
- [ ] Terminal/línea de comandos
- [ ] Editor de código (VS Code recomendado)

---

## 🔑 Paso 1: Crear Cuentas (15 minutos)

### Supabase
- [ ] Ir a https://supabase.com
- [ ] Crear cuenta gratis
- [ ] Crear nuevo proyecto "ai-agents-creator"
- [ ] Esperar a que el proyecto se inicialice (~2 min)
- [ ] ✍️ Guardar: URL del proyecto
- [ ] ✍️ Guardar: anon key
- [ ] ✍️ Guardar: service_role key

### Pinecone
- [ ] Ir a https://www.pinecone.io
- [ ] Crear cuenta gratis
- [ ] Crear nuevo índice:
  - [ ] Nombre: `ai-agents-documents`
  - [ ] Dimensiones: `1536`
  - [ ] Métrica: `cosine`
- [ ] ✍️ Guardar: API key
- [ ] ✍️ Guardar: Environment (ej: us-east-1-aws)

### OpenAI
- [ ] Ir a https://platform.openai.com
- [ ] Crear cuenta o iniciar sesión
- [ ] Ir a API Keys
- [ ] Crear nueva key "ai-agents-creator"
- [ ] ✍️ Guardar: API key (¡solo se muestra una vez!)
- [ ] Ir a Billing → Agregar crédito ($10-20 recomendado)

---

## 🗄️ Paso 2: Configurar Base de Datos (5 minutos)

### En Supabase Dashboard:
- [ ] Ir a SQL Editor
- [ ] Click "New Query"
- [ ] Abrir el archivo `supabase/schema.sql` en tu editor
- [ ] Copiar TODO el contenido
- [ ] Pegar en Supabase SQL Editor
- [ ] Click "Run" (botón verde)
- [ ] Verificar: "Success. No rows returned"
- [ ] Ir a Storage
- [ ] Click "Create a new bucket"
- [ ] Nombre: `documents`
- [ ] Public: **OFF** ❌
- [ ] Click "Create bucket"

---

## ⚙️ Paso 3: Configurar Variables de Entorno (3 minutos)

### En tu terminal:
```bash
cd /Users/santiago/Documents/Projects/ai-agents-creator
cp .env.local.example .env.local
```

### Editar `.env.local`:
- [ ] Abrir `.env.local` en tu editor
- [ ] Llenar `NEXT_PUBLIC_SUPABASE_URL` con tu URL de Supabase
- [ ] Llenar `NEXT_PUBLIC_SUPABASE_ANON_KEY` con tu anon key
- [ ] Llenar `SUPABASE_SERVICE_ROLE_KEY` con tu service role key
- [ ] Llenar `PINECONE_API_KEY` con tu Pinecone API key
- [ ] Llenar `PINECONE_ENVIRONMENT` con tu environment
- [ ] Llenar `PINECONE_INDEX_NAME` → `ai-agents-documents`
- [ ] Llenar `OPENAI_API_KEY` con tu OpenAI key
- [ ] Dejar N8N variables vacías (opcional)
- [ ] Guardar archivo

**Ejemplo de `.env.local` completo:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=ai-agents-documents
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
N8N_WEBHOOK_EMBED_URL=
N8N_WEBHOOK_CHAT_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Paso 4: Ejecutar la Aplicación (2 minutos)

### En tu terminal:
```bash
cd /Users/santiago/Documents/Projects/ai-agents-creator
npm run dev
```

### Verificar:
- [ ] Terminal muestra "✓ Ready on http://localhost:3000"
- [ ] Sin errores en rojo
- [ ] Abrir navegador en http://localhost:3000
- [ ] Ver la página de inicio

---

## 🧪 Paso 5: Probar Todo (10 minutos)

### Crear Cuenta
- [ ] Click "Get Started"
- [ ] Ingresar email (puede ser inventado si Supabase no tiene email configurado)
- [ ] Ingresar contraseña (mínimo 6 caracteres)
- [ ] Click "Sign up"
- [ ] Verificar redirección al Dashboard

### Probar Upload de Documento
- [ ] Crear archivo `test.txt` con contenido:
```
La inteligencia artificial es el estudio de agentes inteligentes.
El machine learning es una rama de la IA.
Los modelos de lenguaje pueden generar texto coherente.
La IA tiene muchas aplicaciones en el mundo real.
```
- [ ] Arrastrar `test.txt` al área de upload
- [ ] Ver documento en la lista
- [ ] Estado inicial: "processing"
- [ ] Esperar 30-60 segundos
- [ ] Verificar estado cambia a "completed" ✅

**Si queda en "processing":**
- Abrir consola del navegador (F12)
- Buscar errores en rojo
- Verificar API keys de OpenAI y Pinecone
- Verificar que tienes crédito en OpenAI

### Probar Chat
- [ ] Click botón "Chat" en Dashboard
- [ ] Ver interfaz de chat
- [ ] Escribir pregunta: "¿Qué es machine learning?"
- [ ] Click "Send"
- [ ] Esperar respuesta (~5-10 segundos)
- [ ] Verificar respuesta usa contexto del documento
- [ ] Ver sección "Sources" con el documento citado
- [ ] Ver relevance score

**Si no responde:**
- Verificar que el documento tiene estado "completed"
- Verificar crédito en OpenAI
- Revisar consola del navegador para errores

### Probar Múltiples Documentos
- [ ] Volver al Dashboard
- [ ] Subir otro documento diferente
- [ ] Esperar a que se complete
- [ ] Ir al Chat
- [ ] Hacer pregunta que involucre ambos documentos
- [ ] Verificar que usa ambos como fuentes

---

## ✅ Verificación Final

### Todo funciona si:
- ✅ Puedes crear cuenta y login
- ✅ Puedes subir documentos
- ✅ Documentos llegan a estado "completed"
- ✅ Chat responde preguntas
- ✅ Chat muestra fuentes relevantes
- ✅ Puedes crear múltiples sesiones de chat
- ✅ Puedes eliminar documentos

---

## 🎯 ¿Qué Hacer Después?

### Personalizar
- [ ] Cambiar colores en `tailwind.config.ts`
- [ ] Modificar texto de landing page en `app/page.tsx`
- [ ] Ajustar prompts de IA en `lib/openai.ts`

### Mejorar
- [ ] Agregar soporte para más tipos de archivo
- [ ] Implementar procesamiento de PDFs
- [ ] Agregar OCR para imágenes
- [ ] Implementar caché para consultas comunes

### Desplegar
- [ ] Subir código a GitHub
- [ ] Conectar con Vercel
- [ ] Agregar variables de entorno en Vercel
- [ ] Desplegar a producción

---

## 🐛 Troubleshooting Rápido

### Problema: Documentos en "processing" por siempre
**Solución:**
1. Abre consola del navegador (F12)
2. Busca errores
3. Verifica OpenAI API key
4. Verifica Pinecone API key y index name
5. Verifica crédito en OpenAI

### Problema: "Unauthorized" al subir
**Solución:**
1. Verifica keys de Supabase en `.env.local`
2. Reinicia servidor: Ctrl+C y `npm run dev`
3. Verifica que ejecutaste el schema.sql

### Problema: Chat no responde
**Solución:**
1. Verifica que hay documentos "completed"
2. Verifica OpenAI API key
3. Verifica crédito en OpenAI
4. Revisa consola del navegador

### Problema: Errores de build
**Solución:**
1. `rm -rf .next`
2. `npm install`
3. `npm run dev`

---

## 📊 Monitoreo de Uso

### Revisar Costos
- [ ] Dashboard de Supabase → Usage
- [ ] Dashboard de Pinecone → Usage
- [ ] Dashboard de OpenAI → Usage

### Primeros días espera:
- Supabase: $0 (plan gratuito)
- Pinecone: $0 (plan gratuito)
- OpenAI: ~$1-5 por pruebas

---

## 📚 Documentación Completa

Si necesitas más detalles:

- **Español:**
  - `LEEME.md` - Guía completa en español

- **Inglés:**
  - `README.md` - Documentación principal
  - `PROJECT_SUMMARY.md` - Resumen del proyecto
  - `docs/SETUP_GUIDE.md` - Guía detallada paso a paso
  - `docs/N8N_WORKFLOWS.md` - Integración con N8N

---

## 🎉 ¡Éxito!

Si todos los checkboxes están marcados, ¡tu aplicación está funcionando perfectamente!

### Próximos Pasos Recomendados:
1. Experimenta con diferentes tipos de documentos
2. Prueba preguntas complejas
3. Personaliza el diseño
4. Agrega más funcionalidades
5. Despliega a producción en Vercel

---

**¿Preguntas?** Revisa la documentación completa en la carpeta `docs/`

**¿Problemas?** Revisa la sección de Troubleshooting arriba

**¡Disfruta tu aplicación AI Agents Creator!** 🚀

