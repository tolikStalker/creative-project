-- we don't know how to generate root <with-no-name> (class Root) :(
create table users
(
    "userLogin"    varchar(255) not null
        primary key,
    "userPassword" varchar(255) not null,
    name           char(32),
    surname        char(32),
    patronymic     char(32),
    city           char(32)
);

alter table users
    owner to postgres;

create table "Posts"
(
    name   char(32)  not null,
    owner  varchar   not null
        constraint "Posts_users_userLogin_fk"
            references users,
    date   timestamp not null,
    "desc" varchar,
    id     serial
        constraint "Posts_pk"
            primary key
);

alter table "Posts"
    owner to postgres;

