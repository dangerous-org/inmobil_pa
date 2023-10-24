use railway;

describe natural_person;

describe users;
alter table users
add column type_account varchar(20);
alter table natural_person
modify column apellido_2 varchar(50);

describe natural_person;

describe companies;