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
    user_icon VARCHAR(255),
    is_admin BOOLEAN
);

CREATE TABLE hiking_trail(
    id SERIAL primary key,
    name VARCHAR(255),
    introduction TEXT,
    hardness INTEGER
);

CREATE TABLE image_hiking_trail(
    id SERIAL primary key,
    image VARCHAR(255),
    hiking_trail_id INTEGER,
    FOREIGN KEY (hiking_trail_id) REFERENCES hiking_trail(id),
    is_default BOOLEAN
);

CREATE TABLE event(
    id SERIAL primary key,
    event_name VARCHAR(255),
    organizer INTEGER,
    FOREIGN KEY (organizer) REFERENCES users(id),
    meeting_point VARCHAR(255),
    date DATE,
    time TIME,
    max_number_of_member INTEGER,
    joining_number_of_member INTEGER DEFAULT 1,
    hiking_trail_id INTEGER,
    FOREIGN KEY (hiking_trail_id) REFERENCES hiking_trail(id),
    detail TEXT,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE chatroom(
    id SERIAL primary key,
    users_id INTEGER,
    FOREIGN KEY (users_id) REFERENCES users(id),
    event_id INTEGER,
    FOREIGN KEY (event_id ) REFERENCES event(id),
    content TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    FOREIGN KEY (rating_person_id) REFERENCES users(id),
    single_rating  INTEGER,
    comment TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users --

-- POST
INSERT INTO users ( user_name , email, password, gender ) VALUES ($1,$2,$3,$4)
INSERT INTO users ( user_name , email, password, gender, introduction ) VALUES ('a','a@a','a','?','aaa');
INSERT INTO users ( user_name , email, password, gender, introduction ) VALUES ('b','b@b','b','?','bbb');
INSERT INTO users ( user_name , email, password, gender, introduction ) VALUES ('c','c@c','c','?','ccc');
INSERT INTO users ( user_name , email, password, gender, introduction ) VALUES ('d','d@d','d','?','ddd');
INSERT INTO users ( user_name , email, password, gender, introduction, is_admin ) VALUES ('admin','admin@admin.com','admin','?','Im admin',true);


-- GET
SELECT * FROM users WHERE id = $1
SELECT * FROM users WHERE id = 1;

-- PUT
UPDATE users SET ( user_name , email, password, gender ) = ($1,$2,$3,$4) WHERE id = $5
UPDATE users SET ( user_name , email, password, gender ) = ('a','a@a','a','?') WHERE id = 3;

-- events /details --
INSERT INTO event (event_name,organizer,meeting_point,date,time,max_number_of_member,joining_number_of_member,detail,is_active) VALUES ('TaiMoShanHiking!',1,'MONG KOK','2021-01-01', '09:00:00',5,3,'Lets meet at MK then go TaiMoshan',false);

INSERT INTO rating_event (users_id,rating_person_id,single_rating,comment) VALUES (2, 1, 4.0, 'This is a good hiker! I like it');
INSERT INTO rating_event (users_id,rating_person_id,single_rating,comment) VALUES (3, 1, 5.0, 'This guy is handsome, so I gave it 5 stars');
INSERT INTO rating_event (users_id,rating_person_id,single_rating,comment) VALUES (4, 2, 4.0, 'This is a on_ hiker! I hate it');
INSERT INTO rating_event (users_id,rating_person_id,single_rating,comment) VALUES (1, 3, 2.0, 'This guy is ugly, so I gave it 2 stars');



-- POST
INSERT INTO event ( event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail) VALUES ($1,$2,$3,$4,$5,$6,$7)



-- insert image --
INSERT INTO image_hiking_trail (image, hiking_trail_id) VALUES ($1,$2);

-- GET events --
SELECT event.id, image, event_name FROM event INNER JOIN hiking_trail ON event.hiking_trail_id = hiking_trail.id
INNER JOIN image_hiking_trail ON image_hiking_trail.hiking_trail_id = hiking_trail.id;


-- chatroom --

-- POST
INSERT INTO chatroom (users_id, event_id, content) VALUES ($1,$2,$3)
INSERT INTO chatroom (users_id, event_id, content) VALUES (1,1,'hi');

-- GET
SELECT * FROM chatroom WHERE event_id ($1)
SELECT * FROM chatroom WHERE event_id = 1;

-- hiking_trail --

-- POST
INSERT INTO hiking_trail (name, introduction, hardness) VALUES 
('Po Pin Chau(破邊洲)','Po Pin Chau is one of Hong Kong’s less well-known hikes. It starts at East Dam of High Island Reservoir and explores the wild southern coastline of Sai Kung East Country Park. Although this walk is relatively short, it takes about four hours to complete due to the clambering up steep slopes – so be prepared. You will also be weaving through overgrown shrubbery and picking your way through dense woods.',1) ,
('Po Toi(蒲台島)','For a leisurely hike try Po Toi, the most south-easterly of Hong Kong’s islands. It’s almost an hour each way on the ferry, and there are a few different hiking options available. On arrival at Po Toi, take the Po Toi Country Trail along the coast passing the (humdrum) ancient rock carving to the sea cliffs at Nam Kok Tsui, then up to the lighthouse. From here you have two choices: back the way you came (read: plenty of beer time), or climb up the 1,000 steps to the pavilion overlooking the whole island and, on a clear day, far beyond. There’s the third option of the ‘rugged trail’ which fitter hikers should also be able to finish in time for a quick drink and snack before the ferry. Since it’s impossible to get lost on Po Toi, you can split into sub-groups if you’re going in a large crowd. Beer and seafood is available at Ming Kee restaurant.',2) ,
('Tung Lung Chau(東龍島)','Rugged, windswept and diverse, Tung Lung Chau has a little bit of something for everyone. From family-friendly outings to adrenaline-inducing rock climbing sessions, this craggy outcrop has all the tricks to keep you more than entertained for the day. Easily accessible, the island on the tip of Clearwater Bay makes for a convenient full or half-day trip away from the city.',3) ,
('Dragon’s Back(龍脊)','One of the most popular hikes in Hong Kong, Dragon’s Back needs no introduction. The trail offers unrivalled views of Hong Kong’s southern coastline from Shek O to Big Wave Bay. This is also a popular spot for paragliding, so you’ll often find thrill seekers launching off the cliff above you.',4) ,
('Brick Hill (Nam Long Shan)(南朗山)','The hike up Brick Hill gives you unfettered views of Ocean Park and the South China Sea. If you listen closely, you can even hear screams and shouts from the passengers on board the amusement park’s iconic Mine Train rollercoaster. Our only gripe is the somewhat tedious walk to the start of the hike. As there is no public transport that brings you directly to the starting point, you will need to trek 20 minutes uphill along Nam Long Shan Road to get there.',5) ,
('Pok Fu Lam Reservoir to Aberdeen(薄扶林水庫至香港仔)','From a picturesque reservoir surrounded by greeneries to a busy harbour flocked with sampans and small fishing boats, you’ll experience two very different sides of Hong Kong on this short hike. The highlight of the trail is surely the unobstructed views of Aberdeen that you will see as you descend from the top and make your way back to the city. Want to take things up a notch? Hike from The Peak to Aberdeen Reservoirs instead.',6) ,
('Parkview to Jardine’s Lookout(陽明山至畢拿山)','If you’re looking for an easy hike with incredible views, this one is for you. The hike begins at the intersection of Wilson Trail and Hong Kong Trail. Follow the sign that points towards Jardine’s Lookout and you will reach the top in under 30 minutes. From up high, you will have a bird’s eye view of Victoria Harbour and its surrounding skyscrapers. Go back the way you come from to end your hike. If you are up for a challenge, continue the hike to Mount Butler, which involves more stairs going uphill and will take you all the way to Quarry Bay.',7) ,
('Sir Cecil’s Ride and Red Incense Burner Summit(金督馳馬徑至紅香爐峰)','Spanning from Mount Butler to Braemar Hill, this is an easy and relatively flat trail that offers breathtaking views of Hong Kong’s skyline. If you time yourself correctly, you’ll be able to catch the sun set over Victoria Harbour from the Red Incense Burner Summit, a grassy lookout near the end of the trail. There are a few boulders where you can sit on at the summit to watch the day turn into night. This is a popular sunset spot, so get there early to nab a spot. Alternatively, you can take a taxi and get off at Chinese International School. From there, it’s only a 15 minute walk to Red Incense Burner Summit.',8) ,
('Black Hill(五桂山)','Black Hill lies between Lam Tin and Tiu Keng Leng on the eastern side of Kowloon. The mountain is infamous for being a haunted hike since its Cantonese name means ‘five ghosts’. But don’t be deceived by the spooky tale, as the view above says otherwise. Black Hill ridges offer several major peaks with the highest reaching 304 metres above sea level, so trek along to view the eastern harbour from above.',9);

-- image_hiking_trail --

INSERT INTO image_hiking_trail ( image, hiking_trail_id, is_default ) VALUES 
( 'PoPinChan.jpg', 1, true),
( 'po-toi-island.jpg', 2, true),
( 'Tung Lung Chau.jpg', 3, true),
( 'Dragon’s Back.jpg', 4, true),
( 'Brick Hill (Nam Long Shan).jpg', 5, true),
( 'Pok Fu Lam Reservoir to Aberdeen.jpg', 6, true),
( 'Parkview to Jardine’s Lookout.png', 7, true),
( 'Sir Cecil’s Ride and Red Incense Burner Summit.jpg', 8, true),
( 'Black Hill.jpg', 9, true ) ;