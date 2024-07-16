const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// 静的ファイルの提供
const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

// ルートURLにアクセスしたときに client.html を返す
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'client.html'));
});

app.post('/save', (req, res) => {
    const newData = req.body;
    const filePath = path.join(__dirname, 'data.json');

    // 既存のデータを読み込む
    fs.readFile(filePath, 'utf8', (err, data) => {
        let existingData = [];
        if (!err) {
            try {
                existingData = JSON.parse(data);
                if (!Array.isArray(existingData)) {
                    existingData = [];
                }
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(500).send('Error saving data');
                return;
            }
        }

        // 新しいデータを追加
        existingData.push(newData);

        // 更新されたデータをファイルに書き込む
        fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                res.status(500).send('Error saving data');
            } else {
                res.send('Data saved to data.json');
            }
        });
    });
});

app.post('/delete', (req, res) => {
    const deleteData = req.body;
    const filePath = path.join(__dirname, 'data.json');

    // 既存のデータを読み込む
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error deleting data');
            return;
        }

        let existingData;
        try {
            existingData = JSON.parse(data);
            if (!Array.isArray(existingData)) {
                existingData = [];
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).send('Error deleting data');
            return;
        }

        // 削除対象のデータをフィルタリング
        existingData = existingData.filter(task => 
            task.task !== deleteData.task || 
            task.deadline !== deleteData.deadline || 
            task.subject !== deleteData.subject
        );

        // 更新されたデータをファイルに書き込む
        fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                res.status(500).send('Error deleting data');
            } else {
                res.send('Data deleted from data.json');
            }
        });
    });
});

app.get('/load', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');

    // ファイルからデータを読み込む
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send('Data not found');
            } else {
                console.error('Error reading file:', err);
                res.status(500).send('Error loading data');
            }
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                res.status(500).send('Error loading data');
            }
        }
    });
});

// 初回起動時に data.json ファイルを作成
const filePath = path.join(__dirname, 'data.json');
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
