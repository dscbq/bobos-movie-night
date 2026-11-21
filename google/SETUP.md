# Bandeja de títulos en Google Sheets

Solo hace falta hacerlo una vez. Es gratis con una cuenta normal de Google.

## 1. Crear la hoja y el script

1. Entra en [sheets.new](https://sheets.new) con tu cuenta de Google y llama a la hoja **Bobos inbox**.
2. Menú **Extensiones → Apps Script**.
3. Borra lo que haya en `Código.gs` y pega todo el contenido de [inbox.gs](inbox.gs).
4. En la línea `const PASSCODE = 'change-me';` cambia `change-me` por una contraseña vuestra (por ejemplo, tres palabras juntas). No uses ninguna contraseña que ya uses en otro sitio.
5. Guarda (icono del disquete).

## 2. Publicarlo como aplicación web

1. Botón **Implementar → Nueva implementación**.
2. En el engranaje de "Seleccionar tipo", elige **Aplicación web**.
3. Configura:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier usuario
4. Pulsa **Implementar** y autoriza el acceso con tu cuenta.
   - Google mostrará "Google no ha verificado esta aplicación". Es normal porque el script es tuyo: **Configuración avanzada → Ir a Bobos inbox (no seguro)** y acepta.
5. Copia la **URL de la aplicación web** (termina en `/exec`).

"Cualquier usuario" significa que la URL responde sin iniciar sesión, pero sin la contraseña no deja leer ni escribir nada.

## 3. Conectar cada móvil

En la app: **Add titles → Inbox URL + Passcode → Connect**. Se guarda en ese navegador; hay que hacerlo una vez en el móvil de cada uno.

## 4. Para que Claude procese la bandeja

Crea el archivo `google/inbox.local.json` en esta carpeta con este contenido:

```json
{ "url": "https://script.google.com/macros/s/.../exec", "passcode": "vuestra-contraseña" }
```

Ese archivo está en `.gitignore`, así que no se sube a GitHub. Después basta con decir "procesa la bandeja".

## Si cambias el script más adelante

**Implementar → Gestionar implementaciones → editar (lápiz) → Versión: Nueva versión → Implementar.** Así la URL no cambia.
