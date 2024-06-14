const fs = require("fs");
const express = require("express");
const db = require("better-sqlite3")("homespan.db");

const port = process.env.SERVER_PORT;

const users = [
  { username: "Tom", password: "Jerry" },
  { username: "Romeo", password: "Juliet" },
];

const app = express();

try {
  db.prepare("SELECT * FROM users").all();
} catch (error) {
  db.exec(
    `
    CREATE TABLE users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT NOT NULL UNIQUE,
      password    TEXT NOT NULL
    );
    CREATE TABLE rooms (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      address     TEXT NOT NULL,
      information TEXT,
      images      TEXT,
      authorId    INTEGER,
      FOREIGN KEY (authorId) REFERENCES users (id)
    );`,
  );

  const stmt = db.prepare(
    "INSERT INTO users (username, password) VALUES (@username, @password)",
  );

  for (const user of users) {
    stmt.run(user);
  }
}

const writeImages = (images) => {
  const imagesSrc = [];
  for (const image of images) {
    const filename = `${new Date().getTime().toString()}.jpg`;
    imagesSrc.push(`http://${process.env.EXPO_PUBLIC_API_URL}/public/${filename}`);
    fs.writeFile(
      `./public/${filename}`,
      image.replace("data:image/jpeg;base64,", ""),
      "base64",
      (err) => {
        console.log(err);
      },
    );
  }
  return imagesSrc;
};

app.use(express.json({ limit: "500mb" }));
app.use("/public", express.static("public"));

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "DELETE,GET,PATCH,POST,PUT");
  res.append("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (res.method == "OPTIONS") res.send(200);
  else next();
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const userInfo = db.prepare(`SELECT * FROM users WHERE username='${username}'`).get();

  if (!userInfo || userInfo.password !== password) {
    res.sendStatus(400);
  } else {
    delete userInfo.password;
    res.status(200).json(userInfo);
  }
});

app.post("/rooms", (req, res) => {
  const { title, address, information, images, authorId } = req.body;
  const author = db.prepare(`SELECT id, username FROM users WHERE id='${authorId}'`);

  if (!author) {
    return res.sendStatus(400);
  }

  const uploadedImages = writeImages(images);

  const newRoomId = db
    .prepare(
      "INSERT INTO rooms (title, address, information, images, authorId) VALUES (@title, @address, @information, @images, @authorId)",
    )
    .run({
      title,
      address,
      information,
      images: JSON.stringify(uploadedImages),
      authorId,
    }).lastInsertRowid;

  res.status(200).json({
    id: newRoomId,
    title,
    address,
    information,
    images: uploadedImages,
    authorId,
  });
});

app.get("/rooms", (req, res) => {
  const authorId = req.query.authorId;
  const stmt = "SELECT * FROM rooms" + (authorId ? ` WHERE authorId='${authorId}'` : "");
  const rooms = db.prepare(stmt).all();

  for (const room of rooms) {
    room.images = JSON.parse(room.images);
    room.author = db
      .prepare(`SELECT id, username FROM users WHERE id='${room.authorId}'`)
      .get();

    delete room.authorId;
  }

  res.status(200).json(rooms);
});

app.delete("/rooms", (req, res) => {
  const roomId = req.query.roomId;
  const userId = req.query.userId;

  const roomInfo = db.prepare(`SELECT * from rooms WHERE id='${roomId}'`).get();

  if (userId !== String(roomInfo.authorId)) {
    return res.sendStatus(403);
  }

  db.prepare(`DELETE FROM rooms WHERE id='${roomId}'`).run();

  res.sendStatus(200);
});

process.on("exit", () => db.close());

app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on ${process.env.EXPO_PUBLIC_API_URL}`),
);
