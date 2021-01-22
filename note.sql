CREATE DATABASE c13_project_1_group_5;

\c c13_project_1_group_5

CREATE TABLE users(
    id SERIAL primary key,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 0,
    experience INTEGER DEFAULT 0,
    introduction TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    user_icon VARCHAR(255)
);

CREATE TABLE hiking_trail(
    id SERIAL primary key,
    name VARCHAR(255),
    image_id INTEGER,
    introduction TEXT,
    hardness INTEGER
);

CREATE TABLE image_hiking_trail(
    id SERIAL primary key,
    image VARCHAR(255),
    hiking_trail_id INTEGER,
    FOREIGN KEY (hiking_trail_id) REFERENCES hiking_trail(id)
);

CREATE TABLE event(
    id SERIAL primary key,
    event_name VARCHAR(255),
    meeting_point VARCHAR(255),
    date DATE,
    time TIME,
    max_number_of_member INTEGER,
    joining_number_of_member INTEGER,
    hiking_trail_id INTEGER,
    FOREIGN KEY (hiking_trail_id) REFERENCES hiking_trail(id),
    detail TEXT,
    is_active BOOLEAN
);

CREATE TABLE chatroom(
    id SERIAL primary key,
    users_id INTEGER,
    FOREIGN KEY (users_id) REFERENCES users(id),
    event_id INTEGER,
    FOREIGN KEY (event_id ) REFERENCES event(id),
    content TEXT
);

CREATE TABLE user_joining_event(
    id SERIAL primary key,
    users_id INTEGER,
    FOREIGN KEY (users_id) REFERENCES users(id),
    event_id INTEGER,
    FOREIGN KEY (event_id ) REFERENCES event(id),
    is_default BOOLEAN,
    auto_rating BOOLEAN
);

CREATE TABLE rating_event(
    id SERIAL primary key,
    users_id INTEGER,
    FOREIGN KEY (users_id) REFERENCES users(id),
    event_id INTEGER,
    FOREIGN KEY (event_id) REFERENCES event(id),
    rating_person_id INTEGER,
    FOREIGN KEY (rating_person_id) REFERENCES event(id),
    rating  INTEGER,
    comment TEXT
);

-- users --

-- POST
INSERT INTO users ( user_name , email, password, gender ) VALUES ($1,$2,$3,$4)
INSERT INTO users ( user_name , email, password, gender, introduction ) VALUES ('a','a@a','a','?','aaa');

-- GET
SELECT * FROM users WHERE id = $1
SELECT * FROM users WHERE id = 1;

-- PUT
UPDATE users SET ( user_name , email, password, gender ) = ($1,$2,$3,$4) WHERE id = $5
UPDATE users SET  user_name , email, password, gender ) = ('a','a@a','a','?') WHERE id = 3;

-- events /details --

-- POST
INSERT INTO event ( event_name, meeting_point, date, time, max_number_of_member, joining_number_of_member , hiking_trail_id, detail) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)


