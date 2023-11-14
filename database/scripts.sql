-- Active: 1695088426802@@containers-us-west-165.railway.app@5604@railway
use railway;

describe natural_person;

describe users;


describe estate;

select * from estate inner join posts on estate.post_id = posts.post_id;

alter table users
rename column create_at to created_at ;

alter Table users
modify column password VARCHAR(150) null;

select * from users;