SELECT event.organizer, user_joining_event.users_id 
FROM event LEFT JOIN user_joining_event 
ON event.id = user_joining_event.event_id 
WHERE event.id = 5;

SELECT users.id, users.experience, user_joining_event.users_id
FROM event INNER JOIN users ON event.organizer = users.id
LEFT JOIN user_joining_event ON event.id = user_joining_event.event_id
WHERE event.id= 5;

SELECT users.id, users.experience, event.id as event_id, rating_event.users_id
FROM users INNER JOIN event ON users.id = event.organizer
LEFT JOIN rating_event ON rating_event.event_id = event.id;

SELECT users.id, users.experience, event.id as event_id, COUNT(rating_event.users_id)
FROM users INNER JOIN event ON users.id = event.organizer
LEFT JOIN rating_event ON rating_event.event_id = event.id
-- WHERE event.id = 5
GROUP BY users.id, users.experience, event.id;

WITH temp AS (
	SELECT event.id as event_id, COUNT(rating_event.users_id)
	FROM event LEFT JOIN rating_event ON rating_event.event_id = event.id
	GROUP BY event.id
)
SELECT users.id, users.experience, temp.event_id, temp.count FROM users
INNER JOIN event ON users.id = event.organizer
INNER JOIN temp ON event.id = temp.event_id;