const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 获取请求的路径
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // 拼接完整的文件路径
    const fullPath = path.join(__dirname, filePath);
    
    // 读取文件并返回
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('文件不存在');
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});