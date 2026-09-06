# Lista de perros 🐶

La idea de este proyecto es dar un pequeño repaso sobre conexiones a una API y sobre eventos. Es una pequeña aplicación web que muestra imágenes de perros aleatorias (obtenidas desde [dog.ceo](https://dog.ceo/dog-api/)) y permite marcarlas como "me gusta" o "no me gusta".

Este repositorio corresponde a la Evaluación Parcial N°1 de Ingeniería DevOps (DOY0101). Se construyó un flujo de trabajo colaborativo aplicando Git, GitHub y GitHub Actions sobre esta base de código.

---

## 🚀 Cómo levantar el proyecto localmente

No requiere instalación de dependencias. Basta con abrir `index.html` en el navegador, o servirlo con cualquier servidor estático simple, por ejemplo:

```bash
npx serve .
```

---

## 🌳 Estrategia de ramificación

Optamos por **Trunk-Based Development (adaptado)**.

En un Trunk-Based Development "puro" normalmente sólo existe una rama principal (`main`/`trunk`) y las ramas de feature viven muy pocas horas o días antes de integrarse. Para efectos de esta evaluación, y respetando el requisito de contar con las ramas `main`, `develop`, `feature/<nombre>` y `hotfix/<nombre>`, adaptamos el modelo así:

- **`develop`** actúa como nuestro **trunk**: es la rama de integración continua donde se fusionan rápidamente los cambios de las ramas `feature/*`. Cada push aquí dispara la validación automática (CI).
- **`main`** representa el código **estable/productivo**. Solo recibe cambios desde `develop` mediante Pull Request, una vez que el código fue validado.
- **`feature/<nombre>`** y **`hotfix/<nombre>`** son ramas de **vida corta**: se crean desde `develop`, contienen un cambio pequeño y acotado, y se fusionan apenas están listas. No se acumulan ramas de larga duración ni releases paralelos como en GitFlow.

**¿Por qué Trunk-Based y no GitFlow completo?**
- El equipo es de **2 personas**: GitFlow (con ramas `release/*`, múltiples ramas de largo plazo, etc.) agrega una complejidad de coordinación que no se justifica para un equipo tan pequeño.
- El proyecto es **pequeño y con cambios frecuentes pero acotados**, lo que calza mejor con integrar seguido a un trunk que mantener ramas abiertas por mucho tiempo.
- Al integrar seguido a `develop`, se reducen los conflictos de merge entre ambos integrantes y se detectan errores más temprano gracias al CI.
- Igual necesitábamos una rama de "colchón" antes de `main` para poder automatizar validaciones antes de llegar a producción — de ahí que `develop` cumpla ese rol de trunk en lugar de hacer push directo a `main`.

---

## 📝 Convenciones de commits

Usamos el formato de **Conventional Commits**: `<tipo>: <descripción breve en minúsculas>`

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un error |
| `chore` | Tareas de mantenimiento (configuración, CI, dependencias) |
| `docs` | Cambios solo de documentación (README, etc.) |

Ejemplos reales usados en este repositorio:
- `feat: agrega contador de likes y dislikes`
- `feat: agrega botón para reiniciar el historial de perros`
- `chore: agrega workflow de integración continua (GitHub Actions)`
- `chore: configura htmlhint para permitir src vacío en la imagen del perro`
- `fix: corregimos que se traba al apretar el botón saltar muchas veces`

Elegimos este formato porque es un estándar ampliamente adoptado, hace el historial de `git log` fácil de leer, y permite identificar de un vistazo si un cambio es riesgoso (`fix`) o simplemente aditivo (`feat`).

---

## 🔀 Convenciones de naming de ramas

- `feature/<nombre-descriptivo>` → para nuevas funcionalidades. Ejemplos: `feature/contador-likes-dislikes`, `feature/boton-reiniciar`.
- `hotfix/<nombre-descriptivo>` → para corrección urgente de errores detectados. Ejemplo: `hotfix/fix-spinner-race-condition`.

Criterio usado: el nombre debe ser corto, en minúsculas, con palabras separadas por guiones (`kebab-case`), y describir **qué hace el cambio**, no quién lo hizo ni cuándo. Esto facilita identificar el propósito de la rama directamente en el listado de GitHub o en un `git branch`.

---

## 🔍 Estrategia de revisión (Pull Requests)

Todo cambio en `feature/*` o `hotfix/*` se integra a `develop` mediante **Pull Request**, nunca con push directo.

Para que un PR sea aprobado debe cumplir:
1. **Título claro**, siguiendo el mismo formato de los commits (ej. `feat: agrega contador de likes y dislikes`).
2. **Descripción breve** de qué cambia y por qué.
3. **Pasar el workflow de GitHub Actions** (validación de estructura y sintaxis de HTML/CSS/JS).
4. **Revisión cruzada**: el otro integrante de la pareja revisa el cambio antes del merge.
5. Al fusionar hacia `develop` se usa **squash and merge**, para mantener el historial limpio y con un commit por funcionalidad. El merge final de `develop` hacia `main` se hace sin squash, para conservar la trazabilidad de todos los commits ya integrados.

---

## ⚙️ Automatización (CI/CD)

Se configuró un workflow de **GitHub Actions** en `.github/workflows/ci.yml` que se dispara automáticamente en dos eventos, sin intervención manual:

- **`push` a `develop`**: valida que el proyecto tenga la estructura de archivos esperada y que el código no tenga errores evidentes de sintaxis, simulando el paso de "integración continua" antes de que el cambio pueda promoverse a producción.
- **`pull_request` hacia `main`**: vuelve a correr la misma validación como último filtro de calidad antes de fusionar a la rama de producción.

El job `validar-proyecto` hace lo siguiente:
1. Descarga el código (`actions/checkout`).
2. Configura Node.js.
3. Verifica que existan `index.html`, `index.js` y `style.css`.
4. Verifica la sintaxis de `index.js` con `node --check`.
5. Valida `index.html` con `htmlhint` (usando un `.htmlhintrc` propio que permite el atributo `src` vacío en la imagen del perro, ya que así funciona intencionalmente antes de la primera carga).

**Rol dentro de un proceso CI/CD real:** este workflow cumple el rol de **Integración Continua (CI)** — automatiza una verificación de calidad que antes se haría manualmente, se ejecuta igual en cada cambio sin depender de que alguien se acuerde de correrla, y actúa como una "puerta de calidad" (quality gate) que impide que código con errores evidentes llegue a `main`. En un flujo más avanzado, este mismo pipeline podría extenderse con un paso de **Despliegue Continuo (CD)** que publique automáticamente `main` en GitHub Pages u otro hosting cada vez que un PR se fusiona.

---

## ✨ Funcionalidades agregadas en esta evaluación

- **Contador de likes/dislikes** (`feature/contador-likes-dislikes`): muestra en pantalla cuántas fotos se han marcado como "me gusta" y "no me gusta".
- **Botón de reiniciar** (`feature/boton-reiniciar`): limpia las galerías de like/dislike y reinicia los contadores a cero.
- **Hotfix: condición de carrera del botón Saltear** (`hotfix/fix-spinner-race-condition`): al presionar "Saltear" muy rápido varias veces seguidas, una respuesta antigua de la API podía llegar después que una más reciente y dejar la imagen/spinner desincronizados. Se corrigió usando un identificador de solicitud (`requestId`) que descarta respuestas obsoletas.

---

## 📁 Estructura de carpetas
Lista-de-perros/
├── .github/
│ └── workflows/
│ └── ci.yml
├── .htmlhintrc
├── index.html
├── index.js
├── style.css
└── README.md

---

## 👥 Autores

- Integrante 1 — Carlos Bastias
- Integrante 2 — Fabián Sánchez

*Proyecto original: repaso de conexión a API y manejo de eventos en JavaScript. Adaptado como base para la Evaluación Parcial N°1, DOY0101 — Ingeniería DevOps.*
