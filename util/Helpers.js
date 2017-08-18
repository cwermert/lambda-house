class Helpers {
  constructor(db) {
    this.db = db;
  }

  saveIP(ip, callback) {
    const address = {
      ip: ip,
      created_at: Date.now()
    }

    this.db.saveIP(address, (err) {
      if (err) {
        callback(err);
      } else {
        console.log("GOOD!");
        callback();
      }
  });
  }
}

module.exports = Helpers;