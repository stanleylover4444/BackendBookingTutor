# Sử dụng Node.js phiên bản mới nhất
FROM node:20-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
#RUN npm i --save-dev @types/express
#RUN npm i --save-dev @types/cors

RUN yarn add -D @types/express
RUN yarn add -D @types/cors

COPY package.json yarn.lock ./
RUN yarn install --production

# Copy toàn bộ code
COPY . .

# Expose cổng chạy server
EXPOSE 5000

# Chạy ứng dụng
CMD ["yarn", "start"]
