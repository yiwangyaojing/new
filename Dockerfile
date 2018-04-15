FROM node:8.11-alpine
ADD ./ /run/
CMD cd /run/ &&  npm run docker