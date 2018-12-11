FROM node:8-alpine

RUN mkdir /app
WORKDIR /app
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python &&\
    npm install --quiet node-gyp -g

ADD package.json package.json

RUN npm install --quiet &&\
    npm cache clean --force &&\
    apk del native-deps make gcc g++ linux-headers
ADD . .
EXPOSE 1337
CMD ["node","app.js"]