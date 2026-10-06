from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
app = Flask(__name__)
CORS(app) 
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mapel.db"
app.config["SQLALCHEMY_TRACK_MODIFICATION"] = False
db = SQLAlchemy(app)
class Pelajaran(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String, nullable=False)
    def to_dict(self):
        return{"id":self.id, "nama" : self.nama}
with app.app_context():
    db.create_all()

@app.route("/pelajaran", methods=["GET"])
def get_all():
    pelajaran = Pelajaran.query.all()
    return jsonify( {"results": [p.to_dict() for p in pelajaran]} )
    
@app.route("/pelajaran/<int:id>", methods=["GET"])
def get_one(id):
    p = Pelajaran.query.get_or_404(id)
    return jsonify(p.to_dict())

@app.route("/pelajaran",  methods=["POST"])
def add_data():
    data = request.get_json()
    new_data = Pelajaran( nama = data["nama"] )
    db.session.add(new_data)
    db.session.commit()
    return jsonify(new_data.to_dict())

@app.route("/pelajaran/<int:id>", methods=["PATCH"]) #hanya akan update, pada field yang diinginkan
def update_patch(id):
    data = request.get_json()
    q = Pelajaran.query.get_or_404(id)

    if "nama" in data:
        q.nama = data["nama"]

    db.session.commit()
    return jsonify(q.to_dict())

@app.route("/pelajaran/<int:id>", methods=["PUT"]) # update semua field/ kolom, kecuali ID.
def update_put(id):
    data = request.get_json()
    q = Pelajaran.query.get_or_404(id)
    q.nama = data["nama"]

    db.session.commit()
    return(jsonify(q.to_dict()))

@app.route("/pelajaran/<int:id>", methods=["DELETE"])
def delete_data(id):
    q = Pelajaran.query.get_or_404(id)
    db.session.delete(q)
    db.session.commit()

    return( jsonify({ "message" : "data berhasil dihapus !"}) )

if __name__ =="__main__":
    app.run(debug=True)