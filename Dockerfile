FROM registry.cn-zhangjiakou.aliyuncs.com/matrix-net/nginx:1.27-alpine3.19

LABEL maintainer = matrix@126.com

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d 
COPY .next/server/app /usr/share/nginx/html