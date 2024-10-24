FROM node:20.18.0

WORKDIR /app

COPY package.json yarn.lock ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host"]