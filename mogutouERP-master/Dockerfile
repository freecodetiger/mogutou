FROM golang:1.16 AS builder

WORKDIR /app
COPY . .

# 编译Go应用
RUN go build -o mogutou main.go router.go

FROM alpine:latest

WORKDIR /app

# 从builder阶段复制编译好的应用
COPY --from=builder /app/mogutou /app/
COPY --from=builder /app/conf /etc/conf

# 安装必要的依赖
RUN apk --no-cache add ca-certificates tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata

EXPOSE 1988

CMD ["./mogutou", "-c", "/etc/conf/"]
