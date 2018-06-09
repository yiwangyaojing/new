# Use alinode:3.11.0 as base image, node version 8.11.0
FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:3.11.0-alpine

COPY package.json /home/node/package.json
COPY yarn.lock /home/node/yarn.lock

# Explanation line by line
# 1. Set yarn registry to Taobao
# 2. Go to /home/node folder
# 3. Install packages to /home/node/node_modules folder
# 4. Fix the ownership and group of node_modules folder
RUN yarn config set registry https://registry.npm.taobao.org && \
    cd /home/node/ && \
    yarn install && \
    chown -R node:node /home/node/node_modules/

# Copy code to the main app folder
COPY . /home/node/app

# Set ENV
ENV HOME=/home/node/ \
    ENABLE_NODE_LOG=YES \
    NODE_LOG_DIR=/home/node/alinode_logs/

# Explanation line by line
# 1. Fix ownership and group of app folder (with out node_modules)
# 2. Link to node_modules
# 3. Fix ownership of soft link
# 4. Create a alinode log folder(NODE_LOG_DIR)
# 5. Fix ownership and group of alinode log folder(NODE_LOG_DIR)
RUN chown -R node:node /home/node/app/ && \
    ln -s /home/node/node_modules/ /home/node/app/node_modules && \
    chown -h node:node /home/node/app/node_modules && \
    mkdir $NODE_LOG_DIR && \
    chown -R node:node $NODE_LOG_DIR

# Set WORKDIR
WORKDIR /home/node/app

# Set the user to use when running this image
USER node

# Rest default alinode ENTRYPOINT ["/start-agenthub.sh"] to empty
# Run app as non-daemon mode
ENTRYPOINT []
CMD yarn run non-daemon-start
