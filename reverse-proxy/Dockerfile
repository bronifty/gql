FROM nginx

COPY default.conf /etc/nginx/conf.d/default.conf

CMD /bin/bash -c "envsubst '\$PORT \$FRONTEND_URL \$BACKEND_URL' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
