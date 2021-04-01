FROM node:alpine

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

FROM nginx

EXPOSE 3000

COPY prod-nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /app/build /usr/share/nginx/html

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'