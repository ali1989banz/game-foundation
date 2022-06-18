const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize",()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})


const gravity = 0.7;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

c.fillRect(0, 0, canvas.width, canvas.height);

class sprite {
  constructor({ pos, v, height, width, color = "red", offset }) {
    this.pos = pos;
    this.v = v;
    this.height = height;
    this.width = width;
    this.lastKey;
    this.speed = 10;
    this.jumpSpeed = 20;
    this.attackBox = {
      position: {
        x: this.pos.x,
        y: this.pos.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.isAttacking = false;
    this.color = color;
  }
  drow() {
    c.fillStyle = this.color;
    c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    // attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  update() {
    this.drow();

    this.pos.y += this.v.y;
    this.pos.x += this.v.x;

    this.attackBox.position.x = this.pos.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.pos.y;

    if (this.pos.y + this.height + this.v.y >= canvas.height) {
      this.v.y = 0;
    } else this.v.y += gravity;
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new sprite({
  pos: {
    x: 0,
    y: 0,
  },
  v: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  width: 50,
  height: 150,
  color: "blue",
});
player.drow();
console.log(player);

const enemy = new sprite({
  pos: {
    x: 400,
    y: 100,
  },
  v: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  width: 50,
  height: 150,
  color: "red",
});
enemy.drow();

function rectangularCollision({ rectangul1, rectangul2 }) {
  return (
    rectangul1.attackBox.position.x + rectangul1.attackBox.width >=
      rectangul2.pos.x &&
    rectangul1.attackBox.position.x <= rectangul2.pos.x + rectangul2.width &&
    rectangul1.attackBox.position.y + rectangul1.attackBox.height >=
      rectangul2.pos.y &&
    rectangul1.attackBox.position.y <= rectangul2.pos.y + rectangul2.height &&
    rectangul1.isAttacking
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "#000";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.v.x = 0;
  enemy.v.x = 0;
  if (keys.a.pressed && player.lastKey == "a") {
    player.v.x = -player.speed;
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.v.x = player.speed;
  }
  if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.v.x = enemy.speed;
  } else if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.v.x = -enemy.speed;
  }
  if (rectangularCollision({ rectangul1: player, rectangul2: enemy })) {
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = `${100-20}px`;
  }
  if (rectangularCollision({ rectangul1: enemy, rectangul2: player })) {
    enemy.isAttacking = false;
    console.log("enemy");
  }
}
animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    // player controls
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (player.v.y == 0) {
        player.v.y = -player.jumpSpeed;
      }
      break;
    case " ":
      player.attack();
      break;
    //enemy arrow controls
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (enemy.v.y == 0) {
        enemy.v.y = -enemy.jumpSpeed;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
