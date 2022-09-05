CREATE DATABASE IF NOT EXISTS  TestModule3;
USE TestModule3;

CREATE TABLE IF NOT EXISTS City(
    city_id INT(3) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    area INT(255) NOT NULL,
    population INT(255) NOT NULL,
    gdp INT(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

INSERT INTO City (name, region, area, population, gdp, description)
VALUE ('Hà Nội', 'Việt Nam', 3328, 7781000, 40, 'Thủ đô nước Cộng Hòa Xã hội Chủ nghĩa Việt Nam'),
    ('Bắc Kinh', 'Trung Quốc', 16801, 21542000, 458, 'Bắc Kinh là thành phố lớn thứ hai Trung Quốc xét theo số dân đô thị');