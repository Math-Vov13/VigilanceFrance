# Build Image
FROM node:current-slim

# Args
ARG CONT_IMG_VER=1.0.0
ARG SERVER_PORT=3000
ARG USER_ID=431
ARG GROUP_ID=433

# Env
ENV CONT_IMG_VER=${CONT_IMG_VER}
ENV PORT=${SERVER_PORT}
ENV NODE_ENV=production

# Build env
COPY . ./app
WORKDIR /app
RUN npm install --only=prod --silent

# Create user (security)
RUN groupadd -r appgroup -g ${GROUP_ID} && \
    useradd -u ${USER_ID} -r -g appgroup -d /app -s /sbin/nologin -c "app user" app-user && \
    chown -R app-user:appgroup /app && \
    chmod -R 774 /app

# Expose Server port
EXPOSE ${SERVER_PORT}

# Connect to user
USER app-user

# Start Server
CMD [ "node", "/app/dist/index.js" ]