CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES (
    'Dan Abramov',
    'https://overreacted.io/writing-resilient-components/',
    'Writing Resilient Components'
);

INSERT INTO blogs (author, url, title) VALUES (
    'Martin Fowler',
    'https://martinfowler.com/articles/is-quality-worth-cost.html',
    'Is High Quality Software Worth the Cost?'
);

INSERT INTO blogs (author, url, title) VALUES (
    'Robert C. Martin',
    'https://blog.cleancoder.com/uncle-bob/2018/12/17/FPvsOO-List-processing.html',
    'FP vs. OO List Processing'
);
