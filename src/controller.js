const fs = require('fs');
const qs = require("qs");
const url = require("url");
const DBConnect = require("./databaseModel");

class Controller {

    constructor() {
        let db = new DBConnect();
        this.conn = db.connect();
    }

    showForm(path, res) {
        let data = fs.readFileSync(path, 'utf-8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write(data);
        res.end();
    }

    navigation(res, location) {
        res.writeHead(301, {'Location' : `${location}`});
        res.end();
    }

    async home(req, res){
        let sql = 'SELECT * FROM city;'
        let results = await this.querySQL(sql);
        let html = '';
        for (let i = 0; i < results.length; i++){
            html += `<tr>`;
            html += `<td>${i+1}</td>`;
            html += `<td><a href="/city?id=${results[i].city_id}">${results[i].name}</a></td>`;
            html += `<td>${results[i].region}</td>`;
            html += `<td><a class="btn btn-success" href="/update?id=${results[i].city_id}">Sửa</a></td>`
            html += `<td><a class="btn btn-danger" href="/delete?id=${results[i].city_id}" >Xóa</a></td>`
            html += `</tr>`;
        }
        let data = fs.readFileSync('./templates/index.html', 'utf8');
        res.writeHead(200, {'Content-Type' : 'text/html'});
        data = data.replace('{ListCity}', html);
        res.write(data);
        res.end();
    }

    add(req, res) {
        if (req.method === "GET") {
            this.showForm('./templates/add.html', res);
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end',  async ()=> {
                let newData = qs.parse(data);
                const sql = `INSERT INTO city (name, region, area, population, gdp, description) VALUES ('${newData.name}','${newData.region}', ${+newData.area},${+newData.population},${+newData.gdp}, '${newData.description}')`
                await this.querySQL(sql);
                this.navigation(res, '/');
            })
        }
    }

    async city(req, res) {
        const id = +qs.parse(url.parse(req.url).query).id;
        let sql = `SELECT * FROM city WHERE city_id = ${id}`
        let result = await this.querySQL(sql);
        let data = fs.readFileSync('./templates/city.html', 'utf-8');
        data = data.replace('{name}', result[0].name);
        data = data.replace('{nameCity}', result[0].name);
        data = data.replace('{region}', result[0].region);
        data = data.replace('{area}', result[0].area);
        data = data.replace('{population}', result[0].population);
        data = data.replace('{gdp}', result[0].gdp);
        data = data.replace('{description}', result[0].description);
        res.writeHead(200, {'Content-Type' : 'text/html'})
        res.write(data)
        res.end()
    }

    async update(req, res){
        const id = +qs.parse(url.parse(req.url).query).id;
        if(req.method === 'GET'){
            let sql = `SELECT * FROM city WHERE city_id = ${id}`
            let result = await this.querySQL(sql);
            let data = fs.readFileSync('./templates/update.html', 'utf-8');
            data = data.replace('{name}', result[0].name);
            data = data.replace(`<div class="form-group"><label >Tên</label><input type="text" class="form-control" name="name" disabled></div>`,`<div class="form-group"><label >Tên</label><input type="text" class="form-control" name="name" value = "${result[0].name}" disabled></div>` );
            data = data.replace(`<div class="form-group"><label>Diện tích</label><input type="number" class="form-control" name="area"></div>`, `<div class="form-group"><label>Diện tích</label><input type=number" class="form-control" name="area" value = "${result[0].area}"> </div>`);
            data = data.replace(`<div class="form-group"><label>Dân số</label><input type="number" class="form-control" name="population"></div>`, `<div class="form-group"><label>Dân số</label><input type="number" class="form-control" name="population" value = "${result[0].population}"></div>`);
            data = data.replace(`<div class="form-group"><label>GDP</label><input type="number" class="form-control" name="gdp"></div>`,`<div class="form-group"><label>GDP</label><input type="number" class="form-control" name="gdp" value = "${result[0].gdp}"></div>`);
            data = data.replace(`<div class="form-group"><label for="comment">Giới thiệu</label><input class="form-control" id="comment" name ='description'></div>`, `<div class="form-group">Giới thiệu</label><input class="form-control" id="comment" name ='description' value="${result[0].description}"></div>`);
            res.writeHead(200, {'Content-Type' : 'text/html'})
            res.write(data);
            res.end();
        }else{
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async () => {
                let newData = qs.parse(data);
                let sql = `UPDATE city
                           SET region = '${+newData.region}',
                               area = ${+newData.area},
                               population = ${+newData.population},
                               gdp = ${+newData.gdp},
                               description = '${newData.description}'
                           WHERE city_id = ${id}`
                await this.querySQL(sql);
                this.navigation(res, '/');
            })
        }
    }

    async delete(req, res) {
        const id = +qs.parse(url.parse(req.url).query).id;
        let sql = `SELECT * FROM city WHERE city_id = ${id}`
        let result = await this.querySQL(sql);
        if(req.method === 'GET'){
            let data = fs.readFileSync('./templates/delete.html', 'utf-8');
            data = data.replace('{name}', result[0].name)
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(data);
            res.end();
        }else {
            let sql = `DELETE FROM city WHERE city_id = ${id}`;
            await this.querySQL(sql);
            this.navigation(res, '/');
        }
    }

    querySQL(sql) {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            })
        })
    }
}

module.exports = Controller;