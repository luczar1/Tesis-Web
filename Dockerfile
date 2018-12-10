FROM node:10-alpine
#RUN apt-get update && \
#    apt-get install -yq --no-install-recommends \
#    git \
#    build-essential \
#    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN mkdir /app
WORKDIR app
ADD package.json package.json
RUN npm install && npm cache clean --force
ADD . .
EXPOSE 1337
CMD ["node","app.js"]