const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// �ÓI�t�@�C���̒�
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// ���[�gURL�ɃA�N�Z�X�����Ƃ��� index.html ��Ԃ�
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.post('/save', (req, res) => {
    const newData = req.body;
    const filePath = path.join(__dirname, 'data.json');

    // �����̃f�[�^��ǂݍ���
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

        // �V�����f�[�^��ǉ�
        existingData.push(newData);

        // �X�V���ꂽ�f�[�^���t�@�C���ɏ�������
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

app.get('/load', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');

    // �t�@�C������f�[�^��ǂݍ���
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});