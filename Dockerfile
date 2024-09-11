FROM debian:bullseye as builder

ARG NODE_VERSION=18.12.1

# Update and install curl, with better error handling
RUN apt-get update && apt-get install -y curl \
    && curl https://get.volta.sh | bash \
    && /root/.volta/bin/volta install node@${NODE_VERSION} yarn \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH

RUN mkdir /app
WORKDIR /app

ENV NODE_ENV production

COPY . .

RUN npm install --production

RUN apt-get update && apt-get install -y curl \
    && curl https://get.volta.sh | bash \
    && /root/.volta/bin/volta install node@${NODE_VERSION} \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


FROM debian:bullseye

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

CMD [ "npm", "run", "start" ]
