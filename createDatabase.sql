create database mystica_db;

use mystica_db;

create table users(
	user_id int auto_increment primary key,
	user_first_name varchar(50) not null,
	user_last_name varchar(50),
    user_birthday datetime not null,
    user_email varchar(100) unique,
    user_password varchar(100),
    user_avatar varchar(120)
);
