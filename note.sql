CREATE DATABASE c13_project_1_group_5;

\c c13_project_1_group_5

CREATE TABLE users(
    id SERIAL primary key,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    gender VARCHAR(255),
    level INTEGER,
    experience INTEGER,
    introduction TEXT,
    rating INTEGER,
    user_icon VARCHAR(255),
    auto_rating BOOLEAN
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
    is_default BOOLEAN
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
INSERT INTO users ( name, email, password ) VALUES ($1,$2,$3)