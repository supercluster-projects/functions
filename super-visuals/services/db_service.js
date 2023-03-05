class DBService {
  constructor(url, name) {
    this.nano = require('nano')(url);
    this.db = this.nano.db.use(name);
  }
  async login(username, password) {
    console.log('> DBService: login');
    return this.nano.auth(username, password)
      .then((session) => { console.log('> DBService: session =', session); });
  }

  async get(key) {
    return this.db.get(key);
  }

  async update(document, data) {
    return this.db.insert({ ...document, ...data }, document._id);
  }
}

module.exports = DBService;