FROM node:slim as node

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

FROM node as dist
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# build deps
COPY package.json package-lock.json ./
RUN npm install

# TODO ???
COPY . .

# build dist
RUN npm run build

FROM node as node_modules

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# build deps
COPY package.json package-lock.json ./
RUN npm install --production

FROM node

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ARG PORT=5000
ENV PORT $PORT

COPY --from=dist dist /app/dist
COPY --from=node_modules node_modules /app/node_modules

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

EXPOSE $PORT

WORKDIR /app

CMD ["node", "dist/main.js"]