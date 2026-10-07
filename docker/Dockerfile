# Imagen chica (nginx sobre alpine, ~40MB) porque el proyecto es
# solo HTML/CSS/JS sin build ni backend: no hace falta Node adentro
# de la imagen final, nginx solo sirve los archivos.
FROM nginx:1.27-alpine

# Saca la config por defecto de nginx y pone la nuestra. Como este
# Dockerfile vive en docker/ junto a nginx.conf, la ruta es relativa
# a esa carpeta, no a la raíz del proyecto.
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copia solo lo que el navegador necesita, desde src/. Todo lo demás
# (tests, config, workflow) queda afuera gracias al .dockerignore,
# así la imagen no carga nada de más.
COPY src/index.html /usr/share/nginx/html/index.html
COPY src/index.js /usr/share/nginx/html/index.js
COPY src/perroLogica.js /usr/share/nginx/html/perroLogica.js
COPY src/style.css /usr/share/nginx/html/style.css

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O- http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]