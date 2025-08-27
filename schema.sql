-- Table: public.booked_seats

-- DROP TABLE IF EXISTS public.booked_seats;

CREATE TABLE IF NOT EXISTS public.booked_seats
(
    id integer NOT NULL,
    showtime_id character varying COLLATE pg_catalog."default",
    seat_row integer NOT NULL,
    seat_column integer NOT NULL,
    booking_time timestamp with time zone DEFAULT now(),
    user_id integer,
    CONSTRAINT booked_seats_pkey PRIMARY KEY (id),
    CONSTRAINT booked_seats_showtime_id_fkey FOREIGN KEY (showtime_id)
        REFERENCES public.showtimes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT booked_seats_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.booked_seats
    OWNER to postgres;

    -- Table: public.branches

-- DROP TABLE IF EXISTS public.branches;

CREATE TABLE IF NOT EXISTS public.branches
(
    id integer NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    location character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT branches_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.branches
    OWNER to postgres;


-- Table: public.halls

-- DROP TABLE IF EXISTS public.halls;

CREATE TABLE IF NOT EXISTS public.halls
(
    id integer NOT NULL,
    branch_id integer,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    rows integer NOT NULL,
    columns integer NOT NULL,
    unavailable_seats jsonb,
    CONSTRAINT halls_pkey PRIMARY KEY (id),
    CONSTRAINT halls_branch_id_fkey FOREIGN KEY (branch_id)
        REFERENCES public.branches (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.halls
    OWNER to postgres;

-- Table: public.movies

-- DROP TABLE IF EXISTS public.movies;

CREATE TABLE IF NOT EXISTS public.movies
(
    id integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    cast_names text[] COLLATE pg_catalog."default",
    duration integer,
    poster_url text COLLATE pg_catalog."default",
    wide_poster_source text COLLATE pg_catalog."default",
    age_rating character varying(10) COLLATE pg_catalog."default",
    cc character varying(50) COLLATE pg_catalog."default",
    genres text[] COLLATE pg_catalog."default",
    imdb_rating numeric(2,1),
    allowed_preorder_days integer,
    start_date date,
    end_date date,
    CONSTRAINT movies_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.movies
    OWNER to postgres;


-- Table: public.seat_types

-- DROP TABLE IF EXISTS public.seat_types;

CREATE TABLE IF NOT EXISTS public.seat_types
(
    id integer NOT NULL DEFAULT nextval('seat_types_id_seq'::regclass),
    hall_id integer,
    type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    label character varying(255) COLLATE pg_catalog."default" NOT NULL,
    price integer NOT NULL,
    caption text COLLATE pg_catalog."default",
    seat_rows integer[],
    CONSTRAINT seat_types_pkey PRIMARY KEY (id),
    CONSTRAINT seat_types_hall_id_fkey FOREIGN KEY (hall_id)
        REFERENCES public.halls (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.seat_types
    OWNER to postgres;

-- Table: public.showtimes

-- DROP TABLE IF EXISTS public.showtimes;

CREATE TABLE IF NOT EXISTS public.showtimes
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    movie_id integer,
    branch_id integer,
    hall_id integer,
    start_datetime timestamp with time zone,
    CONSTRAINT showtimes_pkey PRIMARY KEY (id),
    CONSTRAINT showtimes_branch_id_fkey FOREIGN KEY (branch_id)
        REFERENCES public.branches (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT showtimes_hall_id_fkey FOREIGN KEY (hall_id)
        REFERENCES public.halls (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT showtimes_movie_id_fkey FOREIGN KEY (movie_id)
        REFERENCES public.movies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.showtimes
    OWNER to postgres;

-- Table: public.upcoming_movies

-- DROP TABLE IF EXISTS public.upcoming_movies;

CREATE TABLE IF NOT EXISTS public.upcoming_movies
(
    id integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    cast_names text[] COLLATE pg_catalog."default",
    duration integer,
    poster_url text COLLATE pg_catalog."default",
    wide_poster_source text COLLATE pg_catalog."default",
    age_rating character varying(10) COLLATE pg_catalog."default",
    genres text[] COLLATE pg_catalog."default",
    releasedate date,
    CONSTRAINT upcoming_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.upcoming_movies
    OWNER to postgres;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    first_name character varying(255) COLLATE pg_catalog."default",
    last_name character varying(255) COLLATE pg_catalog."default",
    mobile character varying(20) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    password_hash character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;


-- Table: public.movie_notifications
-- Stores which upcoming movies a user is interested in.
CREATE TABLE IF NOT EXISTS public.movie_notifications
(
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    CONSTRAINT movie_notifications_pkey PRIMARY KEY (user_id, movie_id),
    CONSTRAINT movie_notifications_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT movie_notifications_movie_id_fkey FOREIGN KEY (movie_id)
        REFERENCES public.upcoming_movies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.movie_notifications
    OWNER to postgres;
