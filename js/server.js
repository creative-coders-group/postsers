const http = require("http");
const fs = require("fs/promises");

console.clear();

const sr = http.createServer(async (req, res) => {
  // main page
  if (req.url === "/") {
    const mainhtml = await fs.readFile("../html/index.html");
    res.setHeader("Content-Type", "text/html");
    res.end(mainhtml);
  }

  // each users posts
  else if (/users\/+\d+$/.test(req.url)) {
    const poster = await fs.readFile("../html/poster.html");
    res.setHeader("Content-Type", "text/html");
    res.end(poster);
  }

  // login page
  else if (req.url === "/login") {
    const loghtml = await fs.readFile("../html/login.html");
    res.setHeader("Content-Type", "text/html");
    res.end(loghtml);
  }

  // users page
  else if (req.url === "/users" && req.method == "GET") {
    const usershtml = await fs.readFile("../html/users.html");
    res.setHeader("Content-Type", "text/html");
    res.end(usershtml);
  }

  // profile page
  else if (req.url === "/profile") {
    const profilehtml = await fs.readFile("../html/profile.html");
    res.setHeader("Content-Type", "text/html");
    res.end(profilehtml);
  }

  // posts page
  else if (req.url === "/posts") {
    const postshtml = await fs.readFile("../html/posts.html");
    res.setHeader("Content-Type", "text/html");
    res.end(postshtml);
  }

  // user json file
  else if (req.url === "/user" && req.method == "GET") {
    const users = await fs.readFile("../data/data.json");
    res.setHeader("Content-Type", "application/json");
    res.end(users);
  }

  // posting a user
  else if (req.url === "/users" && req.method == "POST") {
    const userss = await fs.readFile("../data/data.json");
    let datas = userss ? JSON.parse(userss) : [];
    let data = "";
    req.on("data", (buffer) => (data += buffer));
    let ididid;
    req.on("end", async () => {
      data = JSON.parse(data);
      for (const h of datas) {
        if (h.name == data.name && h.password == data.password) {
          ididid = h.id;
        }
        if (h.name == data.name && h.password != data.password) {
          return false;
        }
        if (h.name != data.name && h.password == data.password) {
          return false;
        }
      }
      if (!ididid) {
        let obj = {};
        obj.id = datas.length + 1;
        obj.name = data.name;
        obj.password = data.password;
        obj.posts = [];
        ididid = obj.id;
        console.log(ididid);
        datas.push(obj);
        await fs.writeFile("../data/data.json", JSON.stringify(datas, null, 4));
      }
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(ididid));
    });
  }

  // posting a post
  else if (req.url === "/postfromprofile" && req.method == "POST") {
    const userss = await fs.readFile("../data/data.json");
    let datas = userss ? JSON.parse(userss) : [];
    let data = "";
    req.on("data", (buffer) => (data += buffer));
    req.on("end", async () => {
      data = JSON.parse(data);
      let usery = datas.find((e) => e.id == data.id);

      if (usery) {
        let posty = {};
        posty.title = data.title;
        posty.textContent = data.textContent;
        posty.date = data.date;
        usery.posts.push(posty);
        await fs.writeFile("../data/data.json", JSON.stringify(datas, null, 4));
      }
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Posted!!!" }));
    });
  }

  // erroring
  else res.end("errrrror");
});

sr.listen(2500, () => console.log(">>>server is jungling"));
