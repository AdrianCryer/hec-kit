import Monster from "./monter";
import Room from "./room"

const room = new Room(10, 20);
room.setup();

const monster = new Monster(room);
room.addChild(monster);


