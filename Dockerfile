FROM node:10-alpine

RUN mkdir /app
WORKDIR app
ADD package.json package.json
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python &&\
    npm install --quiet node-gyp -g
RUN npm install --quiet \
    npm cache clean --force \
    apk del native-deps
ADD . .
EXPOSE 1337
CMD ["node","app.js"]