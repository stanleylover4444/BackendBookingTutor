# Sử dụng Node.js phiên bản mới nhất
FROM node:18-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy toàn bộ code
COPY . .

# Expose cổng chạy server
EXPOSE 3005

# Chạy ứng dụng
CMD ["yarn", "start"]
