CREATE DATABASE IF NOT EXISTS unga;
CREATE TABLE IF NOT EXISTS `unga`.`users`(
    username varchar(100) PRIMARY KEY,
    password text,
    registered text,
    email text,
    operating_system text
);

CREATE TABLE IF NOT EXISTS `unga`.`platforms`(
    id int PRIMARY KEY,
    name text
);

CREATE TABLE IF NOT EXISTS `unga`.`userPlatformMapping`(
    username varchar(100),
    usernameOfPlatform text,
    platformId integer, 
    FOREIGN KEY(username) REFERENCES `unga`.`users`(username) ON DELETE CASCADE,
    FOREIGN KEY(platformId) REFERENCES `unga`.`platforms`(id) ON DELETE CASCADE,
    PRIMARY KEY(username, platformId)
);

CREATE TABLE IF NOT EXISTS `unga`.`games`(
    id integer PRIMARY KEY auto_increment,
    platform_id integer,
    name text UNIQUE,
    coverImage text,
    FOREIGN KEY(platform_id) REFERENCES `unga`.`platforms`(id)
);

CREATE TABLE IF NOT EXISTS `unga`.`gameUserMapping`(
    game_id integer,
    username varchar(100),
    FOREIGN KEY(game_id) REFERENCES `unga`.`games`(id) ON DELETE CASCADE,
    FOREIGN KEY(username) REFERENCES `unga`.`users`(username) ON DELETE CASCADE,
    PRIMARY KEY(game_id, username)
);

CREATE TABLE IF NOT EXISTS `unga`.`invalidToken`(
    token varchar(200) PRIMARY KEY,
    expiration INTEGER UNSIGNED DEFAULT UNIX_TIMESTAMP() NOT NULL
);

INSERT INTO users VALUES (
    "demo",
    "$2a$10$9n21zUJBEys29m8HeSaqWedZFcYQJ7JRo.SCxIDOcY/4NZUA7x.MG",
    UNIX_TIMESTAMP(),
    "d@d.d",
    "Windows"
);

INSERT INTO `unga`.`platforms` VALUES(
    1,
    "Steam"
);

INSERT INTO `unga`.`platforms` VALUES(
    2,
    "Origin"
);

INSERT INTO `unga`.`platforms` VALUES(
    3,
    "EpicGames"
);

INSERT INTO `unga`.`platforms` VALUES(
    4,
    "UbisoftConnect"
);

INSERT INTO `unga`.`platforms` VALUES(
    5,
    "BattleNET"
);

INSERT INTO `unga`.`userPlatformMapping` VALUES(
    "demo",
    "demo_steam",
    1
);

INSERT INTO `unga`.`userPlatformMapping` VALUES(
    "demo",
    "demo_origin",
    2
);

INSERT INTO `unga`.`userPlatformMapping` VALUES(
    "demo",
    "demo_epic",
    3
);

INSERT INTO `unga`.`userPlatformMapping` VALUES(
    "demo",
    "demo_ubisoft",
    4
);

INSERT INTO `unga`.`userPlatformMapping` VALUES(
    "demo",
    "demo_battlenet",
    5
);

INSERT INTO `unga`.`games`(platform_id, name, coverImage) VALUES(
    2,
    "Battlefield 2042",
    "/images/upload/bf2042.jpg"
);

INSERT INTO `unga`.`gameUserMapping` VALUES(
    (SELECT id FROM `unga`.`games` WHERE name = "Battlefield 2042"),
    "demo"
);

INSERT INTO `unga`.`games`(platform_id, name, coverImage) VALUES(
    2,
    "Battlefield V",
    "/images/upload/bf5.jpg"
);

INSERT INTO `unga`.`gameUserMapping` VALUES(
    (SELECT id FROM `unga`.`games` WHERE name = "Battlefield V"),
    "demo"
);