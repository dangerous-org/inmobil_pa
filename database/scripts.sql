-- Active: 1695088426802@@containers-us-west-165.railway.app@5604@railway
use railway;

describe natural_person;

describe users;
alter table users
add column type_account varchar(20);
alter table natural_person
modify column apellido_2 varchar(50);

describe natural_person;

describe companies;

alter table users
drop index user;

show index from users;